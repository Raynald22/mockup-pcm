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
            // Disabled closing on backdrop click as per user request
            // this.backdrop.addEventListener('click', (e) => {
            //     if (e.target === this.backdrop) this.close();
            // });
        }
    },

    async open(title, contentUrl, callback, onLoaded) {
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

            // Call onLoaded callback if provided (Initialization hook)
            if (onLoaded && typeof onLoaded === 'function') {
                onLoaded();
            }
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
            row.addEventListener('dblclick', () => {
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

class SearchableSelect {
    constructor(element, options) {
        this.container = element;
        this.options = options;
        this.selectedValue = "";
        this.isOpen = false;
        this.init();
    }

    init() {
        this.display = this.container.querySelector('.select-display');
        this.dropdown = this.container.querySelector('.select-dropdown');
        this.searchInput = this.container.querySelector('.select-search');
        this.optionsList = this.container.querySelector('.select-options');
        this.noResults = this.container.querySelector('.no-results');

        this.renderOptions();

        this.display.addEventListener('click', () => this.toggle());

        this.searchInput.addEventListener('input', (e) => this.filterOptions(e.target.value));

        // Prevent click in search input from closing dropdown
        this.searchInput.addEventListener('click', (e) => e.stopPropagation());

        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target)) {
                this.close();
            }
        });
    }

    renderOptions() {
        this.optionsList.innerHTML = this.options.map(opt => `
            <div class="select-option" data-value="${opt.value}">${opt.label}</div>
        `).join('');

        this.optionsList.querySelectorAll('.select-option').forEach(el => {
            el.addEventListener('click', () => this.selectOption(el.dataset.value, el.textContent));
        });
    }

    toggle() {
        if (this.isOpen) this.close();
        else this.open();
    }

    open() {
        this.isOpen = true;
        this.container.classList.add('active');
        this.searchInput.value = "";
        this.filterOptions("");
        setTimeout(() => this.searchInput.focus(), 100);
    }

    close() {
        this.isOpen = false;
        this.container.classList.remove('active');
    }

    filterOptions(query) {
        const q = query.toLowerCase();
        let count = 0;
        this.optionsList.querySelectorAll('.select-option').forEach(el => {
            const text = el.textContent.toLowerCase();
            if (text.includes(q)) {
                el.classList.remove('hidden');
                count++;
            } else {
                el.classList.add('hidden');
            }
        });

        this.noResults.style.display = count === 0 ? 'block' : 'none';
    }

    selectOption(value, label) {
        this.selectedValue = value;
        this.display.querySelector('.selected-text').textContent = label;
        this.display.classList.add('has-value');
        this.close();

        // Dispatch custom change event
        const event = new CustomEvent('change', { detail: { value, label } });
        this.container.dispatchEvent(event);
    }

    getValue() {
        return this.selectedValue;
    }
}

window.DrawerManager = DrawerManager;
window.LookupManager = LookupManager;
window.SearchableSelect = SearchableSelect;

document.addEventListener('DOMContentLoaded', () => {
    DrawerManager.init();
    LookupManager.init();
});
