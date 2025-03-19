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

// Create static export
console.log('Building Next.js app...');
if (!runCommand('NODE_OPTIONS="--max-old-space-size=4096" NEXT_TELEMETRY_DISABLED=1 NODE_ENV=production npx next build')) {
  process.exit(1);
}

// Manual export to dist directory
console.log('Exporting static site to dist directory...');
if (!runCommand('npx next export -o dist')) {
  // If export fails, try to copy the out directory to dist as fallback
  console.log('Export failed, trying alternative export method...');
  if (fs.existsSync('out')) {
    try {
      // Copy files from out to dist
      runCommand('cp -r out/* dist/');
      console.log('Copied files from out to dist directory');
    } catch (error) {
      console.error('Failed to copy files to dist:', error);
      process.exit(1);
    }
  } else {
    console.error('Failed to export and no out directory exists');
    process.exit(1);
  }
}

// Check if dist directory has files
const distContents = fs.readdirSync('dist');
if (distContents.length === 0) {
  console.error('dist directory is empty after build! Build failed.');
  process.exit(1);
}

// Create a simple index.html if it doesn't exist (failsafe)
if (!fs.existsSync(path.join('dist', 'index.html'))) {
  console.log('Creating a failsafe index.html file...');
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Immigration Helper AI</title>
        <meta http-equiv="refresh" content="0;url=/index">
      </head>
      <body>
        <p>Please wait while we redirect you...</p>
      </body>
    </html>
  `;
  fs.writeFileSync(path.join('dist', 'index.html'), htmlContent);
}

console.log('=== Build completed successfully ===');
console.log('Directory contents of dist:');
runCommand('ls -la dist'); 