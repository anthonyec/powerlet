const path = require('path');
const assert = require('assert');
const puppeteer = require('puppeteer');

const extensionPath = path.join(__dirname, '../dist');
let extensionPage = null;
let browser = null;
let extensionID = null;

async function boot() {
  browser = await puppeteer.launch({
    headless: false, // extension are allowed only in head-full mode,
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
      `--window-size=800,600`
    ]
  });

  const dummyPage = await browser.newPage();
  await dummyPage.waitFor(1000);

  const extensionName = 'Powerlets';

  const targets = await browser.targets();
  const extensionTarget = targets.find(({ _targetInfo }) => {
    return (
      _targetInfo.title === extensionName &&
      _targetInfo.type === 'background_page'
    );
  });

  const extensionUrl = extensionTarget._targetInfo.url || '';
  [, , extensionID] = extensionUrl.split('/');

  const extensionPopupHtml = 'popup.html';

  extensionPage = await browser.newPage();
  await extensionPage.goto(
    `chrome-extension://${extensionID}/${extensionPopupHtml}`
  );

  return {
    extensionPage,
    browser
  };
}

describe('Popup - first run', async function () {
  this.timeout(20000);

  beforeEach(async function () {
    await boot();
  });

  it('renders the search field', async function () {
    const searchField = await extensionPage.$('.search-field__input');

    assert.ok(searchField, 'Search field was not rendered');
  });

  it('focuses the search field', async function () {
    const isFocused = await extensionPage.$eval(
      '.search-field__input',
      (el) => {
        return document.activeElement === el;
      }
    );

    assert.ok(isFocused, 'Search field was not focused');
  });

  it('renders the onboarding message', async function () {
    const onboarding = await extensionPage.$('.onboard-message');
    const message = await extensionPage.$eval(
      '.onboard-message__message',
      (element) => element.textContent
    );

    assert.ok(onboarding, 'Onboarding was not rendered');
    assert.strictEqual(
      message,
      `You don't have any bookmark scripts.`,
      'Onboarding message was incorrect'
    );
  });

  it('renders the "Add scripts" button', async function () {
    const button = await extensionPage.$('.onboard-message .button');
    const label = await extensionPage.$eval(
      '.onboard-message .button',
      (element) => element.textContent
    );

    assert.ok(button, '"Add scripts" button was not rendered');
    assert.strictEqual(
      label,
      'Add scripts',
      'Add scripts button label was incorrect'
    );
  });

  describe('Clicking "Add scripts"', () => {
    it('opens the examples page', async function () {
      const pagesBeforeClick = await browser.pages();
      const examplePagesBeforeClick = pagesBeforeClick.filter((page) => {
        return `chrome-extension://${extensionID}/examples.html` === page.url();
      });

      await extensionPage.click('.onboard-message .button');

      const pagesAfterClick = await browser.pages();
      const examplePagesAfterClick = pagesAfterClick.filter((page) => {
        return `chrome-extension://${extensionID}/examples.html` === page.url();
      });

      assert.strictEqual(
        examplePagesBeforeClick.length,
        0,
        'Example page should not be open before click'
      );
      assert.strictEqual(
        examplePagesAfterClick.length,
        1,
        'Expected 1 example page to be opened'
      );
    });

    it('closes the popup', async function () {
      const pagesBeforeClick = await browser.pages();
      const popupPagesBeforeClick = pagesBeforeClick.filter((page) => {
        return `chrome-extension://${extensionID}/popup.html` === page.url();
      });

      await extensionPage.click('.onboard-message .button');

      const pagesAfterClick = await browser.pages();
      const popupPagesAfterClick = pagesAfterClick.filter((page) => {
        return `chrome-extension://${extensionID}/popup.html` === page.url();
      });

      assert.strictEqual(
        popupPagesBeforeClick.length,
        1,
        'Expected popup page to be open before clicking'
      );
      assert.strictEqual(
        popupPagesAfterClick.length,
        0,
        'Expected popup page to be closed after clicking'
      );
    });
  });

  afterEach(async function () {
    await browser.close();
  });
});
