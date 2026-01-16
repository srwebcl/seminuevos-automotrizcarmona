const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { execSync } = require('child_process');

// Configuration
const rootDir = path.resolve(__dirname, '..'); // Go up one level to project root
const directoriesToScan = [
    path.join(rootDir, 'frontend', 'public'), // Next.js public
    path.join(rootDir, 'public'),             // Laravel public
    path.join(rootDir, 'storage', 'app', 'public'), // Uploads
];

const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
const videoExtensions = ['.mp4'];

// Stats
let stats = {
    imagesOptimized: 0,
    videosOptimized: 0,
    bytesSaved: 0,
    errors: 0
};

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

async function optimizeImage(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    try {
        const originalStats = fs.statSync(filePath);
        const buffer = fs.readFileSync(filePath);
        let optimizedBuffer;

        if (ext === '.jpg' || ext === '.jpeg') {
            optimizedBuffer = await sharp(buffer)
                .jpeg({ quality: 80, mozjpeg: true })
                .toBuffer();
        } else if (ext === '.png') {
            optimizedBuffer = await sharp(buffer)
                .png({ quality: 80, compressionLevel: 9 })
                .toBuffer();
        } else if (ext === '.webp') {
            optimizedBuffer = await sharp(buffer)
                .webp({ quality: 80 })
                .toBuffer();
        }

        if (optimizedBuffer && optimizedBuffer.length < originalStats.size) {
            fs.writeFileSync(filePath, optimizedBuffer);
            const saved = originalStats.size - optimizedBuffer.length;
            stats.bytesSaved += saved;
            stats.imagesOptimized++;
            console.log(`[IMAGE] Optimized: ${path.relative(rootDir, filePath)} (-${formatBytes(saved)})`);
        } else {
            console.log(`[IMAGE] Skipped (no gain): ${path.relative(rootDir, filePath)}`);
        }
    } catch (err) {
        console.error(`[ERROR] Failed to optimize image ${filePath}:`, err.message);
        stats.errors++;
    }
}

function optimizeVideo(filePath) {
    try {
        const originalStats = fs.statSync(filePath);
        const tempPath = filePath + '.temp.mp4';

        // ffmpeg -i input -vcodec libx264 -crf 28 preset slow -acodec aac -movflags +faststart output
        console.log(`[VIDEO] Processing: ${path.relative(rootDir, filePath)}...`);
        execSync(`ffmpeg -y -i "${filePath}" -vcodec libx264 -crf 28 -preset fast -acodec aac -movflags +faststart "${tempPath}"`, { stdio: 'ignore' });

        const newStats = fs.statSync(tempPath);
        if (newStats.size < originalStats.size) {
            fs.renameSync(tempPath, filePath);
            const saved = originalStats.size - newStats.size;
            stats.bytesSaved += saved;
            stats.videosOptimized++;
            console.log(`[VIDEO] Optimized: ${path.relative(rootDir, filePath)} (-${formatBytes(saved)})`);
        } else {
            fs.unlinkSync(tempPath);
            console.log(`[VIDEO] Skipped (no gain): ${path.relative(rootDir, filePath)}`);
        }
    } catch (err) {
        console.error(`[ERROR] Failed to optimize video ${filePath}:`, err.message);
        // Clean up temp file if exists
        if (fs.existsSync(filePath + '.temp.mp4')) {
            fs.unlinkSync(filePath + '.temp.mp4');
        }
        stats.errors++;
    }
}

async function scanDirectory(directory) {
    if (!fs.existsSync(directory)) return;

    const files = fs.readdirSync(directory);

    for (const file of files) {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            // Skip node_modules and vendor explicitly just in case provided paths go there
            if (file !== 'node_modules' && file !== 'vendor') {
                await scanDirectory(fullPath);
            }
        } else {
            const ext = path.extname(file).toLowerCase();
            if (imageExtensions.includes(ext)) {
                await optimizeImage(fullPath);
            } else if (videoExtensions.includes(ext)) {
                optimizeVideo(fullPath);
            }
        }
    }
}

(async () => {
    console.log('Starting media optimization...');
    console.log(`Root Dir: ${rootDir}`);

    for (const dir of directoriesToScan) {
        console.log(`Scanning: ${dir}`);
        await scanDirectory(dir);
    }

    console.log('\n--- Optimization Summary ---');
    console.log(`Images Optimized: ${stats.imagesOptimized}`);
    console.log(`Videos Optimized: ${stats.videosOptimized}`);
    console.log(`Total Space Saved: ${formatBytes(stats.bytesSaved)}`);
    console.log(`Errors: ${stats.errors}`);
})();
