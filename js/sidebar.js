const SidebarManager = (() => {
    function init() {
        bindCollapseToggle();
        bindSubmenuToggles();
        setActiveItem();
        bindMobileBackdrop();
    }

    function bindCollapseToggle() {
        const btn = document.getElementById('sidebar-toggle');
        const layout = document.querySelector('.app-layout');
        if (!btn || !layout) return;

        btn.addEventListener('click', () => {
            if (window.innerWidth < 992) {
                layout.classList.toggle('sidebar-open');
            } else {
                layout.classList.toggle('sidebar-collapsed');
            }
        });
    }

    function bindSubmenuToggles() {
        document.querySelectorAll('.nav-item-expandable').forEach(item => {
            const link = item.querySelector(':scope > .nav-link');
            if (!link) return;

            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const layout = document.querySelector('.app-layout');
                if (layout.classList.contains('sidebar-collapsed') && window.innerWidth >= 992) return;

                item.classList.toggle('expanded');
            });
        });
    }

    function setActiveItem() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        document.querySelectorAll('.nav-link[href]').forEach(link => {
            const href = link.getAttribute('href');
            if (!href || href === '#') return;

            if (href.split('/').pop() === currentPage) {
                link.closest('.nav-item').classList.add('active');

                let parent = link.closest('.nav-submenu');
                while (parent) {
                    const expandable = parent.closest('.nav-item-expandable');
                    if (expandable) expandable.classList.add('expanded');
                    parent = expandable ? expandable.parentElement.closest('.nav-submenu') : null;
                }
            }
        });
    }

    function bindMobileBackdrop() {
        const backdrop = document.querySelector('.sidebar-backdrop');
        const layout = document.querySelector('.app-layout');
        if (!backdrop || !layout) return;

        backdrop.addEventListener('click', () => layout.classList.remove('sidebar-open'));
    }

    return { init };
})();
