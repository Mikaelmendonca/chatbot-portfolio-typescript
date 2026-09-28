import { profile as defaultProfile } from "./profile.js";
export const MENU_ID = "menu";
const TOP_LEVEL = ["about", "experience", "skills", "projects", "education", "contact"];
const bullets = (items) => items.map((i) => `• ${i}`).join("\n");
const nodes = [
    {
        id: MENU_ID,
        label: "Voltar ao menu",
        answer: () => "Sobre o que você quer saber?",
        next: TOP_LEVEL,
    },
    {
        id: "about",
        label: "Quem é o Mikael?",
        answer: (p) => `${p.name} — ${p.title}\n${p.location}\n\n${p.summary}`,
        next: ["experience", "projects", "contact"],
    },
    {
        id: "experience",
        label: "Qual a experiência profissional?",
        answer: (p) => p.experience.map((e) => `${e.role} · ${e.company} (${e.period})`).join("\n") +
            "\n\nHoje atua como QA, depois de passar por funções administrativas e de atendimento.",
        next: ["exp_qa", "skills", "projects"],
    },
    {
        id: "exp_qa",
        label: "O que faz como QA na Tarso Tech?",
        answer: (p) => {
            const qa = p.experience[0];
            return `${qa.role} · ${qa.company} (${qa.period})\n\n${bullets(qa.bullets)}`;
        },
        next: ["testing", "skills", "projects"],
    },
    {
        id: "testing",
        label: "Que tipos e técnicas de teste domina?",
        answer: (p) => `Tipos de teste:\n${bullets(p.testTypes)}\n\nTécnicas:\n${bullets(p.techniques)}`,
        next: ["skills", "projects"],
    },
    {
        id: "skills",
        label: "Quais são as skills técnicas?",
        answer: (p) => p.skills.map((s) => `${s.category}: ${s.items.join(", ")}`).join("\n\n"),
        next: ["testing", "projects", "experience"],
    },
    {
        id: "projects",
        label: "Quais projetos já fez?",
        answer: (p) => p.projects.map((pr) => `${pr.name}\n${pr.stack.join(" • ")}`).join("\n\n") +
            "\n\nEscolha um para ver os detalhes:",
        next: defaultProfile.projects.map((pr) => `project_${pr.id}`),
    },
    {
        id: "education",
        label: "Qual a formação?",
        answer: (p) => p.education.map((e) => `${e.course}\n${e.institution} · ${e.status}`).join("\n\n"),
        next: ["skills", "contact"],
    },
    {
        id: "contact",
        label: "Como entrar em contato?",
        answer: (p) => `Vamos conversar!\n\nE-mail:\n${p.contact.email}\n\nLinkedIn:\n${p.contact.linkedin}\n\nGitHub:\n${p.contact.github}`,
        next: ["projects", "experience"],
    },
];
// Um nó de detalhe por projeto, gerado a partir dos dados do perfil.
for (const pr of defaultProfile.projects) {
    nodes.push({
        id: `project_${pr.id}`,
        label: pr.name,
        answer: (p) => {
            const project = p.projects.find((x) => x.id === pr.id) ?? pr;
            return `${project.name}\n${project.stack.join(" • ")}\n\n${project.summary}\n\n${bullets(project.bullets)}\n\nCódigo no GitHub:\n${project.url}`;
        },
        next: ["projects", "skills", "contact"],
    });
}
const byId = new Map(nodes.map((n) => [n.id, n]));
const asOption = (id) => ({ id, label: byId.get(id).label });
export const allNodeIds = nodes.map((n) => n.id);
export function getReply(id, p = defaultProfile) {
    const node = byId.get(id) ?? byId.get(MENU_ID);
    const options = node.next.map(asOption);
    if (node.id !== MENU_ID)
        options.push(asOption(MENU_ID));
    return { text: node.answer(p), options };
}
export function getWelcome(p = defaultProfile) {
    return {
        text: `Olá! Eu sou o assistente virtual do ${p.name}, ${p.title}. Escolha abaixo o que você quer saber.`,
        options: TOP_LEVEL.map(asOption),
    };
}
export function labelOf(id) {
    return byId.get(id)?.label ?? "";
}
