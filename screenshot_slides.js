import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function screenshotSlides() {
  // Create screenshots directory
  const screenshotsDir = path.join(__dirname, 'slide_screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  // Navigate to the Google Slides presentation
  const presentationUrl = 'https://docs.google.com/presentation/d/1_rMtlEtgk6PORYIZn6wybtBITvfYX3GvU8WhT1s6Hdw/edit';
  console.log('Navigating to presentation...');
  await page.goto(presentationUrl);

  // Wait for the presentation to load
  await page.waitForTimeout(5000);

  console.log('Taking screenshots using keyboard navigation...');

  // Click somewhere on the presentation to focus it
  await page.click('body');
  await page.waitForTimeout(1000);

  // Go to first slide
  await page.keyboard.press('Home');
  await page.waitForTimeout(1000);

  // Take screenshots of slides using keyboard navigation
  for (let i = 0; i < 25; i++) {
    console.log(`Taking screenshot of slide ${i + 1}...`);

    // Take screenshot
    await page.screenshot({
      path: path.join(screenshotsDir, `slide_${i + 1}.png`),
      fullPage: false
    });

    // Go to next slide
    if (i < 24) { // Don't try to go past the last slide
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(1500); // Give more time for slide transition
    }
  }

  console.log('Screenshots completed!');

  // Keep browser open for 10 seconds so we can see the final state
  await page.waitForTimeout(10000);
  await browser.close();
}

screenshotSlides().catch(console.error);