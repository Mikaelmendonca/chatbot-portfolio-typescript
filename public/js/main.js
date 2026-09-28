import { getReply, getWelcome, labelOf, MENU_ID } from "./bot.js";
import { profile } from "./profile.js";
const log = document.getElementById("log");
const options = document.getElementById("options");
const LINK_RE = /(https?:\/\/[^\s]+|[\w.+-]+@[\w-]+\.[\w.-]+)/;
const initials = profile.name
    .split(" ")
    .filter((w) => w.length > 2)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
// ---------- cabeçalho (preenchido a partir do perfil) ----------
const ICONS = {
    linkedin: "M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05a3.75 3.75 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0z",
    github: "M12 .3a12 12 0 0 0-3.8 23.4c.6.1.83-.26.83-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.08-.73.08-.73 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .3",
    mail: "M2 5.5A2.5 2.5 0 0 1 4.5 3h15A2.5 2.5 0 0 1 22 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 18.5v-13zm2.4.1 7.6 6.2 7.6-6.2a.5.5 0 0 0-.1 0h-15a.5.5 0 0 0-.1 0zM20 7.7l-7.4 6a1 1 0 0 1-1.2 0L4 7.7v10.8c0 .28.22.5.5.5h15a.5.5 0 0 0 .5-.5V7.7z",
};
function iconLink(label, href, path) {
    const a = document.createElement("a");
    a.href = encodeURI(href);
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.title = label;
    a.setAttribute("aria-label", label);
    a.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>`; // path é constante do código
    return a;
}
document.getElementById("avatar").textContent = initials;
document.getElementById("name").textContent = profile.name;
document.getElementById("role").textContent = `${profile.title.split("|").pop().trim()} · assistente virtual`;
document.getElementById("links").append(iconLink("LinkedIn", profile.contact.linkedin, ICONS.linkedin), iconLink("GitHub", profile.contact.github, ICONS.github), iconLink("E-mail", `mailto:${profile.contact.email}`, ICONS.mail));
// ---------- mensagens ----------
/** Texto com URLs e e-mails viram links (sem innerHTML: o conteúdo nunca é interpretado como HTML). */
function linkify(text) {
    return text.split(LINK_RE).map((part, i) => {
        if (i % 2 === 0)
            return document.createTextNode(part); // com grupo de captura, índices ímpares são links
        const a = document.createElement("a");
        a.textContent = part.replace(/^https?:\/\//, "").replace(/\/$/, "");
        a.href = part.startsWith("http") ? encodeURI(part) : `mailto:${part}`;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        return a;
    });
}
/** Cada linha vira um bloco: "• x" é item de lista, "Título:" é rótulo, linha vazia é respiro. */
function fill(el, text) {
    el.replaceChildren(...text.split("\n").map((line) => {
        const div = document.createElement("div");
        if (line === "") {
            div.className = "gap";
        }
        else if (line.startsWith("• ")) {
            div.className = "line bullet";
            div.append(...linkify(line.slice(2)));
        }
        else {
            div.className = line.endsWith(":") && line.length < 40 ? "line label" : "line";
            div.append(...linkify(line));
        }
        return div;
    }));
}
function scrollDown() {
    // depois do layout: a altura do histórico muda quando os botões do rodapé mudam
    requestAnimationFrame(() => log.scrollTo({ top: log.scrollHeight, behavior: "smooth" }));
}
function row(role) {
    const r = document.createElement("div");
    r.className = `row ${role}`;
    if (role === "bot") {
        const av = document.createElement("div");
        av.className = "avatar";
        av.textContent = initials;
        r.appendChild(av);
    }
    const bubble = document.createElement("div");
    bubble.className = "msg";
    r.appendChild(bubble);
    log.appendChild(r);
    return { row: r, bubble };
}
function addUser(text) {
    fill(row("user").bubble, text);
    scrollDown();
}
function showOptions(list) {
    options.replaceChildren(...list.map((o, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.dataset.id = o.id;
        b.textContent = o.id === MENU_ID ? `← ${o.label}` : o.label;
        b.style.animationDelay = `${i * 40}ms`;
        if (o.id === MENU_ID)
            b.className = "back";
        return b;
    }));
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function botSays(reply) {
    showOptions([]);
    const { bubble } = row("bot");
    bubble.classList.add("typing");
    bubble.innerHTML = "<i></i><i></i><i></i>"; // HTML fixo do código
    scrollDown();
    await sleep(400 + Math.min(reply.text.length * 2, 600));
    bubble.classList.remove("typing");
    fill(bubble, reply.text);
    showOptions(reply.options);
    scrollDown();
}
let busy = false;
options.addEventListener("click", async (e) => {
    const id = e.target.closest("button")?.dataset.id;
    if (!id || busy)
        return;
    busy = true;
    addUser(labelOf(id));
    await botSays(getReply(id));
    busy = false;
});
void botSays(getWelcome());
