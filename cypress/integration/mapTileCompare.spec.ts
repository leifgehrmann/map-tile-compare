// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface cy {
    all(...commands: Cypress.Chainable[]): Cypress.Chainable
    queue: any
  }
  interface Chainable {
    chainerId: string
    ___CY_ALL_CHAIN_START___: any
  }
}

const chainStart = '___CY_ALL_CHAIN_START___';
cy.all = function (...commands) {
  const { _ } = Cypress;
  // eslint-disable-next-line
  const chain = cy.wrap(null, { log: false })
  const stopCommand = _.find(cy.queue.get(), {
    attributes: { chainerId: chain.chainerId },
  });
  const startCommand = _.find(cy.queue.get(), {
    attributes: { chainerId: commands[0].chainerId },
  });
  const p = chain.then(() => (
    _(commands)
      .map((cmd) => (cmd[chainStart]
        ? cmd[chainStart].attributes
        : _.find(cy.queue.get(), {
          attributes: { chainerId: cmd.chainerId },
        }).attributes))
      .concat(stopCommand.attributes)
      .slice(1)
      .flatMap((cmd) => cmd.prev.get('subject'))
      .value()
  ));
  p[chainStart] = startCommand;
  return p;
};

// The above code is copied from this GitHub thread:
// https://github.com/cypress-io/cypress/issues/915#issuecomment-901911155

function resolveElement(elements: JQuery): HTMLElement {
  if (elements.length !== 1) {
    throw new Error('Unexpected number of elements found');
  }
  return elements[0];
}

function swipe(direction: {x: number, y: number}, selector: string, cancel = false) {
  const touchCommandSequence = cy.get(selector)
    .trigger('touchstart', {
      touches: [{ clientX: 0, clientY: 0 }],
    })
    // Simulate touchmove with an empty touches list (for code-coverage sake)
    .trigger('touchmove', { touches: [] })
    .trigger('touchmove', {
      touches: [{ clientX: direction.x, clientY: direction.y }],
    });
  if (cancel) {
    touchCommandSequence.trigger('touchcancel');
  } else {
    touchCommandSequence.trigger('touchend');
  }
}

const loadMapButtonText = 'Click to Load Map';
const referencePhotoSelector = 'img[alt="Reference photo associated with the map"]';
const referencePhotoExpandSelector = 'button[aria-label="Expand reference photo"]:visible';
const referencePhotoCloseSelector = 'button[aria-label="Close reference photo"]:visible';
const toggleLabelsSelector = 'button[aria-label="Toggle labels"]';
const toggleCompareSelector = 'button[aria-label="Toggle compare mode"]';

describe('map-tile-compare', () => {
  beforeEach(() => {
    const host = Cypress.env('MAP_TILE_COMPARE_HOST');
    if (typeof host !== 'string' || host === '') {
      throw new Error('cypress environment variable MAP_TILE_COMPARE_HOST is not set');
    }
    const configUrl = 'https://tiles.leifgehrmann.com/configs/edinburgh_2.json';
    cy.viewport(375, 800); // Roughly the size of an iPhone X.
    cy.visit(`${host}#${configUrl}`);

    // Wait for the reference photo to load
    cy.get(referencePhotoSelector)
      .should('be.visible')
      .and((elements) => {
        // "naturalWidth" and "naturalHeight" are set when the image loads
        const imageElement = elements[0] as HTMLImageElement;
        expect(imageElement.naturalWidth).to.be.greaterThan(0);
      });
  });

  describe('before the map has been loaded', () => {
    it('will update the width and x-offset of the reference photo when the page is resized', () => {
      cy.viewport(400, 700);
      cy.wait(500);
      cy.get(referencePhotoSelector).then((elements) => {
        const element = resolveElement(elements);
        cy.wrap(element.getBoundingClientRect()).as('photoRectBefore');
      });
      cy.viewport(500, 500);
      cy.wait(500); // Wait for JS/CSS to take effect.
      cy.get(referencePhotoSelector).then((elements) => {
        const element = resolveElement(elements);
        cy.wrap(element.getBoundingClientRect()).as('photoRectAfter');
      });
      cy.all(cy.get('@photoRectBefore'), cy.get('@photoRectAfter')).should((values) => {
        const photoBefore = values[0] as DOMRect;
        const photoAfter = values[1] as DOMRect;
        expect(photoAfter.height).to.be.lessThan(photoBefore.height);
        expect(photoAfter.x).to.be.greaterThan(photoBefore.x);
      });
    });

    it('will show the map UI when the Load Map button is pressed and '
      + 'also show the expand button for the reference photo', () => {
      cy.get(toggleLabelsSelector).should('have.length', 0);
      cy.get(referencePhotoExpandSelector).should('have.length', 0);
      cy.contains(loadMapButtonText).click();
      cy.get(toggleLabelsSelector).should('have.length', 1);
      cy.get(referencePhotoExpandSelector).should('have.length', 1);
    });

    it('will load the map the moment the reference photo is swiped to the left more than 30 pixels', () => {
      cy.get(referencePhotoSelector).as('photo');
      cy.get(referencePhotoExpandSelector).should('have.length', 0);
      swipe({ x: -50, y: 0 }, '@photo');
      cy.get(referencePhotoExpandSelector).should('have.length', 1);
    });
  });

  describe('after the map has been loaded', () => {
    beforeEach(() => {
      cy.contains(loadMapButtonText).click();
    });

    it('will toggle the visibility of labels', () => {
      // Confirm 'Toggle label' button is visible and clickable.
      cy.get(toggleLabelsSelector).click();
      cy.wait(500);
      cy.get(toggleLabelsSelector).click();
    });

    it('will toggle the visibility of the compare-mode slider', () => {
      // Confirm 'Toggle compare mode' toggles the vertical swiper.
      cy.get('.compare-swiper-vertical:visible').should('have.length', 0);
      cy.get(toggleCompareSelector).click();
      cy.get('.compare-swiper-vertical:visible').should('have.length', 1);
      cy.get(toggleCompareSelector).click();
      cy.get('.compare-swiper-vertical:visible').should('have.length', 0);
    });

    it('will close and expand the reference photo, both by manually clicking'
      + 'the button, but also using touch gestures', () => {
      cy.get(referencePhotoExpandSelector).click();
      cy.get(referencePhotoExpandSelector).should('have.length', 0);
      cy.get(referencePhotoCloseSelector).click();
      cy.get(referencePhotoCloseSelector).should('have.length', 0);

      // Confirm that swiping the reference photo right 10px and releasing DOES NOT
      // trigger the reference photo to expand, and that swiping 50 px DOES trigger
      // the photo to expand.
      swipe({ x: 10, y: 0 }, referencePhotoSelector);
      cy.get(referencePhotoCloseSelector).should('have.length', 0);
      swipe({ x: 50, y: 0 }, referencePhotoSelector);
      cy.get(referencePhotoCloseSelector).should('have.length', 1);
      swipe({ x: -10, y: 0 }, referencePhotoSelector);
      cy.get(referencePhotoCloseSelector).should('have.length', 1);
      swipe({ x: -50, y: 0 }, referencePhotoSelector);
      cy.get(referencePhotoCloseSelector).should('have.length', 0);
      swipe({ x: 50, y: 0 }, referencePhotoSelector, true);
      cy.get(referencePhotoCloseSelector).should('have.length', 0);
    });

    it('opens the reference photo without any issues', () => {
      cy.get('button[aria-label="Expand reference photo"]').click();
      cy.get('button[aria-label="Open reference photo in new window"]').click();
    });
  });
});
