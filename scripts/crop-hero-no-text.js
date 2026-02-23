const sharp = require('sharp');
const path = require('path');

const input = path.join(__dirname, '..', 'public', 'african-print-dresses-hero.png');
const output = path.join(__dirname, '..', 'public', 'african-print-dresses-hero-no-text.png');

sharp(input)
  .metadata()
  .then(({ width, height }) => {
    // Crop to middle band: exclude top ~22% (headline) and bottom ~30% (buttons/offer/tags)
    const top = Math.round(height * 0.22);
    const h = Math.round(height * 0.48); // middle 48% = no top text, no bottom UI
    return sharp(input)
      .extract({ left: 0, top, width, height: h })
      .toFile(output);
  })
  .then(() => console.log('Saved:', output))
  .catch((err) => console.error(err));
