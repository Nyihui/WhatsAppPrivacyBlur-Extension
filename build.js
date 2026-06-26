const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const distDir = path.join(__dirname, 'dist');
const chromeDir = path.join(distDir, 'chrome');
const firefoxDir = path.join(distDir, 'firefox');

// Explicitly list what to include to avoid zipping .git, scripts, or random dev files
const includePaths = [
    'icons',
    'selectors',
    'ui',
    'content.js',
    'manifest.json',
    'LICENSE',
    'README.md'
];

function clean() {
    if (fs.existsSync(distDir)) {
        fs.rmSync(distDir, { recursive: true, force: true });
    }
    fs.mkdirSync(chromeDir, { recursive: true });
    fs.mkdirSync(firefoxDir, { recursive: true });
}

function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest);
        fs.readdirSync(src).forEach(childItemName => {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else if (exists) {
        fs.copyFileSync(src, dest);
    }
}

function build() {
    console.log('Cleaning dist directory...');
    clean();

    console.log('Copying files...');
    includePaths.forEach(p => {
        const src = path.join(__dirname, p);
        if (fs.existsSync(src)) {
            copyRecursiveSync(src, path.join(chromeDir, p));
            copyRecursiveSync(src, path.join(firefoxDir, p));
        } else {
            console.warn(`Warning: Expected path not found: ${p}`);
        }
    });

    console.log('Patching Chrome manifest...');
    const chromeManifestPath = path.join(chromeDir, 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(chromeManifestPath, 'utf8'));
    
    // The core difference: Strip Firefox settings for the Chrome build
    delete manifest.browser_specific_settings;
    
    fs.writeFileSync(chromeManifestPath, JSON.stringify(manifest, null, 2));

    console.log('Creating ZIP archives...');
    try {
        execSync(`python -c "import shutil; shutil.make_archive('${distDir.replace(/\\/g, '/')}/whatsapp-privacy-blur-chrome', 'zip', '${chromeDir.replace(/\\/g, '/')}')"`);
        console.log('Created whatsapp-privacy-blur-chrome.zip');
        
        execSync(`python -c "import shutil; shutil.make_archive('${distDir.replace(/\\/g, '/')}/whatsapp-privacy-blur-firefox', 'zip', '${firefoxDir.replace(/\\/g, '/')}')"`);
        console.log('Created whatsapp-privacy-blur-firefox.zip');
    } catch (e) {
        console.error('Failed to create ZIP files automatically.', e.message);
    }

    console.log('Build complete! Check the /dist folder for your clean, ready-to-publish files.');
}

build();
