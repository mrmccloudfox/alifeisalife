import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function screenshotPublicSlides() {
  // Create screenshots directory
  const screenshotsDir = path.join(__dirname, 'slide_screenshots_public');
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

  // Navigate to the public Google Slides presentation in present mode
  const presentationUrl = 'https://docs.google.com/presentation/d/1_rMtlEtgk6PORYIZn6wybtBITvfYX3GvU8WhT1s6Hdw/present';
  console.log('Navigating to public presentation...');
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

    // Take screenshot of just the slide area (not the whole page)
    try {
      // Try to find the slide content area
      const slideArea = await page.locator('.punch-viewer-speakernotes-panel, .punch-viewer-content, [jsname="V67aGc"]').first();
      if (await slideArea.count() > 0) {
        await slideArea.screenshot({
          path: path.join(screenshotsDir, `slide_${i + 1}.png`)
        });
      } else {
        // Fallback: screenshot the whole page
        await page.screenshot({
          path: path.join(screenshotsDir, `slide_${i + 1}.png`),
          fullPage: false
        });
      }
    } catch (error) {
      console.log(`Error taking screenshot of slide ${i + 1}, trying fallback...`);
      await page.screenshot({
        path: path.join(screenshotsDir, `slide_${i + 1}.png`),
        fullPage: false
      });
    }

    // Go to next slide
    if (i < 24) { // Don't try to go past the last slide
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(2000); // Give more time for slide transition in present mode
    }
  }

  console.log('✅ Screenshots completed! Check the slide_screenshots_public directory.');

  // Keep browser open for 5 seconds to see final result
  await page.waitForTimeout(5000);
  await browser.close();
}

screenshotPublicSlides().catch(console.error);