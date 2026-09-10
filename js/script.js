/* ==========================================================================
   PORTFÓLIO — Saulo Cavalcante
   Dados dos projetos + renderização da lista + paginação.

   PARA ADICIONAR UM NOVO PROJETO:
   1. Copie um dos objetos abaixo dentro do array "projects".
   2. Preencha os campos (o "icon" é uma classe do Font Awesome, ex:
      "fa-solid fa-chart-line" — veja mais ícones em fontawesome.com/icons).
   3. Salve. Ele aparece automaticamente na lista/paginação, sem mexer no HTML/CSS.
   ========================================================================== */

const projects = [
  {
    ticker: "Quant",
    description: "Scripts em Python para cálculo do índice de força relativa (RSI) e automação do download de séries históricas de ativos, aplicando conceitos de análise técnica.",
    stack: "Python, Pandas, Streamlit",
    category: "dados",
    icon: "fa-solid fa-wave-square",
    url: "https://github.com/sauloocavalcante/quant_ifpe"
  },
  {
    ticker: "Stocks Dashboard",
    description: "Dashboard interativo para visualizar o histórico de preços de ações, criptomoedas e ETFs, com busca por ticker e gráficos dinâmicos via Streamlit e Plotly.",
    stack: "Python · Streamlit · Plotly",
    category: "dados",
    icon: "fa-solid fa-chart-pie",
    url: "https://github.com/sauloocavalcante/stocks-dashboard"
  },
  {
    ticker: "Movies EDA",
    description: "Análise exploratória de dados para identificar quais gêneros de filme têm o melhor Retorno sobre Investimento (ROI)",
    stack: "Python · Pandas · Plotly · Jupyter",
    category: "dados",
    icon: "fa-solid fa-film",
    url: "https://github.com/sauloocavalcante/movies_EDA"
  },
  {
    ticker: "Portfólio Melissa",
    description: "Site de portfólio desenvolvido sob encomenda , em HTML, CSS e JavaScript puro, com páginas de categorias, conteúdos e galeria de fotos organizados em componentes reutilizáveis.",
    stack: "HTML · CSS · JavaScript",
    category: "dev",
    icon: "fa-solid fa-globe",
    url: "https://github.com/sauloocavalcante/portifolio-melissa"
  },
  {
    ticker: "FinanceApp IA",
    description: "Aplicativo de gerenciamento de finanças pessoais em Django, desenvolvido com pair programming assistido por IA.",
    stack: "Python · Django · SQLite/PostgreSQL",
    category: "dev",
    icon: "fa-solid fa-wallet",
    url: "https://github.com/sauloocavalcante/financeApp-IA"
  },
  {
    ticker: "Inventory Management System",
    description: "Sistema de gestão de estoque construído com Django, incluindo módulo de notificações e containerização com Docker para facilitar o deploy.",
    stack: "Python · Django · Docker",
    category: "dev",
    icon: "fa-solid fa-warehouse",
    url: "https://github.com/sauloocavalcante/inventory-management-system-"
  }
];

/* ---------- Paginação ---------- */

const PROJECTS_PER_PAGE = 3;
let currentPage = 1;

function getTotalPages() {
  return Math.max(1, Math.ceil(projects.length / PROJECTS_PER_PAGE));
}

/* ---------- Renderização ---------- */

function createProjectRow(project) {
  const row = document.createElement("a");
  row.className = "project-row reveal";
  row.href = project.url;
  row.target = "_blank";
  row.rel = "noopener noreferrer";

  row.innerHTML = `
    <span class="row-icon"><i class="${project.icon}"></i></span>
    <span class="row-main">
      <span class="row-title">${project.ticker}</span>
      <span class="row-desc">${project.description}</span>
      <span class="row-stack">${project.stack}</span>
    </span>
    <span class="row-arrow" aria-hidden="true">→</span>
  `;

  return row;
}

function renderProjects(page = 1, { immediate = false } = {}) {
  const list = document.getElementById("project-list");
  if (!list) return;

  const totalPages = getTotalPages();
  currentPage = Math.min(Math.max(1, page), totalPages);

  list.innerHTML = "";

  const start = (currentPage - 1) * PROJECTS_PER_PAGE;
  const pageProjects = projects.slice(start, start + PROJECTS_PER_PAGE);

  pageProjects.forEach((project) => {
    const row = createProjectRow(project);
    list.appendChild(row);
    // Ao trocar de página via clique, mostra na hora (sem esperar rolagem)
    if (immediate) {
      row.classList.add("is-visible");
    }
  });

  renderPagination();
}

function renderPagination() {
  const container = document.getElementById("project-pagination");
  if (!container) return;

  const totalPages = getTotalPages();
  container.innerHTML = "";

  // Com 3 projetos ou menos, nem precisa mostrar os quadradinhos
  if (totalPages <= 1) return;

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "page-btn" + (i === currentPage ? " is-active" : "");
    btn.textContent = String(i);
    btn.setAttribute("aria-label", `Página ${i} de projetos`);
    if (i === currentPage) btn.setAttribute("aria-current", "page");

    btn.addEventListener("click", () => {
      if (i === currentPage) return;
      renderProjects(i, { immediate: true });
      document.getElementById("projetos")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    container.appendChild(btn);
  }
}

/* ---------- Ano do rodapé ---------- */

function setFooterYear() {
  const yearEl = document.getElementById("ano");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ---------- Efeito de revelação ao rolar a página ---------- */

function setupScrollReveal() {
  // Marca os títulos de seção e o bloco "sobre" para o mesmo efeito dos cards
  document.querySelectorAll(".section-title, .about-text, .group-title").forEach((el) => {
    el.classList.add("reveal");
  });

  const revealElements = document.querySelectorAll(".reveal:not(.is-visible)");

  // Sem suporte a IntersectionObserver: mostra tudo direto, sem quebrar nada
  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  revealElements.forEach((el) => observer.observe(el));
}

/* ---------- Glow que acompanha o cursor ---------- */

function setupCursorGlow() {
  const glow = document.getElementById("cursorGlow");
  if (!glow) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

  if (prefersReducedMotion || !hasFinePointer) return;

  let mouseX = 0;
  let mouseY = 0;
  let glowX = 0;
  let glowY = 0;
  let isActive = false;

  window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;

    if (!isActive) {
      isActive = true;
      glowX = mouseX;
      glowY = mouseY;
      glow.classList.add("is-active");
    }
  });

  document.addEventListener("mouseleave", () => {
    isActive = false;
    glow.classList.remove("is-active");
  });

  function animate() {
    glowX += (mouseX - glowX);
    glowY += (mouseY - glowY);
    glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

/* ---------- Inicialização ---------- */

document.addEventListener("DOMContentLoaded", () => {
  renderProjects(1);
  setFooterYear();
  setupScrollReveal();
  setupCursorGlow();
});