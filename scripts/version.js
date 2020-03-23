const fs = require('fs');
const path = require('path');

const { version } = require('../package.json');

const manifestPath = path.join(__dirname, '../src/manifest.json');
const manifestFile = fs.readFileSync(manifestPath, 'utf8');
const manifest = JSON.parse(manifestFile);
const newManifest = {
  ...manifest,
  version
};

const newManifestFile = JSON.stringify(newManifest, null, 2);

fs.writeFileSync(manifestPath, newManifestFile, 'utf8');
