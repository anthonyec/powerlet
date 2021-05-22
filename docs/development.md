# Development setup

## Setup
When actively developing the extension you can use `start` to have Webpack watch for changes and automatically recompile the extension.

```bash
$ npm run start
```

You can also build the project without it watching for change by using `build:dev`

```bash
$ npm run build:dev
```

## Testing

Sorry, there aren't any. I wrote this in a couple of nights and during a long haul flight.

## Releasing

This is more notes for myself so I don't forget this manual process.

- Squash and merge PR branch
- Pull master locally
- Run `npm version <major|minor|patch>`
- Check version in `manifest.json` has been automatically updated
- Commit amend
- Push!
- Draft release with new tag
