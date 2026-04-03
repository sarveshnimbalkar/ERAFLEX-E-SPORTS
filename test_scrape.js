const google = require('googlethis');

async function test() {
  const images = await google.image('Real Madrid home kit 2024 transparent png', { safe: false });
  console.log(images[0].url);
}

test().catch(console.error);
