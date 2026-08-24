import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputDir = 'src/assets/category/list';
const outputDir = 'src/assets/category/list-trimmed';

fs.mkdirSync(outputDir, { recursive: true });

const files = fs
    .readdirSync(inputDir)
    .filter((file) => file.endsWith('.png'));

for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file);

    await sharp(inputPath)
        .trim({
            background: { r: 0, g: 0, b: 0, alpha: 0 },
            threshold: 10,
        })
        .png()
        .toFile(outputPath);

    console.log(`Trimmed: ${file}`);
}