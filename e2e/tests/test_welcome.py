from playwright.sync_api import Page, expect

MENU_INICIAL = [
    "Quem é o Mikael?",
    "Qual a experiência profissional?",
    "Quais são as skills técnicas?",
    "Quais projetos já fez?",
    "Qual a formação?",
    "Como entrar em contato?",

]

def test_titulo_da_pagina(chat, page: Page):
    expect(page).to_have_title("Mikael Mendonça · QA")


def test_mensagem_de_boas_vindas(chat):
    expect(chat.bot_messages.first).to_contain_text("assistente virtual")

def test_menu_inicial_tem_as_6_opcoes_na_ordem(chat):
    expect(chat.options).to_have_text(MENU_INICIAL)

def test_nao_existe_campo_de_digitacao(chat, page: Page):
    expect(page.locator("input, textarea")).to_have_count(0)