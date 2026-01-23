import { Footer } from '../src/js/Footer.js';

describe('Footer', () => {
  it('should return footer HTML', () => {
    const footer = Footer();
    expect(footer).toContain('© 2024 DefiDungeons');
  });
});
