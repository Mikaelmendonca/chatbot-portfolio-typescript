from playwright.sync_api import Page, expect


def test_links_do_cabecalho(chat, page: Page):
    links = page.locator("#links a")
    expect(links).to_have_count(3)
    expect(links.nth(0)).to_have_attribute("href", "https://linkedin.com/in/mikael-mendon%C3%A7a-65017a1b9/")
    expect(links.nth(1)).to_have_attribute("href", "https://github.com/Mikaelmendonca")
    expect(links.nth(2)).to_have_attribute("href", "mailto:mikaelmendonca007@gmail.com")


def test_links_abrem_em_nova_aba_com_seguranca(chat, page: Page):
    chat.choose("Como entrar em contato?")
    for link in page.locator(".row.bot .msg a").all():
        expect(link).to_have_attribute("target", "_blank")
        expect(link).to_have_attribute("rel", "noopener noreferrer")


def test_telefone_nao_aparece_em_nenhuma_resposta(chat, page: Page):
    for pergunta in [
        "Quem é o Mikael?",
        "Qual a experiência profissional?",
        "Quais são as skills técnicas?",
        "Quais projetos já fez?",
        "Qual a formação?",
        "Como entrar em contato?",
    ]:
        chat.choose(pergunta)
        chat.choose("Voltar ao menu")
    texto = page.locator("#log").inner_text()
    assert "94925" not in texto
    assert "(11)" not in texto


def test_celular_sem_rolagem_horizontal(chat, page: Page):
    page.set_viewport_size({"width": 375, "height": 812})
    chat.choose("Quais projetos já fez?")
    sem_overflow = page.evaluate(
        "document.documentElement.scrollWidth <= window.innerWidth"
    )
    assert sem_overflow


def test_celular_esconde_icone_de_email(chat, page: Page):
    page.set_viewport_size({"width": 375, "height": 812})
    expect(page.locator("#links a").nth(2)).to_be_hidden()