from playwright.sync_api import Page, expect

class ChatPage:
    def __init__(self, page: Page):
        self.page = page
        self.options = page.locator("#options button")
        self.user_messages = page.locator(".row.user .msg")
        self.bot_messages = page.locator(".row.bot .msg")
        self.typing = page.locator(".typing")

    def open(self) -> "ChatPage":
        self.page.goto("/")
        expect(self.options).to_have_count(6)
        return self
    
    def option(self, name: str):
        return self.page.get_by_role("button", name=name)
    
    def choose(self, name: str) -> None:
        self.option(name).click()
        expect(self.typing).to_have_count(0)





