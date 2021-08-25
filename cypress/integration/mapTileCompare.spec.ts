describe('map-tile-compare', () => {
  beforeEach(() => {
    const hashData = 'N4IgdghgtgpiBcICiATAlmARgVwE4HMALEAGhEwGUEQoIAHTAewA94B6NgZwBcBPAGxic2gtADN8MQrlpgwbAMYBrTiigA2GJgBuAZmwAOACwBGAOx0T0GNoXqU60uQoBBACrU6SgHQxeAKRMASQArRjRMAHEANToALSgUfggACX9uAE0AdQBWbCC0AHc0DIog9SClI0KINwA5RhhIgFlxAEVvXQAmAAYAYQAlMByjPv8qkwBaABFMKCM0CgAZNqdKACEloOpubDkYfkmeXBgYbkmoDEZcSf5GQqdOD0RCbm46TnY2bjRBTm9RBIpDIIHJvApGFBvr8hGwYOgsHgiAB9LpsYAALwAvujmDjgLwsd46GB8I83BQFDsoJxyRQ0Agujl1GROK0wAgTD1Wc0IMxOTlWesEABtSa6bxGdRdEg5HLeAw9EwkcXeHoATgMXQMsvlmpMAF0yLgAApBACq1Fe70+HB+fwBMHEkmksjA4MhbDoJ20aBghWE8IwOAIhFR3hCdDJWKAA';
    const host = Cypress.env('MAP_TILE_COMPARE_HOST');
    if (typeof host !== 'string' || host === '') {
      throw new Error('cypress environment variable MAP_TILE_COMPARE_HOST is not set');
    }
    cy.visit(`${host}#${hashData}`);
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
