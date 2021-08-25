describe('map-tile-compare', () => {
  beforeEach(() => {
    const host = Cypress.env('MAP_TILE_COMPARE_HOST');
    if (typeof host !== 'string' || host === '') {
      throw new Error('cypress environment variable MAP_TILE_COMPARE_HOST is not set');
    }
    const configUrl = 'https://tiles.leifgehrmann.com/configs/edinburgh_2.json';
    cy.visit(`${host}#${configUrl}`);
  });

  it('compare slider should appear', () => {
    cy.contains('Click to Load Map').click();
    cy.get('button[aria-label="Toggle labels"]').click();
    cy.get('button[aria-label="Toggle compare mode"]').click();
    cy.get('.compare-swiper-vertical').should('have.length', 1);
    cy.get('button[aria-label="Expand reference photo"]').click();
    cy.get('button[aria-label="Close reference photo"]').click();
    cy.get('button[aria-label="Toggle labels"]').click();
    cy.get('button[aria-label="Toggle compare mode"]').click();
  });
});
