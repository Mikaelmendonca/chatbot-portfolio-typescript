import os
import subprocess
import time
import urllib.request
from pathlib import Path

import pytest
from playwright.sync_api import Page

from chat_page import ChatPage

ROOT = Path(__file__).resolve().parent.parent
URL = "http://localhost:4173"


@pytest.fixture
def chat(page: Page) -> ChatPage:
    return ChatPage(page).open()


def _no_ar() -> bool:
    try:
        urllib.request.urlopen(URL, timeout=1)
        return True
    except OSError:
        return False


@pytest.fixture(scope="session", autouse=True)
def servidor():
    """Sobe o site se ele ainda não estiver no ar (ex.: dentro do CI)."""
    if _no_ar():  # já rodando, por exemplo via `npm run dev` num terminal à parte
        yield
        return
    proc = subprocess.Popen(
        ["node", "scripts/serve.mjs"],
        cwd=ROOT,
        env={**os.environ, "PORT": "4173"},
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    try:
        for _ in range(50):
            if _no_ar():
                break
            time.sleep(0.2)
        else:
            proc.terminate()
            raise RuntimeError("o servidor não subiu em 10 s (rode `npm run build` antes)")
        yield
    finally:
        proc.terminate()
