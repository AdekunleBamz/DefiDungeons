;; DefiDungeons: Professional Stacks Gameplay Contract
;; Author: DefiDungeons Team
;; Version: 1.1 (Clarity 4)

;; --------------------------------------------------------------------------
;; Traits
;; --------------------------------------------------------------------------

(define-trait token-trait (
    (get-balance
        (principal)
        (response uint uint)
    )
    (transfer
        (principal principal uint)
        (response bool uint)
    )
))

;; --------------------------------------------------------------------------
;; Constants & Errors
;; --------------------------------------------------------------------------

(define-constant CONTRACT_OWNER tx-sender)

;; Error Codes
(define-constant ERR-INSUFFICIENT-BALANCE (err u1001))
(define-constant ERR-UNAUTHORIZED (err u1002))
(define-constant ERR-INVALID-TOKEN (err u1003))
(define-constant ERR-NOT-CONTRACT-OWNER (err u1004))
(define-constant ERR-INVALID-PRINCIPAL (err u1005))
(define-constant ERR-PENDING-OWNER-ONLY (err u1006))
(define-constant ERR-DUNGEON-COOLDOWN (err u1007))
(define-constant ERR-ITEM-CRAFT-FAILED (err u1008))

;; Game Constants
(define-constant ENTRY_COST u100)
(define-constant REWARD_AMOUNT u200)
(define-constant DUNGEON_COOLDOWN_BLOCKS u100)

;; --------------------------------------------------------------------------
;; Data Definitions
;; --------------------------------------------------------------------------

;; Ownership
(define-data-var contract-owner principal tx-sender)
(define-data-var pending-owner (optional principal) none)

;; Configuration
(define-data-var allowed-token principal 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.my-token)
(define-data-var dungeon-manifest (string-ascii 100) "Enter if you dare!")

;; Player Stats
(define-map player-dungeon-stats
    { player: principal }
    {
        last-dungeon-block: uint,
        total-dungeons-completed: uint,
        total-rewards-earned: uint,
        xp: uint,
    }
)

;; --------------------------------------------------------------------------
;; Private Helpers
;; --------------------------------------------------------------------------

(define-private (is-contract-owner)
    (is-eq tx-sender (var-get contract-owner))
)

(define-private (is-valid-token (token <token-trait>))
    (is-eq (contract-of token) (var-get allowed-token))
)

;; --------------------------------------------------------------------------
;; Administrative Functions
;; --------------------------------------------------------------------------

(define-public (set-allowed-token (new-token principal))
    (begin
        (asserts! (is-contract-owner) ERR-NOT-CONTRACT-OWNER)
        (var-set allowed-token new-token)
        (ok true)
    )
)

(define-public (set-dungeon-manifest (new-manifest (string-ascii 100)))
    (begin
        (asserts! (is-contract-owner) ERR-NOT-CONTRACT-OWNER)
        (var-set dungeon-manifest new-manifest)
        (ok true)
    )
)

;; --------------------------------------------------------------------------
;; Core Gameplay Functions
;; --------------------------------------------------------------------------

;; @desc Enter the dungeon. Requires entry fee and cooldown check.
;; @param token: The SIP-10 token used for entry
(define-public (enter-dungeon (token <token-trait>))
    (let (
            (player tx-sender)
            (current-block burn-block-height) ;; Use actual burn-block-height
            (player-stats (default-to {
                last-dungeon-block: u0,
                total-dungeons-completed: u0,
                total-rewards-earned: u0,
                xp: u0,
            }
                (map-get? player-dungeon-stats { player: player })
            ))
        )
        ;; Verify token contract
        (asserts! (is-valid-token token) ERR-INVALID-TOKEN)

        ;; Check cooldown
        (asserts!
            (>= current-block
                (+ (get last-dungeon-block player-stats) DUNGEON_COOLDOWN_BLOCKS)
            )
            ERR-DUNGEON-COOLDOWN
        )

        ;; Transfer entry fee
        ;; Note: In a real scenario we'd transfer TO the contract. 
        ;; Assuming 'transfer' is (sender, recipient, amount)
        (try! (contract-call? token transfer player (as-contract tx-sender) ENTRY_COST))

        ;; Update player dungeon stats (resetting cooldown trigger mostly handled by block check)
        (map-set player-dungeon-stats { player: player } {
            last-dungeon-block: current-block,
            total-dungeons-completed: (get total-dungeons-completed player-stats),
            total-rewards-earned: (get total-rewards-earned player-stats),
            xp: (get xp player-stats),
        })

        (ok true)
    )
)

;; @desc Complete the dungeon to earn rewards and XP.
;; @param token: The SIP-10 token used for rewards
(define-public (complete-dungeon (token <token-trait>))
    (let (
            (player tx-sender)
            (current-block burn-block-height)
            (player-stats (default-to {
                last-dungeon-block: u0,
                total-dungeons-completed: u0,
                total-rewards-earned: u0,
                xp: u0,
            }
                (map-get? player-dungeon-stats { player: player })
            ))
        )
        ;; Verify token contract
        (asserts! (is-valid-token token) ERR-INVALID-TOKEN)

        ;; Transfer reward to player
        (try! (as-contract (contract-call? token transfer tx-sender player REWARD_AMOUNT)))

        ;; Update player dungeon stats
        (map-set player-dungeon-stats { player: player } {
            last-dungeon-block: current-block,
            total-dungeons-completed: (+ (get total-dungeons-completed player-stats) u1),
            total-rewards-earned: (+ (get total-rewards-earned player-stats) REWARD_AMOUNT),
            xp: (+ (get xp player-stats) u50),
        })

        (ok true)
    )
)

;; @desc Craft an item by combining materials. (Demo of list operations)
;; @param material-ids: A list of up to 5 material IDs
(define-public (craft-item (material-ids (list 5 uint)))
    (let (
            ;; Example: Sum materials to get outcome
            (craft-power (fold + material-ids u0))
        )
        (if (> craft-power u10)
            (ok "Legendary Item Crafted")
            (ok "Common Item Crafted")
        )
    )
)

;; --------------------------------------------------------------------------
;; Read-Only Functions
;; --------------------------------------------------------------------------

(define-read-only (get-player-stats (player principal))
    (ok (map-get? player-dungeon-stats { player: player }))
)

(define-read-only (get-dungeon-manifest)
    (ok (var-get dungeon-manifest))
)

;; @desc Get contract version
(define-read-only (get-contract-version)
    (ok "1.1.0")
)

;; @desc Get contract owner
(define-read-only (get-contract-owner)
    (ok (var-get contract-owner))
)

;; @desc Get entry cost
(define-read-only (get-entry-cost)
    (ok ENTRY_COST)
)

;; --------------------------------------------------------------------------
;; Ownership Transfer (Standard 2-Step)
;; --------------------------------------------------------------------------

(define-public (transfer-ownership (new-owner principal))
    (begin
        (asserts! (is-contract-owner) ERR-NOT-CONTRACT-OWNER)
        (asserts! (not (is-eq new-owner (var-get contract-owner)))
            ERR-INVALID-PRINCIPAL
        )
        (var-set pending-owner (some new-owner))
        (ok true)
    )
)

(define-public (accept-ownership)
    (let ((pending (unwrap! (var-get pending-owner) ERR-PENDING-OWNER-ONLY)))
        (asserts! (is-eq tx-sender pending) ERR-UNAUTHORIZED)
        (var-set contract-owner pending)
        (var-set pending-owner none)
        (ok true)
    )
)
