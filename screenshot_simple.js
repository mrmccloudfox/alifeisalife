import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function screenshotSimple() {
  // Create screenshots directory
  const screenshotsDir = path.join(__dirname, 'slide_screenshots_final');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }

  const browser = await chromium.launch({
    headless: false  // Keep visible so we can see what's happening
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  // Navigate to the public Google Slides presentation in edit mode (which shows individual slides better)
  const presentationUrl = 'https://docs.google.com/presentation/d/1_rMtlEtgk6PORYIZn6wybtBITvfYX3GvU8WhT1s6Hdw/edit';
  console.log('Navigating to presentation...');
  await page.goto(presentationUrl);

  // Wait for the presentation to load
  console.log('Waiting for presentation to load...');
  await page.waitForTimeout(8000); // Longer wait

  console.log('Taking screenshots using keyboard navigation...');

  // Go to first slide - use keyboard directly without clicking
  await page.keyboard.press('Home');
  await page.waitForTimeout(3000);

  // Take screenshots of slides using keyboard navigation
  for (let i = 0; i < 25; i++) {
    console.log(`📸 Taking screenshot of slide ${i + 1}...`);

    // Take screenshot of the whole viewport
    await page.screenshot({
      path: path.join(screenshotsDir, `slide_${i + 1}.png`),
      fullPage: false
    });

    // Go to next slide
    if (i < 24) { // Don't try to go past the last slide
      await page.keyboard.press('ArrowDown'); // Try ArrowDown instead of ArrowRight
      await page.waitForTimeout(2000);
    }
  }

  console.log('✅ Screenshots completed! Check the slide_screenshots_final directory.');

  // Keep browser open for 5 seconds to see final result
  await page.waitForTimeout(5000);
  await browser.close();
}

screenshotSimple().catch(console.error);