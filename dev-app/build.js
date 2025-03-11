const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const glob = require('glob');
const chalk = require('chalk');

// Project structure paths for a React app
const PROJECT_ROOT = path.resolve(__dirname); // This is now the main directory
const DEV_APP_DIR = PROJECT_ROOT;
const BUILD_DIR = path.join(DEV_APP_DIR, 'build');
const JS_DIR = path.join(BUILD_DIR, 'static', 'js');
const CSS_DIR = path.join(BUILD_DIR, 'static', 'css');
const MEDIA_DIR = path.join(BUILD_DIR, 'static', 'media');
const ASSETS_DIR = path.join(DEV_APP_DIR, 'src', 'assets');

// Log with colors and timestamps
function log(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString();
  const prefix = `[${timestamp}]`;
  
  switch (type) {
    case 'success':
      console.log(chalk.green(`${prefix} ✓ ${message}`));
      break;
    case 'error':
      console.error(chalk.red(`${prefix} ✗ ${message}`));
      break;
    case 'warn':
      console.warn(chalk.yellow(`${prefix} ⚠ ${message}`));
      break;
    default:
      console.log(chalk.blue(`${prefix} ℹ ${message}`));
  }
}

// Run command and return result
function runCommand(command, options = {}) {
  try {
    log(`Running: ${command}`);
    execSync(command, { stdio: 'inherit', ...options, cwd: options.cwd || DEV_APP_DIR });
    return true;
  } catch (error) {
    log(`Command failed: ${command}`, 'error');
    log(error.message, 'error');
    return false;
  }
}

// Check if a command exists
// Check if a command exists
function commandExists(command) {
    const cmd = command.split(' ')[0]; // Get just the command name, not arguments
    
    try {
      if (process.platform === 'win32') {
        // On Windows, we need to check differently
        execSync(`where ${cmd}`, { stdio: 'ignore' });
      } else {
        // On Unix-like systems
        execSync(`which ${cmd}`, { stdio: 'ignore' });
      }
      return true;
    } catch (error) {
      return false;
    }
  }
// Ensure a directory exists
function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
    log(`Created directory: ${directory}`, 'success');
  }
}

// Step 1: Build the React application
function buildReactApp() {
  log('Starting React build process');
  // For React apps, use the standard build script from package.json
  if (!runCommand('react-scripts build')) {
        log('React build failed. Aborting optimization.', 'error');
    process.exit(1);
  }
  log('React build completed successfully', 'success');
}

// Step 2: Purge CSS (adjusted for React apps)
function purgeCss() {
  log('Purging unused CSS');
  
  const configPath = path.join(DEV_APP_DIR, 'purgecss.config.js');
  
  if (!fs.existsSync(configPath)) {
    log('purgecss.config.js not found. Creating React-specific configuration...', 'warn');
    
    const defaultConfig = `module.exports = {
  content: [
    './build/**/*.html',
    './build/static/js/**/*.js',
    './src/**/*.js',
    './src/**/*.jsx',
    './src/**/*.ts',
    './src/**/*.tsx',
    './public/**/*.html'
  ],
  css: ['./build/static/css/**/*.css'],
  output: './build/static/css/',
  safelist: {
    standard: [/^(modal|fade|show|collapse|carousel|dropdown|react)/],
    deep: [/^(modal|fade|show|collapse|carousel|dropdown|react)/],
    greedy: [/^(MuiButton|Mui|ant|rc)/]
  },
}`;
    
    fs.writeFileSync(configPath, defaultConfig);
    log('Created React-specific PurgeCSS configuration', 'success');
  }
  
  if (!commandExists('purgecss')) {
    log('PurgeCSS not installed. Installing...', 'warn');
    if (!runCommand('npm install -g purgecss')) {
      log('Failed to install PurgeCSS. Skipping CSS purging.', 'error');
      return;
    }
  }
  
  if (!runCommand(`purgecss --config ${configPath}`)) {
    log('PurgeCSS process failed. Continuing with other optimizations...', 'warn');
  } else {
    log('CSS purged successfully', 'success');
  }
}

// Step 3: Directly obfuscate JavaScript files (React-optimized)
function obfuscateJavaScript() {
  log('Obfuscating JavaScript files');
  
  // Find all JS files in the build directory
  const jsFiles = glob.sync(path.join(JS_DIR, '*.js'));
  
  if (jsFiles.length === 0) {
    log('No JavaScript files found to optimize', 'warn');
    return;
  }
  
  log(`Found ${jsFiles.length} JavaScript files`);
  
  // Check for dependencies
  if (!commandExists('javascript-obfuscator')) {
    log('javascript-obfuscator not found. Installing...', 'warn');
    if (!runCommand('npm install -g javascript-obfuscator')) {
      log('Failed to install javascript-obfuscator. Skipping obfuscation.', 'error');
      return;
    }
  }
  
  // Set up backup directory for original files
  const backupDir = path.join(JS_DIR, 'originals');
  ensureDirectoryExists(backupDir);
  
  // Get chunk and main files separately - React build typically has specific patterns
  const mainFiles = jsFiles.filter(file => file.includes('main.'));
  const chunkFiles = jsFiles.filter(file => file.includes('chunk.'));
  const otherFiles = jsFiles.filter(file => !file.includes('main.') && !file.includes('chunk.'));
  
  log(`Identified: ${mainFiles.length} main files, ${chunkFiles.length} chunk files, ${otherFiles.length} other files`);
  
  // Process each type of file with appropriate settings
  const processFiles = (files, label, options) => {
    files.forEach(file => {
      const fileName = path.basename(file);
      const backupFile = path.join(backupDir, fileName);
      const tempFile = path.join(JS_DIR, `temp_${fileName}`);
      
      log(`Obfuscating ${label}: ${fileName}`);
      
      // Backup original
      fs.copyFileSync(file, backupFile);
      
      // Create options string
      const optionsStr = Object.entries(options)
        .map(([key, value]) => `--${key} ${value}`)
        .join(' ');
      
      // Obfuscate the file
      if (runCommand(`javascript-obfuscator "${file}" --output "${tempFile}" ${optionsStr}`)) {
        // Replace original with obfuscated version
        fs.unlinkSync(file);
        fs.renameSync(tempFile, file);
        log(`Successfully obfuscated: ${fileName}`, 'success');
      } else {
        log(`Failed to obfuscate: ${fileName} - restoring from backup`, 'error');
        // Restore from backup
        fs.copyFileSync(backupFile, file);
        // Clean up temp file if it exists
        if (fs.existsSync(tempFile)) {
          fs.unlinkSync(tempFile);
        }
      }
    });
  };
  
  // Main bundle obfuscation (more careful with main bundle)
  const mainOptions = {
    'compact': 'true',
    'self-defending': 'true',
    'control-flow-flattening': 'true',
    'control-flow-flattening-threshold': '0.5',
    'dead-code-injection': 'false',
    'string-array': 'true',
    'string-array-encoding': 'base64',
    'string-array-threshold': '0.75',
    'split-strings': 'true',
    'split-strings-chunk-length': '10',
    'transform-object-keys': 'true',
    'unicode-escape-sequence': 'true'
  };
  
  // Chunk files obfuscation (can be more aggressive)
  const chunkOptions = {
    'compact': 'true',
    'self-defending': 'true',
    'control-flow-flattening': 'true',
    'control-flow-flattening-threshold': '0.7',
    'dead-code-injection': 'true',
    'dead-code-injection-threshold': '0.4',
    'string-array': 'true',
    'string-array-encoding': 'rc4',
    'string-array-threshold': '0.8',
    'split-strings': 'true',
    'split-strings-chunk-length': '5',
    'transform-object-keys': 'true',
    'unicode-escape-sequence': 'true'
  };
  
  // Other files (use safer settings)
  const otherOptions = {
    'compact': 'true',
    'self-defending': 'true',
    'control-flow-flattening': 'false',
    'string-array': 'true',
    'string-array-encoding': 'base64',
    'string-array-threshold': '0.5',
    'transform-object-keys': 'true'
  };
  
  // Process files by type
  processFiles(mainFiles, 'main bundle', mainOptions);
  processFiles(chunkFiles, 'chunk file', chunkOptions);
  processFiles(otherFiles, 'other file', otherOptions);
  
  // Update any React-specific references in index.html if needed
  updateHtmlReferences();
  
  log('JavaScript obfuscation completed', 'success');
}

// Update HTML references if needed
function updateHtmlReferences() {
  const indexPath = path.join(BUILD_DIR, 'index.html');
  
  if (fs.existsSync(indexPath)) {
    log('Updating HTML references if needed');
    // For React, we typically don't need to modify the references
    // as we're keeping the same file names, just obfuscating the content
  }
}

// Step 4: Optimize images from src/assets
function optimizeImages() {
    log('Optimizing images');
    
    // Check for image files in both build media directory and assets directory
    const buildImageFiles = [
      ...glob.sync(path.join(MEDIA_DIR, '**/*.png')),
      ...glob.sync(path.join(MEDIA_DIR, '**/*.{jpg,jpeg}')),
      ...glob.sync(path.join(MEDIA_DIR, '**/*.webp')),
      ...glob.sync(path.join(MEDIA_DIR, '**/*.svg'))
    ];
    
    const assetImageFiles = [
      ...glob.sync(path.join(ASSETS_DIR, '**/*.png')),
      ...glob.sync(path.join(ASSETS_DIR, '**/*.{jpg,jpeg}')),
      ...glob.sync(path.join(ASSETS_DIR, '**/*.webp')),
      ...glob.sync(path.join(ASSETS_DIR, '**/*.svg'))
    ];
    
    log(`Found ${buildImageFiles.length} images in build directory and ${assetImageFiles.length} in assets directory`);
    
    // Process PNG files
    const allPngFiles = [
      ...buildImageFiles.filter(file => file.endsWith('.png')),
      ...assetImageFiles.filter(file => file.endsWith('.png'))
    ];
    
    if (allPngFiles.length > 0) {
      if (commandExists('optipng')) {
        allPngFiles.forEach(file => {
          log(`Optimizing PNG: ${path.basename(file)}`);
          runCommand(`optipng -o5 "${file}"`);
        });
        log('PNG optimization completed', 'success');
      } else {
        log('optipng not found. Skipping PNG optimization.', 'warn');
      }
    }
    
    // Process JPG files - Using a more reliable method for JPEG compression
    const allJpgFiles = [
      ...buildImageFiles.filter(file => file.endsWith('.jpg') || file.endsWith('.jpeg')),
      ...assetImageFiles.filter(file => file.endsWith('.jpg') || file.endsWith('.jpeg'))
    ];
    
    if (allJpgFiles.length > 0) {
      // Try ImageMagick first, which is more commonly available and reliable
      if (commandExists('convert')) {
        allJpgFiles.forEach(file => {
          log(`Optimizing JPG: ${path.basename(file)}`);
          const tempFile = `${file}.tmp`;
          if (runCommand(`convert "${file}" -strip -interlace Plane -quality 85 "${tempFile}"`)) {
            fs.unlinkSync(file);
            fs.renameSync(tempFile, file);
          }
        });
        log('JPG optimization completed using ImageMagick', 'success');
      } 
      // Fallback to mozjpeg if available but with better handling
      else if (commandExists('mozjpeg')) {
        allJpgFiles.forEach(file => {
          log(`Optimizing JPG: ${path.basename(file)}`);
          const tempFile = `${file}.tmp`;
          // Try with cjpeg which is part of mozjpeg
          if (commandExists('cjpeg') && runCommand(`cjpeg -quality 85 "${file}" > "${tempFile}"`)) {
            fs.unlinkSync(file);
            fs.renameSync(tempFile, file);
          } else {
            log(`Skipping JPG optimization for: ${path.basename(file)} - incompatible format or tool`, 'warn');
          }
        });
        log('JPG optimization completed', 'success');
      } else {
        log('No JPEG optimization tools found. Skipping JPG optimization.', 'warn');
      }
    }
    
    // Process WebP files with better fallback options
    const allWebpFiles = [
      ...buildImageFiles.filter(file => file.endsWith('.webp')),
      ...assetImageFiles.filter(file => file.endsWith('.webp'))
    ];
    
    if (allWebpFiles.length > 0) {
      let webpToolAvailable = false;
      
      // Try several methods to optimize WebP
      if (commandExists('cwebp')) {
        webpToolAvailable = true;
        allWebpFiles.forEach(file => {
          log(`Optimizing WebP: ${path.basename(file)}`);
          const tempFile = `${file}.tmp`;
          if (runCommand(`cwebp -q 85 "${file}" -o "${tempFile}"`)) {
            fs.unlinkSync(file);
            fs.renameSync(tempFile, file);
          }
        });
        log('WebP optimization completed using cwebp', 'success');
      } 
      // Try with npx webp if available
      else if (commandExists('npx')) {
        try {
          execSync('npx webp -h', { stdio: 'ignore' });
          webpToolAvailable = true;
          allWebpFiles.forEach(file => {
            log(`Optimizing WebP: ${path.basename(file)}`);
            const tempFile = `${file}.tmp`;
            if (runCommand(`npx webp "${file}" -o "${tempFile}" -q 85`)) {
              fs.unlinkSync(file);
              fs.renameSync(tempFile, file);
            }
          });
          log('WebP optimization completed using npx webp', 'success');
        } catch (error) {
          // Try with ImageMagick instead if available
          if (commandExists('convert')) {
            webpToolAvailable = true;
            allWebpFiles.forEach(file => {
              log(`Optimizing WebP: ${path.basename(file)}`);
              const tempFile = `${file}.tmp`;
              if (runCommand(`convert "${file}" -quality 85 "${tempFile}"`)) {
                fs.unlinkSync(file);
                fs.renameSync(tempFile, file);
              }
            });
            log('WebP optimization completed using ImageMagick', 'success');
          }
        }
      }
      
      if (!webpToolAvailable) {
        log('No WebP optimization tools found. Skipping WebP optimization.', 'warn');
      }
    }
    
    // Process SVG files
    const allSvgFiles = [
      ...buildImageFiles.filter(file => file.endsWith('.svg')),
      ...assetImageFiles.filter(file => file.endsWith('.svg'))
    ];
    
    if (allSvgFiles.length > 0) {
      if (commandExists('svgo')) {
        allSvgFiles.forEach(file => {
          log(`Optimizing SVG: ${path.basename(file)}`);
          runCommand(`svgo -i "${file}" -o "${file}"`);
        });
        log('SVG optimization completed', 'success');
      } else {
        log('svgo not found. Skipping SVG optimization.', 'warn');
      }
    }
  }

// Step 5: Gzip compression for static assets
function compressAssets() {
  log('Compressing assets');
  
  if (!commandExists('gzip')) {
    log('gzip not found. Skipping compression.', 'warn');
    return;
  }
  
  // Find all static assets
  const assets = [
    ...glob.sync(path.join(JS_DIR, '**/*.js')),
    ...glob.sync(path.join(CSS_DIR, '**/*.css')),
    ...glob.sync(path.join(BUILD_DIR, '**/*.html')),
    ...glob.sync(path.join(BUILD_DIR, '**/*.json')),
  ];
  
  log(`Compressing ${assets.length} static assets`);
  
  assets.forEach(file => {
    log(`Compressing: ${path.basename(file)}`);
    runCommand(`gzip -9 -c "${file}" > "${file}.gz"`, { stdio: 'ignore' });
  });
  
  log('Asset compression completed', 'success');
}

// Create a report file with optimization details
function createOptimizationReport(startTime, endTime) {
  const reportPath = path.join(BUILD_DIR, 'optimization-report.json');
  
  // Collect file sizes
  const jsFileSizes = glob.sync(path.join(JS_DIR, '*.js')).map(file => ({
    name: path.basename(file),
    size: fs.statSync(file).size,
    sizeFormatted: formatBytes(fs.statSync(file).size)
  }));
  
  const cssFileSizes = glob.sync(path.join(CSS_DIR, '*.css')).map(file => ({
    name: path.basename(file),
    size: fs.statSync(file).size,
    sizeFormatted: formatBytes(fs.statSync(file).size)
  }));
  
  const totalJsSize = jsFileSizes.reduce((acc, file) => acc + file.size, 0);
  const totalCssSize = cssFileSizes.reduce((acc, file) => acc + file.size, 0);
  
  const report = {
    optimizationDate: new Date().toISOString(),
    duration: ((endTime - startTime) / 1000).toFixed(2) + ' seconds',
    totalJsSize: formatBytes(totalJsSize),
    totalCssSize: formatBytes(totalCssSize),
    totalBuildSize: formatBytes(totalJsSize + totalCssSize),
    jsFiles: jsFileSizes,
    cssFiles: cssFileSizes
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  log(`Optimization report created at: ${reportPath}`, 'success');
}

// Helper function to format bytes
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}



/// Add this function to clean up temporary files
function cleanupTempFiles() {
    log('Cleaning up temporary files');
    
    // Find all temporary files
    const tempFiles = [
      ...glob.sync(path.join(JS_DIR, 'temp_*.js')),
      ...glob.sync(path.join(JS_DIR, '*.tmp')),
      ...glob.sync(path.join(CSS_DIR, '*.tmp')),
      ...glob.sync(path.join(MEDIA_DIR, '**/*.tmp')),
      ...glob.sync(path.join(ASSETS_DIR, '**/*.tmp'))
    ];
    
    if (tempFiles.length === 0) {
      log('No temporary files found');
      return;
    }
    
    log(`Found ${tempFiles.length} temporary files to clean up`);
    
    tempFiles.forEach(file => {
      try {
        log(`Removing: ${path.basename(file)}`);
        fs.unlinkSync(file);
      } catch (error) {
        log(`Failed to remove temporary file: ${path.basename(file)}`, 'error');
      }
    });
    
    log('Temporary files cleanup completed', 'success');
  }
  
  // Then modify your runOptimization function to call this at the end
  async function runOptimization() {
    const startTime = Date.now();
    
    log('Starting React build and optimization process');
    
    // Ensure build directory exists
    ensureDirectoryExists(BUILD_DIR);
    
    // Run each step
    buildReactApp();
    purgeCss();
    obfuscateJavaScript();
    optimizeImages();
    compressAssets();
    
    // Clean up temporary files
    cleanupTempFiles();
    
    const endTime = Date.now();
    createOptimizationReport(startTime, endTime);
    
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    log(`React build and optimization completed in ${duration} seconds`, 'success');
  }

// Execute the optimization process
runOptimization();