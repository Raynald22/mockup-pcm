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
    }

    function toggle() {
        current = current === 'light' ? 'dark' : 'light';
        apply(current);
        localStorage.setItem('pcm-theme', current);
    }

    return { init, toggle };
})();
