# chio-chan-extractor 🍷🦋

Extracts screenshots from video files

### Using

```js
const slugify = require('slugify');
const ChioChanExtractor = require('./index.js');

const VIDEO_PATH = './2';
const OUTPUT_PATH = `./screenshots/${slugify(VIDEO_PATH).replace(/\./g, '')}`;
const EPISODE_SECONDS = Math.floor((23 * 60 + 40) / 3);
const OPTIONS = {
  screenshots: EPISODE_SECONDS,
  videoPath: VIDEO_PATH,
  outputPath: OUTPUT_PATH,
};

const cce = new ChioChanExtractor(OPTIONS);

cce.on('start', () => {
  console.log('Started taking screenshots');
});

cce.on('end', ({ index }) => {
  console.log(`Took screenshot #${index}`);
});

cce.extract();
```
