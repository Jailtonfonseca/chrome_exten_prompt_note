from playwright.sync_api import sync_playwright
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        page.goto("http://localhost:5173")
        time.sleep(5)
        print(page.content())

        # Register a new user
        page.click('button:has-text("Register")')
        page.fill('input[name="username"]', "testuser")
        page.fill('input[name="password"]', "password")
        page.click('button:has-text("Register")')

        # Log in
        page.click('button:has-text("Login")')
        page.fill('input[name="username"]', "testuser")
        page.fill('input[name="password"]', "password")
        page.click('button:has-text("Login")')

        # Create a new prompt
        page.click('button:has-text("New Prompt")')
        page.fill('input[placeholder="Enter a title for your prompt..."]', "Test Prompt")
        page.fill('textarea[placeholder="Enter your prompt text here..."]', "This is a test prompt.")
        page.click('button:has-text("Save")')

        page.screenshot(path="jules-scratch/verification/verification.png")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
