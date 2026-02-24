"""Vibes 랜딩페이지 시각 QA — Playwright 자동화"""
from playwright.sync_api import sync_playwright
import os

OUT = "/Users/ai-code-lab/projects/vibes/tests/visual-qa"
os.makedirs(OUT, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto("http://localhost:8770/index.html")
    page.wait_for_load_state("networkidle")

    # 1) 전체 페이지 스크린샷
    page.wait_for_timeout(2000)  # 히어로 애니메이션 대기
    page.screenshot(path=f"{OUT}/01-full-page-top.png", full_page=False)
    print("1) Full page top screenshot saved")

    # 스크롤하면서 전체 페이지 스크린샷
    page.screenshot(path=f"{OUT}/02-full-page.png", full_page=True)
    print("2) Full page screenshot saved")

    # 2) 마퀴 페이드 효과 확인
    marquee = page.locator(".marquee")
    marquee.scroll_into_view_if_needed()
    page.wait_for_timeout(500)
    marquee.screenshot(path=f"{OUT}/03-marquee-fade.png")
    print("3) Marquee fade screenshot saved")

    # 3a) Problem 카드 호버 상태
    page.locator("#problem").scroll_into_view_if_needed()
    page.wait_for_timeout(1500)  # 스태거 진입 애니메이션 대기

    # 카드 영역 스크린샷 (호버 전)
    grid = page.locator(".problem__grid")
    grid.screenshot(path=f"{OUT}/04-problem-cards-normal.png")
    print("4) Problem cards normal state saved")

    # 첫 번째 카드 호버
    first_card = page.locator(".problem-card").first
    first_card.hover()
    page.wait_for_timeout(400)
    grid.screenshot(path=f"{OUT}/05-problem-card-hover.png")
    print("5) Problem card hover state saved")

    # 3b) Footer 링크 호버 상태
    page.locator("footer").scroll_into_view_if_needed()
    page.wait_for_timeout(500)

    footer_link = page.locator(".footer__col-links a").first
    footer_link.screenshot(path=f"{OUT}/06-footer-link-normal.png")

    footer_link.hover()
    page.wait_for_timeout(400)
    footer_link.screenshot(path=f"{OUT}/07-footer-link-hover.png")
    print("6-7) Footer link normal/hover saved")

    # 4) 터미널 애니메이션 확인
    page.locator("#solution").scroll_into_view_if_needed()
    page.wait_for_timeout(4000)  # 터미널 애니메이션 완료 대기
    terminal = page.locator(".terminal")
    terminal.screenshot(path=f"{OUT}/08-terminal-animation.png")
    print("8) Terminal animation screenshot saved")

    # 5) 폼 토글 — Developer 상태
    page.locator("#waitlist").scroll_into_view_if_needed()
    page.wait_for_timeout(1000)
    form_wrap = page.locator(".waitlist__form-wrap")
    form_wrap.screenshot(path=f"{OUT}/09-form-developer.png")
    print("9) Form Developer state saved")

    # Client 토글 클릭
    page.locator('.toggle__btn[data-role="client"]').click()
    page.wait_for_timeout(500)
    form_wrap.screenshot(path=f"{OUT}/10-form-client.png")
    print("10) Form Client state saved")

    # Diff 블록 확인
    page.locator("#diffBlock").scroll_into_view_if_needed()
    page.wait_for_timeout(2000)
    diff = page.locator(".diff")
    diff.screenshot(path=f"{OUT}/11-diff-block.png")
    print("11) Diff block screenshot saved")

    browser.close()
    print(f"\nAll screenshots saved to {OUT}/")
