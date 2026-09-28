import pytest
from playwright.sync_api import expect 

CASOS = [
    ("Quem é o Mikael?", "Analista de Qualidade de Software"),
    ("Qual a experiência profissional?", "Tarso Tech"),
    ("Quais são as skills técnicas?", "Cypress"),
    ("Quais projetos já fez?", "Silmodas"),
    ("Qual a formação?", "Universidade Nove de Julho"),
    ("Como entrar em contato?", "mikaelmendonca007@gmail.com"),
]

@pytest.mark.parametrize("pergunta,esperado", CASOS)
def test_cada_botao_do_menu_responde(chat, pergunta, esperado):
   chat.choose(pergunta)
   expect(chat.user_messages.last).to_have_text(pergunta)
   expect(chat.bot_messages.last).to_contain_text(esperado)

def test_resposta_traz_botoes_relacionados_e_voltar(chat):
   chat.choose("Quem é o Mikael?")
   expect(chat.options).to_have_count(4)

def test_voltar_ao_menu_restaura_as_6_opcoes(chat):
    chat.choose("Quais projetos já fez?")
    chat.choose("Voltar ao menu")
    expect(chat.bot_messages.last).to_contain_text("Sobre o que você quer saber?")
    expect(chat.options).to_have_count(6)


def test_fluxo_projetos_ate_o_detalhe(chat):
    chat.choose("Quais projetos já fez?")
    chat.choose("Silmodas · Fiado")
    expect(chat.bot_messages.last).to_contain_text("228 testes")
    expect(chat.bot_messages.last).to_contain_text("100% de cobertura")


def test_fluxo_experiencia_ate_tipos_de_teste(chat):
    chat.choose("Qual a experiência profissional?")
    chat.choose("O que faz como QA na Tarso Tech?")
    chat.choose("Que tipos e técnicas de teste domina?")
    expect(chat.bot_messages.last).to_contain_text("Partição de equivalência")