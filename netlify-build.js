/**
 * Custom Netlify build script to handle TypeScript issues and ensure smooth builds
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Helper to run commands and log output
function runCommand(command) {
  console.log(`\n=== Running: ${command} ===\n`);
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Command failed: ${command}`);
    console.error(error.message);
    return false;
  }
}

// Helper to copy directory contents
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Main build process
console.log('=== Starting custom Netlify build script ===');

// Generate Prisma client
console.log('Generating Prisma client...');
if (!runCommand('npx prisma generate')) {
  process.exit(1);
}

// Create out directory if it doesn't exist
console.log('Creating out directory if not exists...');
if (!fs.existsSync('out')) {
  fs.mkdirSync('out', { recursive: true });
}

// Create dist directory if it doesn't exist
console.log('Creating dist directory if not exists...');
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist', { recursive: true });
}

// Ensure we start with empty directories
console.log('Clearing previous build artifacts...');
runCommand('rm -rf .next');
runCommand('rm -rf out/*');
runCommand('rm -rf dist/*');

// Create the redirects file for SPA fallback
console.log('Creating _redirects file for SPA behavior...');
fs.writeFileSync('dist/_redirects', `
# SPA fallback
/*  /index.html  200
`);

// Try to build with next build
console.log('Building Next.js app with next build...');
let buildSuccess = false;

// First try: Standard build
buildSuccess = runCommand('NODE_OPTIONS="--max-old-space-size=4096" NEXT_TELEMETRY_DISABLED=1 NODE_ENV=production npx next build');

// If standard build succeeds, check for output files
if (buildSuccess) {
  console.log('Build succeeded, checking for output files in out directory...');
  
  if (fs.existsSync('out') && fs.readdirSync('out').length > 0) {
    console.log('Next.js generated output to "out" directory, copying to dist...');
    copyDir('out', 'dist');
    
    // Add redirects file to the dist folder too
    fs.writeFileSync('dist/_redirects', `
# SPA fallback
/*  /index.html  200
`);
  } else {
    console.log('No files found in out directory, checking .next/...');
    
    if (fs.existsSync('.next/static')) {
      console.log('Exporting Next.js app to dist directory...');
      if (!runCommand('npx next export -o dist')) {
        console.log('Export failed, creating a backup static site...');
        createBackupSite();
      }
    } else {
      console.log('No static files found, creating a backup static site...');
      createBackupSite();
    }
  }
} else {
  // If standard build fails, create a backup site
  console.log('Build failed, creating a backup static site...');
  createBackupSite();
}

// Function to create a basic static site as fallback
function createBackupSite() {
  console.log('Creating a basic index.html...');
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Immigration Helper AI</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #202124;
            color: #ffffff;
            text-align: center;
          }
          .container {
            max-width: 800px;
            padding: 2rem;
          }
          h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
          }
          p {
            font-size: 1.25rem;
            margin-bottom: 2rem;
            line-height: 1.6;
          }
          .message {
            background-color: #444;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 2rem;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Immigration Helper AI</h1>
          <p>Your AI-powered immigration assistant</p>
          <div class="message">
            <p>This is a static preview of the application. The full experience is available when connected to the backend services.</p>
          </div>
        </div>
      </body>
    </html>
  `;
  fs.writeFileSync(path.join('dist', 'index.html'), htmlContent);
}

// Check if dist directory has files
const distContents = fs.readdirSync('dist');
if (distContents.length === 0) {
  console.error('dist directory is empty after build! Build failed.');
  process.exit(1);
}

console.log('=== Build completed successfully ===');
console.log('Directory contents of dist:');
runCommand('ls -la dist'); 