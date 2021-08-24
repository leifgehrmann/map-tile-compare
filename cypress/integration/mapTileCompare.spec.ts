describe('map-tile-compare', () => {
  beforeEach(() => {
    const host = Cypress.env('MAP_TILE_COMPARE_HOST');
    if (typeof host !== 'string' || host === '') {
      throw new Error('cypress environment variable MAP_TILE_COMPARE_HOST is not set');
    }
    cy.visit(host);
  });

  it('compare slider should appear', () => {
    cy.contains('Click to Load Map').click();
    cy.get('button img[alt="Show labels"]').click();
    cy.get('button img[alt="Show comparison"]').click();
    cy.get('.compare-swiper-vertical').should('have.length', 1);
    cy.get('button img[alt="Expand image"]').click();
    cy.get('button img[alt="Close image"]').click();
    cy.get('button img[alt="Show labels"]').click();
    cy.get('button img[alt="Show comparison"]').click();
  });
});
