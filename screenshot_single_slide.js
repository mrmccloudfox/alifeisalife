import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function screenshotSingleSlide(slideNumber) {
  const screenshotsDir = path.join(__dirname, 'single_slide_screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }

  const browser = await chromium.launch({
    headless: false
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1200 }
  });

  const page = await context.newPage();

  // Navigate to the presentation
  const presentationUrl = 'https://docs.google.com/presentation/d/1_rMtlEtgk6PORYIZn6wybtBITvfYX3GvU8WhT1s6Hdw/edit';
  console.log('Navigating to presentation...');
  await page.goto(presentationUrl);

  await page.waitForTimeout(8000);

  console.log(`Navigating to slide ${slideNumber}...`);

  // Go to first slide
  await page.keyboard.press('Home');
  await page.waitForTimeout(2000);

  // Navigate to the specific slide
  for (let i = 1; i < slideNumber; i++) {
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(1000);
  }

  await page.waitForTimeout(2000);

  console.log(`📸 Taking screenshot of slide ${slideNumber}...`);

  // Take screenshot with full page to capture all content
  await page.screenshot({
    path: path.join(screenshotsDir, `slide_${slideNumber}.png`),
    fullPage: true
  });

  console.log(`✅ Screenshot saved: slide_${slideNumber}.png`);

  await page.waitForTimeout(3000);
  await browser.close();
}

// Get slide number from command line argument
const slideNumber = parseInt(process.argv[2]) || 19;
screenshotSingleSlide(slideNumber).catch(console.error);