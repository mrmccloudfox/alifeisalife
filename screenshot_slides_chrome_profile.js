import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function screenshotSlidesWithChromeProfile() {
  // Create screenshots directory
  const screenshotsDir = path.join(__dirname, 'slide_screenshots_chrome');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }

  // Launch browser with user data directory to use existing Chrome profile
  const browser = await chromium.launchPersistentContext('/Users/matt/Library/Application Support/Google/Chrome/Default', {
    headless: false,
    viewport: { width: 1440, height: 900 },
    args: [
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor'
    ]
  });

  const page = browser.pages()[0] || await browser.newPage();

  // Navigate to the Google Slides presentation
  const presentationUrl = 'https://docs.google.com/presentation/d/1_rMtlEtgk6PORYIZn6wybtBITvfYX3GvU8WhT1s6Hdw/edit';
  console.log('Navigating to presentation...');
  await page.goto(presentationUrl);

  // Wait for the presentation to load
  console.log('Waiting for presentation to load...');
  await page.waitForTimeout(5000);

  console.log('Taking screenshots using keyboard navigation...');

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

  console.log('✅ Screenshots completed! Check the slide_screenshots_chrome directory.');

  // Keep browser open for 5 seconds to see final result
  await page.waitForTimeout(5000);
  await browser.close();
}

screenshotSlidesWithChromeProfile().catch(console.error);