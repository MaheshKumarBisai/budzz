from playwright.sync_api import sync_playwright
import time

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    # Test validation error
    page.goto("http://localhost:3000/login")
    page.click('button[type="submit"]')
    page.screenshot(path="jules-scratch/verification/login-validation-error.png")

    # Test successful login
    page.goto("http://localhost:3000/signup")
    email = f"test-{int(time.time())}@test.com"
    page.fill('input[name="name"]', 'Test User')
    page.fill('input[name="email"]', email)
    page.fill('input[name="password"]', 'Password123')
    page.click('button[type="submit"]')
    page.wait_for_url("http://localhost:3000/dashboard")
    page.screenshot(path="jules-scratch/verification/dashboard.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
