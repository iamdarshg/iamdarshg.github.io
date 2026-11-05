import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

ROOT = Path(r"D:\CodeProjects\iamdarshg.github.io")
OUT = ROOT / "output" / "playwright"
OUT.mkdir(parents=True, exist_ok=True)

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1440, "height": 900}, reduced_motion="no-preference", record_video_dir=str(OUT), record_video_size={"width": 1440, "height": 900})
        page = await context.new_page()
        for path in ["/", "/projects.html", "/education.html", "/interests.html", "/contact.html"]:
            await page.goto("http://127.0.0.1:8899" + path, wait_until="networkidle")
            await page.wait_for_timeout(800)
            await page.evaluate("window.scrollTo(0, 0)")
            await page.wait_for_timeout(300)
            height = await page.evaluate("document.documentElement.scrollHeight")
            steps = max(10, min(36, int(height / 240)))
            for i in range(steps + 1):
                y = round((height - 900) * i / steps)
                await page.evaluate("y => window.scrollTo(0, y)", y)
                await page.wait_for_timeout(140)
            await page.wait_for_timeout(400)
        video_path = await page.video.path()
        await context.close()
        await browser.close()
        print(video_path)

asyncio.run(main())
