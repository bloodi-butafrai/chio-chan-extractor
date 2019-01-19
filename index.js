const ffmpeg = require('fluent-ffmpeg');
const EventEmitter = require('events');
const fs = require('fs');

class ChioChanExtractor extends EventEmitter {
  constructor({ screenshots, videoPath, outputPath }) {
    super();

    const SCREENSHOTS = screenshots;
    const VIDEO_PATH = videoPath;
    const OUTPUT_PATH = outputPath;

    this.SCREENSHOTS = SCREENSHOTS;
    this.VIDEO_PATH = VIDEO_PATH;
    this.OUTPUT_PATH = OUTPUT_PATH;

    this.ensureOutputPath();
    this.generateTimestamps();
  }

  ensureOutputPath() {
    if (!fs.existsSync(this.OUTPUT_PATH)) {
      fs.mkdirSync(this.OUTPUT_PATH);
    }
  }

  generateTimestamps() {
    const timestamps = [];
    const startPositionPercent = 5;
    const endPositionPercent = 95;
    const addPercent = (endPositionPercent - startPositionPercent) / (this.SCREENSHOTS - 1);

    if (!timestamps.length) {
      let i = 0;
      while (i < this.SCREENSHOTS) {
        timestamps.push(`${startPositionPercent + addPercent * i}%`);
        i += 1;
      }
    }

    const TIMESTAMPS = timestamps;
    this.TIMESTAMPS = TIMESTAMPS;
  }

  extract({ index = 0 } = { index: 0 }) {
    ffmpeg(this.VIDEO_PATH)
      .on('start', () => {
        if (index < 1) {
          this.emit('start');
        }
      })
      .on('end', () => {
        this.emit('end', { index });

        if (index + 1 < this.SCREENSHOTS) {
          this.extract({ index: index + 1 });
        }
      })
      .screenshots({
        count: 1,
        timemarks: [this.TIMESTAMPS[index]],
        filename: `${this.OUTPUT_PATH}/${index + 1}.jpg`,
      });
  }
}

module.exports = ChioChanExtractor;
