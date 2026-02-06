document.addEventListener('DOMContentLoaded', () => {
    // Auth check — redirect to login if not authenticated
    if (!AuthManager.requireAuth()) return;

    ThemeManager.init();
    SidebarManager.init();
    updateUserInfo();
    loadPage("dashboard");
});

const pages = {
  dashboard: "pages/dashboard.html",
  pof: "pages/pof.html",
  pcv: "pages/pcv.html"
};

function updateUserInfo() {
    const user = AuthManager.getUser();
    if (!user) return;

    const initials = user.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    const roleName = user.role.charAt(0).toUpperCase() + user.role.slice(1);

    const initialsEl = document.querySelector('.user-initials');
    if (initialsEl) initialsEl.textContent = initials;

    const nameEl = document.querySelector('.user-name');
    if (nameEl) nameEl.textContent = user.name;

    const roleEl = document.querySelector('.user-role');
    if (roleEl) roleEl.textContent = roleName;
}

async function loadPage(page) {
  const main = document.getElementById("main-content");

  // Update active nav item
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  const activeLink = document.querySelector(`[onclick*="loadPage('${page}')"]`);
  if (activeLink) {
    const navItem = activeLink.closest('.nav-item');
    if (navItem) navItem.classList.add('active');
    // Expand parent submenu if it's a sub-item
    const expandable = activeLink.closest('.nav-item-expandable');
    if (expandable) expandable.classList.add('expanded');
  }

  try {
    main.innerHTML = '<div class="page-loader"><div class="spinner"></div></div>';

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
      } else if (page === 'pof') {
        PofManager.init();
      } else if (page === 'pcv') {
        PcvManager.init();
      }

      // Apply role-based UI after page renders
      AuthManager.applyRoleUI();
    }, 120);

  } catch (err) {
    console.error(err);
    main.innerHTML = "<h1>404 - Page not found</h1><p>Pastikan Anda membuka file ini menggunakan <strong>Live Server</strong> atau Local Server, bukan klik ganda file HTML langsung.</p>";
    main.style.opacity = 1;
  }
}
