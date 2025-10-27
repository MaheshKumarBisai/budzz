
import time
from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Create a unique user
    timestamp = int(time.time())
    user_email = f"user_{timestamp}@example.com"
    user_name = "Test User"
    user_password = "Password123"

    # Sign up
    page.goto("http://localhost:3002/signup")
    page.get_by_label("Name").fill(user_name)
    page.get_by_label("Email").fill(user_email)
    page.get_by_label("Password").first.fill(user_password)
    page.get_by_label("Confirm Password").fill(user_password)
    page.get_by_role("button", name="Sign Up").click()

    # Wait for navigation to dashboard and take screenshot
    expect(page).to_have_url("http://localhost:3002/dashboard")
    page.screenshot(path="jules-scratch/verification/dashboard.png")

    # Navigate to Transactions and take screenshot
    page.get_by_role("link", name="Transactions").click()
    expect(page).to_have_url("http://localhost:3002/transactions")
    page.screenshot(path="jules-scratch/verification/transactions.png")

    # Navigate to Reports and take screenshot
    page.get_by_role("link", name="Reports").click()
    expect(page).to_have_url("http://localhost:3002/reports")
    page.screenshot(path="jules-scratch/verification/reports.png")

    # Navigate to Settings and take screenshot
    page.get_by_role("link", name="Settings").click()
    expect(page).to_have_url("http://localhost:3002/settings")
    page.screenshot(path="jules-scratch/verification/settings.png")

    context.close()
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
