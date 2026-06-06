import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function waitForUserInput(message) {
  return new Promise((resolve) => {
    rl.question(message, (answer) => {
      resolve(answer);
    });
  });
}

async function screenshotSlidesWithManualLogin() {
  // Create screenshots directory
  const screenshotsDir = path.join(__dirname, 'slide_screenshots_logged_in');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }

  const browser = await chromium.launch({
    headless: false, // Keep visible so user can log in
    slowMo: 100 // Add some delay to make it easier to see what's happening
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  // Navigate to the Google Slides presentation
  const presentationUrl = 'https://docs.google.com/presentation/d/1_rMtlEtgk6PORYIZn6wybtBITvfYX3GvU8WhT1s6Hdw/edit';
  console.log('Navigating to presentation...');
  await page.goto(presentationUrl);

  // Wait for user to log in
  console.log('\n🚨 MANUAL LOGIN REQUIRED 🚨');
  console.log('Please log into Google in the browser window that just opened.');
  console.log('Navigate to the presentation and make sure you can see the slides.');

  await waitForUserInput('\nPress ENTER when you are logged in and can see the presentation slides...');

  console.log('\nGreat! Now taking screenshots...');
  await page.waitForTimeout(2000);

  // Click somewhere on the presentation to focus it
  await page.click('body');
  await page.waitForTimeout(1000);

  // Go to first slide
  await page.keyboard.press('Home');
  await page.waitForTimeout(2000);

  // Take screenshots of slides using keyboard navigation
  for (let i = 0; i < 25; i++) {
    console.log(`📸 Taking screenshot of slide ${i + 1}...`);

    // Take screenshot
    await page.screenshot({
      path: path.join(screenshotsDir, `slide_${i + 1}.png`),
      fullPage: false
    });

    // Go to next slide
    if (i < 24) { // Don't try to go past the last slide
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(1500); // Give time for slide transition
    }
  }

  console.log('✅ Screenshots completed! Check the slide_screenshots_logged_in directory.');

  await waitForUserInput('\nPress ENTER to close the browser...');

  rl.close();
  await browser.close();
}

screenshotSlidesWithManualLogin().catch(console.error);