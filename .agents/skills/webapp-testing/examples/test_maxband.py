from playwright.sync_api import sync_playwright

def test_course_creation():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:5174/login")
        
        # Login
        page.fill("input[type='email']", "admin@gmail.com")
        page.fill("input[type='password']", "Password@123")
        page.click("button:has-text('Sign In')")
        
        page.wait_for_url("**/admin**")
        
        # Go to create course
        page.goto("http://localhost:5174/admin/courses/new")
        page.wait_for_selector("input[name='title']")
        
        # Fill in dummy info
        page.fill("input[name='title']", "Test Course")
        
        # Fill in min and max band
        page.fill("input[name='minBand']", "8.0")
        page.fill("input[name='maxBand']", "7.0")
        
        # Handle dialog
        dialog_messages = []
        page.on("dialog", lambda dialog: (dialog_messages.append(dialog.message), dialog.accept()))
        
        # Submit
        page.click("button:has-text('Create Course')")
        page.wait_for_timeout(1000)
        
        print("First submit dialogs:", dialog_messages)
        dialog_messages.clear()
        
        # Now fix max band
        page.fill("input[name='maxBand']", "9.0")
        print("Max band value:", page.locator("input[name='maxBand']").input_value())
        
        # Submit again
        page.click("button:has-text('Create Course')")
        page.wait_for_timeout(1000)
        
        print("Second submit dialogs:", dialog_messages)
        
        browser.close()

if __name__ == "__main__":
    test_course_creation()
