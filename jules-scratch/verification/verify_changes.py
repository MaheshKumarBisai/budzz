from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Login
    page.goto("http://localhost:3001/login")
    page.wait_for_selector('input[name="email"]')
    page.get_by_label("Email").fill("test@example.com")
    page.get_by_label("Password").fill("password123")
    page.get_by_role("button", name="Sign In").click()

    # Dashboard
    page.wait_for_url("http://localhost:3001/dashboard")
    page.screenshot(path="jules-scratch/verification/dashboard.png")

    # Transactions
    page.get_by_role("link", name="Transactions").click()
    page.wait_for_url("http://localhost:3001/transactions")
    page.screenshot(path="jules-scratch/verification/transactions.png")

    # Add Transaction
    page.get_by_role("link", name="Add Transaction").click()
    page.wait_for_url("http://localhost:3001/transactions/add")
    page.screenshot(path="jules-scratch/verification/add-transaction.png")
    page.go_back()

    # Reports
    page.get_by_role("link", name="Reports").click()
    page.wait_for_url("http://localhost:3001/reports")
    page.screenshot(path="jules-scratch/verification/reports.png")

    # Settings
    page.get_by_role("link", name="Settings").click()
    page.wait_for_url("http://localhost:3001/settings")
    page.screenshot(path="jules-scratch/verification/settings.png")

    context.close()
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
