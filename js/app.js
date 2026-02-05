document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    SidebarManager.init();
    loadPage("dashboard");
});

const pages = {
  dashboard: "pages/dashboard.html",
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

      // Re-initialize dashboard scripts if we are on the dashboard
      if (page === 'dashboard') {
        DashboardManager.init();
      }
    }, 120);

  } catch (err) {
    console.error(err);
    main.innerHTML = "<h1>404 - Page not found</h1><p>Pastikan Anda membuka file ini menggunakan <strong>Live Server</strong> atau Local Server, bukan klik ganda file HTML langsung.</p>";
    main.style.opacity = 1;
  }
}

