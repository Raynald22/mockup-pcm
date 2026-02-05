const AuthManager = (() => {
    const USERS = [
        { email: 'management@ogya.com', password: '123456', role: 'management', name: 'Management User' },
        { email: 'sales@ogya.com', password: '123456', role: 'sales', name: 'Sales User' },
        { email: 'finance@ogya.com', password: '123456', role: 'finance', name: 'Finance User' }
    ];

    const STORAGE_KEY = 'pcm-user';

    function login(email, password) {
        const user = USERS.find(u => u.email === email && u.password === password);
        if (!user) return { success: false, message: 'Email atau password salah.' };

        const userData = { email: user.email, role: user.role, name: user.name };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        return { success: true, user: userData };
    }

    function logout() {
        sessionStorage.removeItem(STORAGE_KEY);
        window.location.href = 'login.html';
    }

    function getUser() {
        const data = sessionStorage.getItem(STORAGE_KEY);
        if (!data) return null;
        try { return JSON.parse(data); }
        catch { return null; }
    }

    function getRole() {
        return getUser()?.role || null;
    }

    function isLoggedIn() {
        return getUser() !== null;
    }

    function requireAuth() {
        if (!isLoggedIn()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    function applyRoleUI() {
        const role = getRole();
        if (!role) return;

        document.querySelectorAll('[data-role-hide]').forEach(el => {
            const roles = el.dataset.roleHide.split(',').map(r => r.trim());
            el.style.display = roles.includes(role) ? 'none' : '';
        });

        document.querySelectorAll('[data-role-disable]').forEach(el => {
            const roles = el.dataset.roleDisable.split(',').map(r => r.trim());
            if (roles.includes(role)) {
                el.setAttribute('disabled', 'true');
                el.style.opacity = '0.5';
                el.style.pointerEvents = 'none';
            } else {
                el.removeAttribute('disabled');
                el.style.opacity = '';
                el.style.pointerEvents = '';
            }
        });
    }

    return { login, logout, getUser, getRole, isLoggedIn, requireAuth, applyRoleUI };
})();
