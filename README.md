<div align="center">
  <img src="logo.png" width="420" alt="Powerlet">
  <br><br>

**Chrome Extension to quickly find and run bookmarklets.**

Available on **[Chrome Web Store](https://chrome.google.com/webstore/detail/powerlets/ofecodkcadbenmiknnidnfepbblapgkn)**

  <img src="screenshot.png" width="640" alt="Screenshot of the extension showing search results">

</div>

## Requirements

- NodeJS >=10.16
- Google Chrome or Firefox

## Setup

Create an `.env` file at the root of this repo directory.

Currently the only environment variable is `STATS_DOMAIN` and is **not required** to run the project.

```bash
$ touch .env
```

Install the dependencies.

```bash
$ npm i
```

Run build to compile the extension to `./dist`.

```bash
$ npm run build
```

After the extension has been built, [load it in a browser.](#loading-extension-in-web-browser-locally)


## Loading extension in web browser locally

❗️Run the build script at least once before loading extensions into the browser.

### Google Chrome

- Navigate to `chrome://extensions/`
- Toggle on "Developer mode"
- Click "Load unpacked"
- Select the `/dist` folder

### Firefox

- Navigate to `about:debugging#/runtime/this-firefox`
- Click "Load Temporary Add-on..."
- Select any file in the `/dist` folder

## Documentation

- [Development setup](./docs/development.md)
- [Privacy policy](./docs/privacy.md)
