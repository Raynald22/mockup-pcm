document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    SidebarManager.init();
    loadPage("dashboard");
    DashboardManager.init();
});

const pages = {
  dashboard: `
    <div class="content-placeholder">
      <h1>Dashboard</h1>
      <p>Project Cost Monitoring - Main content area.</p>
    </div>
  `,
  pof: "pages/pof.html",
  pcv: "pages/pcv.html"
};

async function loadPage(page) {
  const main = document.getElementById("main-content");

  try {
    main.style.opacity = 0;

    const res = await fetch(pages[page]);

    if (!res.ok) {
      throw new Error("Page not found");
    }

    const html = await res.text();

    setTimeout(() => {
      main.innerHTML = html;
      main.style.opacity = 1;
    }, 120);

  } catch (err) {
    main.innerHTML = "<h1>404 - Page not found</h1>";
    main.style.opacity = 1;
  }
}

