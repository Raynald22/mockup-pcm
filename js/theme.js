const ThemeManager = (() => {
    let current = localStorage.getItem('pcm-theme') || 'light';

    function init() {
        apply(current);
        const btn = document.getElementById('theme-toggle');
        if (btn) btn.addEventListener('click', toggle);
    }

    function apply(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        current = theme;
        const logoSrc = theme === 'light'
            ? 'assets/logo/ogya-logo-light.png'
            : 'assets/logo/ogya-logo.png';
        const sidebarLogo = document.querySelector('.sidebar-logo .logo-full');
        if (sidebarLogo) sidebarLogo.src = logoSrc;
        const loginLogo = document.querySelector('.login-logo img');
        if (loginLogo) loginLogo.src = logoSrc;
    }

    function toggle() {
        current = current === 'light' ? 'dark' : 'light';
        apply(current);
        localStorage.setItem('pcm-theme', current);
    }

    return { init, toggle };
})();
