import sharp from 'sharp';

async function checkFormats() {
  console.log(JSON.stringify(sharp.format, null, 2));
}

checkFormats();
