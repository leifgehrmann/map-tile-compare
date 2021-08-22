
describe('map-tile-compare', () => {
  beforeEach(() => {
    const host = Cypress.env('MAP_TILE_COMPARE_HOST')
    if (typeof host !== 'string' || host === '') {
      throw new Error('cypress environment variable MAP_TILE_COMPARE_HOST is not set')
    }
    cy.visit(host)
  })

  it('compare slider should appear', () => {
    cy.get('.compare-swiper-vertical').should('have.length', 1)
  })
})
