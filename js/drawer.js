const DrawerManager = {
    init() {
        this.backdrop = document.getElementById('drawer-backdrop');
        this.drawer = document.getElementById('drawer');
        this.content = document.getElementById('drawer-content');
        this.title = document.getElementById('drawer-title');
        this.subtitle = document.getElementById('drawer-subtitle');
        this.btnClose = document.getElementById('btn-close-drawer');
        this.btnCancel = document.getElementById('btn-cancel-drawer');
        this.btnSave = document.getElementById('btn-save-drawer');

        if (this.btnClose) this.btnClose.onclick = () => this.close();
        if (this.btnCancel) this.btnCancel.onclick = () => this.close();
        if (this.backdrop) {
            // Disabled closing on backdrop click as per user request
            // this.backdrop.onclick = (e) => {
            //     if (e.target === this.backdrop) this.close();
            // };
        }
    },

    open({ title, subtitle, contentHtml, onSave }) {
        if (!this.drawer) this.init();

        this.title.textContent = title || '';
        this.subtitle.textContent = subtitle || '';
        this.content.innerHTML = contentHtml || '';

        if (onSave) {
            this.btnSave.onclick = () => {
                onSave();
                // We don't automatically close so form validation can happen
            };
        } else {
            this.btnSave.onclick = () => this.close();
        }

        this.backdrop.classList.add('active');
        this.drawer.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    },

    close() {
        if (this.backdrop) this.backdrop.classList.remove('active');
        if (this.drawer) this.drawer.classList.remove('active');
        document.body.style.overflow = '';
    }
};

const LookupManager = {
    init() {
        this.backdrop = document.getElementById('lookup-backdrop');
        this.container = document.getElementById('lookup-modal-container');

        if (this.backdrop) {
            this.backdrop.addEventListener('click', (e) => {
                if (e.target === this.backdrop) this.close();
            });
        }
    },

    async open(title, contentUrl, callback) {
        if (!this.backdrop) this.init();

        this.callback = callback;
        this.backdrop.classList.add('active');

        try {
            const res = await fetch(contentUrl);
            const html = await res.text();
            this.container.innerHTML = html;

            // Set title if header exists in content
            const titleEl = this.container.querySelector('#lookup-title');
            if (titleEl) titleEl.textContent = title;

            this.setupEvents();
        } catch (error) {
            console.error('Failed to load lookup content:', error);
            this.container.innerHTML = '<div class="lookup-modal"><div class="lookup-header"><h2>Error</h2><button onclick="LookupManager.close()">×</button></div><div class="lookup-body">Failed to load content.</div></div>';
        }
    },

    close() {
        if (this.backdrop) {
            this.backdrop.classList.remove('active');
        }
    },

    setupEvents() {
        // Handle row selection
        const rows = this.container.querySelectorAll('.lookup-table tbody tr');
        rows.forEach(row => {
            row.addEventListener('click', () => {
                const data = JSON.parse(row.dataset.item || '{}');
                if (this.callback) this.callback(data);
                this.close();
            });
        });

        // Close button in header
        const closeBtn = this.container.querySelector('.btn-close-lookup');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }
    }
};

window.DrawerManager = DrawerManager;
window.LookupManager = LookupManager;

document.addEventListener('DOMContentLoaded', () => {
    DrawerManager.init();
    LookupManager.init();
});
