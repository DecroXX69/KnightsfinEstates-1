const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const glob = require('glob');
const chalk = require('chalk');

// Project structure paths
const PROJECT_ROOT = path.resolve(__dirname);
const DEV_APP_DIR = PROJECT_ROOT;
const BUILD_DIR = path.join(DEV_APP_DIR, 'build');
const JS_DIR = path.join(BUILD_DIR, 'static', 'js');
const CSS_DIR = path.join(BUILD_DIR, 'static', 'css');
const MEDIA_DIR = path.join(BUILD_DIR, 'static', 'media');

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
function commandExists(command) {
  const cmd = command.split(' ')[0]; // Get just the command name, not arguments
  
  try {
    if (process.platform === 'win32') {
      execSync(`where ${cmd}`, { stdio: 'ignore' });
    } else {
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

// Step 1: Build the React application with production optimizations
function buildReactApp() {
  log('Starting React build process');
  
  // Set environment variables for maximum optimization
  process.env.NODE_ENV = 'production';
  process.env.GENERATE_SOURCEMAP = 'false'; // Disable source maps for smaller bundles
  
  if (!runCommand('react-scripts build')) {
    log('React build failed. Aborting optimization.', 'error');
    process.exit(1);
  }
  log('React build completed successfully', 'success');
}

// Step 2: Optimize CSS with PurgeCSS - more streamlined approach
function purgeCss() {
  log('Purging unused CSS');
  
  const configPath = path.join(DEV_APP_DIR, 'purgecss.config.js');
  
  if (!fs.existsSync(configPath)) {
    log('Creating React-specific PurgeCSS configuration...', 'warn');
    
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
  }
};`;
    
    fs.writeFileSync(configPath, defaultConfig);
    log('Created PurgeCSS configuration', 'success');
  }
  
  // First try with local installation, then global
  if (fs.existsSync(path.join(DEV_APP_DIR, 'node_modules', '.bin', 'purgecss'))) {
    runCommand(`npx purgecss --config ${configPath}`);
  } else if (commandExists('purgecss')) {
    runCommand(`purgecss --config ${configPath}`);
  } else {
    log('PurgeCSS not found. Installing locally...', 'warn');
    if (runCommand('npm install purgecss --save-dev')) {
      runCommand(`npx purgecss --config ${configPath}`);
    } else {
      log('Failed to install PurgeCSS. Skipping CSS purging.', 'error');
    }
  }
}

// Step 3: Optimize JavaScript - with lighter obfuscation settings
// Step 3: Optimize JavaScript - with lighter obfuscation settings
function optimizeJavaScript() {
  log('Optimizing JavaScript files');
  
  // Find all JS files in the build directory
  const jsFiles = glob.sync(path.join(JS_DIR, '*.js'));
  
  if (jsFiles.length === 0) {
    log('No JavaScript files found to optimize', 'warn');
    return;
  }
  
  log(`Found ${jsFiles.length} JavaScript files`);
  
  // Check for dependencies
  if (!commandExists('javascript-obfuscator') && !fs.existsSync(path.join(DEV_APP_DIR, 'node_modules', '.bin', 'javascript-obfuscator'))) {
    log('javascript-obfuscator not found. Installing locally...', 'warn');
    if (!runCommand('npm install javascript-obfuscator --save-dev')) {
      log('Failed to install javascript-obfuscator. Skipping obfuscation.', 'error');
      return;
    }
  }
  
  // Use LIGHTER obfuscation settings that won't impact runtime performance
  // Using kebab-case parameter format instead of camelCase
  const obfuscationOptions = {
    'compact': 'true',
    'control-flow-flattening': 'false',
    'dead-code-injection': 'false',
    'string-array': 'true',
    'string-array-encoding': 'base64',
    'string-array-threshold': '0.5',
    'unicode-escape-sequence': 'false' // This can make code run slower
  };
  
  // Convert options to command-line format
  const optionsStr = Object.entries(obfuscationOptions)
    .map(([key, value]) => `--${key} ${value}`)
    .join(' ');
  
  // Process each file with optimal settings
  jsFiles.forEach(file => {
    const fileName = path.basename(file);
    const tempFile = path.join(JS_DIR, `temp_${fileName}`);
    
    log(`Optimizing: ${fileName}`);
    
    const command = fs.existsSync(path.join(DEV_APP_DIR, 'node_modules', '.bin', 'javascript-obfuscator'))
      ? `npx javascript-obfuscator "${file}" --output "${tempFile}" ${optionsStr}`
      : `javascript-obfuscator "${file}" --output "${tempFile}" ${optionsStr}`;
    
    if (runCommand(command)) {
      fs.unlinkSync(file);
      fs.renameSync(tempFile, file);
      log(`Successfully optimized: ${fileName}`, 'success');
    } else {
      log(`Failed to optimize: ${fileName}`, 'error');
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }
    }
  });
}

// Step 4: Optimize images - focus on build directory only
function optimizeImages() {
  log('Optimizing images in build directory');
  
  // Only process images in the build directory
  const buildImageFiles = [
    ...glob.sync(path.join(MEDIA_DIR, '**/*.png')),
    ...glob.sync(path.join(MEDIA_DIR, '**/*.{jpg,jpeg}')),
    ...glob.sync(path.join(MEDIA_DIR, '**/*.webp')),
    ...glob.sync(path.join(MEDIA_DIR, '**/*.svg'))
  ];
  
  log(`Found ${buildImageFiles.length} images in build directory`);
  
  // Process PNG files
  const pngFiles = buildImageFiles.filter(file => file.endsWith('.png'));
  if (pngFiles.length > 0) {
    if (commandExists('optipng')) {
      for (const file of pngFiles) {
        log(`Optimizing PNG: ${path.basename(file)}`);
        runCommand(`optipng -o3 "${file}"`); // Less aggressive optimization level
      }
    } else {
      log('optipng not found. Skipping PNG optimization.', 'warn');
    }
  }
  
  // Process JPG files
  const jpgFiles = buildImageFiles.filter(file => file.endsWith('.jpg') || file.endsWith('.jpeg'));
  if (jpgFiles.length > 0) {
    if (commandExists('convert')) {
      for (const file of jpgFiles) {
        log(`Optimizing JPG: ${path.basename(file)}`);
        runCommand(`convert "${file}" -quality 85 "${file}"`);
      }
    } else {
      log('ImageMagick not found. Skipping JPG optimization.', 'warn');
    }
  }
  
  // Process SVG files
  const svgFiles = buildImageFiles.filter(file => file.endsWith('.svg'));
  if (svgFiles.length > 0) {
    if (commandExists('svgo') || fs.existsSync(path.join(DEV_APP_DIR, 'node_modules', '.bin', 'svgo'))) {
      const svgoCmd = commandExists('svgo') ? 'svgo' : 'npx svgo';
      for (const file of svgFiles) {
        log(`Optimizing SVG: ${path.basename(file)}`);
        runCommand(`${svgoCmd} -i "${file}" -o "${file}"`);
      }
    } else {
      log('svgo not found. Installing locally...', 'warn');
      if (runCommand('npm install svgo --save-dev')) {
        for (const file of svgFiles) {
          log(`Optimizing SVG: ${path.basename(file)}`);
          runCommand(`npx svgo -i "${file}" -o "${file}"`);
        }
      } else {
        log('Failed to install svgo. Skipping SVG optimization.', 'warn');
      }
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
    ...glob.sync(path.join(JS_DIR, '*.js')),
    ...glob.sync(path.join(CSS_DIR, '*.css')),
    ...glob.sync(path.join(BUILD_DIR, '*.html')),
    ...glob.sync(path.join(BUILD_DIR, '*.json'))
  ];
  
  log(`Compressing ${assets.length} static assets`);
  
  // Create smaller batches to process
  const batchSize = 5;
  const batches = Math.ceil(assets.length / batchSize);
  
  for (let i = 0; i < batches; i++) {
    const batch = assets.slice(i * batchSize, (i + 1) * batchSize);
    for (const file of batch) {
      log(`Compressing: ${path.basename(file)}`);
      runCommand(`gzip -9 -c "${file}" > "${file}.gz"`, { stdio: 'ignore' });
    }
  }
  
  log('Asset compression completed', 'success');
}

// Create a report file with optimization details
function createOptimizationReport(startTime, endTime) {
  const reportPath = path.join(BUILD_DIR, 'optimization-report.json');
  
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  
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

// Clean up temporary files
function cleanupTempFiles() {
  log('Cleaning up temporary files');
  
  const tempFiles = [
    ...glob.sync(path.join(JS_DIR, 'temp_*.js')),
    ...glob.sync(path.join(JS_DIR, '*.tmp')),
    ...glob.sync(path.join(CSS_DIR, '*.tmp')),
    ...glob.sync(path.join(MEDIA_DIR, '**/*.tmp'))
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

// Main optimization function
async function runOptimization() {
  const startTime = Date.now();
  
  log('Starting React build and optimization process');
  
  // Ensure build directory exists
  ensureDirectoryExists(BUILD_DIR);
  
  // Run each step
  buildReactApp();
  purgeCss();
  optimizeJavaScript();
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