import { test } from "node:test";
import assert from "node:assert/strict";
import { allNodeIds, getReply, getWelcome, MENU_ID } from "./bot.js";
import { profile } from "./profile.js";

test("todo botão leva a uma resposta existente", () => {
  const ids = new Set(allNodeIds);
  for (const id of allNodeIds) {
    for (const opt of getReply(id).options) {
      assert.ok(ids.has(opt.id), `${id} -> ${opt.id} não existe`);
      assert.ok(opt.label.length > 0);
    }
  }
});

test("ids de nós são únicos", () => {
  assert.equal(new Set(allNodeIds).size, allNodeIds.length);
});

test("todos os nós são alcançáveis a partir das boas-vindas", () => {
  const seen = new Set<string>();
  const queue = getWelcome().options.map((o) => o.id);
  while (queue.length) {
    const id = queue.pop()!;
    if (seen.has(id)) continue;
    seen.add(id);
    queue.push(...getReply(id).options.map((o) => o.id));
  }
  for (const id of allNodeIds) assert.ok(seen.has(id), `${id} inalcançável`);
});

test("respostas trazem dados do currículo", () => {
  assert.ok(getReply("contact").text.includes(profile.contact.email));
  assert.ok(getReply("exp_qa").text.includes("Tarso Tech"));
  assert.ok(getReply("skills").text.includes("Cypress"));
  assert.ok(getReply("project_silmodas").text.includes("228 testes"));
  assert.ok(getReply("project_silmodas").text.includes("github.com/Mikaelmendonca/silmodas-fiado"));
  assert.ok(getReply("education").text.includes("Universidade Nove de Julho"));
});

test("o menu de projetos tem um botão para cada projeto do perfil", () => {
  const ids = getReply("projects").options.map((o) => o.id);
  for (const pr of profile.projects) assert.ok(ids.includes(`project_${pr.id}`), pr.id);
});

test("não expõe telefone", () => {
  for (const id of allNodeIds) assert.ok(!/\(11\)|94925/.test(getReply(id).text));
});

test("id desconhecido volta ao menu; menu não oferece 'voltar'", () => {
  assert.equal(getReply("xyz").text, getReply(MENU_ID).text);
  assert.ok(!getReply(MENU_ID).options.some((o) => o.id === MENU_ID));
  assert.ok(getReply("about").options.some((o) => o.id === MENU_ID));
});
