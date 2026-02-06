const PcvManager = (() => {
    function init() {
        renderTable('pcv-table', MOCK_DATA.pcvs, pcvColumns());

        // Update search input placeholder based on selected category
        const sel = document.querySelector('.search-category');
        const input = document.querySelector('.table-search');
        if (sel && input) {
            const updatePlaceholder = () => {
                const label = sel.options[sel.selectedIndex]?.text || '';
                input.placeholder = label ? `Search ${label}` : 'Search';
            };
            updatePlaceholder();
            sel.addEventListener('change', updatePlaceholder);
        }
    }

    function formatRp(num) {
        return 'Rp ' + num.toLocaleString('id-ID');
    }

    function formatDate(val) {
        if (!val) return '';
        const d = new Date(val);
        if (isNaN(d)) return val;
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    function formatDocumentStatus(val) {
        if (val === 0 || val === '0') return 'Incomplete';
        if (val === 1 || val === '1') return 'Complete';
        return String(val ?? '');
    }

    function pcvColumns() {
        return [
            { key: 'companyName', label: 'Company' },
            { key: 'costNumber', label: 'PCV Number' },
            { key: 'dueDate', label: 'Due Date', format: formatDate },
            { key: 'projectNumber', label: 'Project Number' },
            { key: 'projectName', label: 'Project Name' },
            // { key: 'amount', label: 'Amount', format: formatRp  },
            // { key: 'statusDescription', label: 'Status' },
            { key: 'paymentStatusDesc', label: 'Status Payment' },
            { key: 'documentStatus', label: 'Document', format: formatDocumentStatus },
            { key: 'action', label: 'Actions' },
        ];
    }

    function renderTable(id, data, columns) {
        const el = document.getElementById(id);
        if (!el) return;

        // Ensure `data` is an array to avoid runtime errors when it's undefined
        if (!Array.isArray(data)) data = [];

        // basic pagination state per table
        window._pofState = window._pofState || {};
        const state = window._pofState[id] || { page: 1, pageSize: 10 };
        window._pofState[id] = state;

        const totalItems = data.length;
        const totalPages = Math.max(1, Math.ceil(totalItems / state.pageSize));
        if (state.page > totalPages) state.page = totalPages;
        const start = (state.page - 1) * state.pageSize;
        const end = Math.min(start + state.pageSize, totalItems);

        const thead = columns.map(c => `<th>${c.label}</th>`).join('');
        const pageData = data.slice(start, end);
        const tbody = pageData.map((row, i) => {
            const cells = columns.map(c => {
                let val = c.format ? c.format(row[c.key]) : row[c.key];
                if (c.label === "Actions") {
                    val = `
                    <div class="action-wrap">
                        <button class="action-btn" aria-expanded="false" aria-label="Actions">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                class="lucide lucide-ellipsis">
                                <circle cx="12" cy="12" r="1"></circle>
                                <circle cx="19" cy="12" r="1"></circle>
                                <circle cx="5" cy="12" r="1"></circle>
                            </svg>
                        </button>
                        <div class="action-dropdown" role="menu">
                            <button class="action-item" data-action="detail" type="button">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                View
                            </button>
                            <button class="action-item" data-action="edit" type="button">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                                Edit
                            </button>
                            <button class="action-item" data-action="approve" type="button">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"></path></svg>
                                Approve
                            </button>
                            <button class="action-item text-danger" data-action="delete" type="button">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path></svg>
                                Delete
                            </button>
                            
                        </div>
                    </div>`;
                }
                // add a column-specific class so we can style alignments
                return `<td class="col-${c.key}">${val ?? ""}</td>`;
            }).join('');
            return `<tr>${cells}</tr>`;
        }).join('');

        el.innerHTML = `
            <div class="table-wrapper">
                <table class="data-table pb-2">
                    <thead><tr>${thead}</tr></thead>
                    <tbody>${tbody}</tbody>
                </table>
            </div>
            <div class="table-footer">
                <div class="table-pager">
                    <div class="paginator" role="navigation" aria-label="Pagination">
                        <button class="pager-btn pager-first" ${state.page===1? 'disabled':''} title="First">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 18L13 12l6-6"></path><path d="M11 18L5 12l6-6"></path></svg>
                        </button>
                        <button class="pager-btn pager-prev" ${state.page===1? 'disabled':''} title="Previous">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"></path></svg>
                        </button>
                        <div class="pager-pages">
                            ${(() => {
                                const pages = [];
                                const windowSize = 5;
                                let startPage = Math.max(1, state.page - Math.floor(windowSize/2));
                                let endPage = Math.min(totalPages, startPage + windowSize - 1);
                                if (endPage - startPage + 1 < windowSize) startPage = Math.max(1, endPage - windowSize + 1);
                                for (let p = startPage; p <= endPage; p++) {
                                    pages.push(`<button class="pager-btn pager-page ${state.page===p? 'current':''}" data-page="${p}" aria-label="Page ${p}">${p}</button>`);
                                }
                                return pages.join('');
                            })()}
                        </div>
                        <button class="pager-btn pager-next" ${state.page===totalPages? 'disabled':''} title="Next">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"></path></svg>
                        </button>
                        <button class="pager-btn pager-last" ${state.page===totalPages? 'disabled':''} title="Last">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 18l6-6-6-6"></path><path d="M13 18l6-6-6-6"></path></svg>
                        </button>
                    </div>
                    <div class="pager-controls">
                        Pages
                        <select class="page-size-select" aria-label="Rows per page">
                            ${[5,10,25,50].map(s => `<option value="${s}" ${state.pageSize===s? 'selected':''}>${s}</option>`).join('')}
                        </select>
                    </div>
                </div>
            </div>
        `;

        // Enable drag-to-scroll for table
        const wrapper = el.querySelector('.table-wrapper');
        if (wrapper) {
            let isDown = false;
            let startX = 0;
            let scrollLeft = 0;

            wrapper.addEventListener('mousedown', (e) => {
                // Only drag if clicking on the table area, not on interactive elements
                if (e.target.closest('button, input, select')) return;
                isDown = true;
                wrapper.classList.add('dragging');
                startX = e.pageX - wrapper.getBoundingClientRect().left;
                scrollLeft = wrapper.scrollLeft;
            });

            wrapper.addEventListener('mouseleave', () => {
                isDown = false;
                wrapper.classList.remove('dragging');
            });

            wrapper.addEventListener('mouseup', () => {
                isDown = false;
                wrapper.classList.remove('dragging');
            });

            wrapper.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - wrapper.getBoundingClientRect().left;
                const walk = (x - startX) * 1.2;
                wrapper.scrollLeft = scrollLeft - walk;
            });
        }

        // Attach dropdown behavior for action buttons.
        // Ensure we don't add duplicate global listeners when re-rendering.
        const addGlobalListeners = !window._pofDropdownListenersAdded;

        // Toggle per-row dropdowns and handle actions
        el.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const dropdown = btn.nextElementSibling;
                const opened = dropdown.classList.toggle('show');
                btn.setAttribute('aria-expanded', opened ? 'true' : 'false');
                // close other dropdowns
                el.querySelectorAll('.action-dropdown.show').forEach(dd => {
                    if (dd !== dropdown) {
                        dd.classList.remove('show');
                        const siblingBtn = dd.previousElementSibling;
                        if (siblingBtn && siblingBtn.classList.contains('action-btn')) {
                            siblingBtn.setAttribute('aria-expanded', 'false');
                        }
                    }
                });
            });
        });

        // Handle clicking on action items
        el.querySelectorAll('.action-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = item.getAttribute('data-action');
                const row = item.closest('tr');
                if (!row) return;
                const rowIndex = Array.from(row.parentElement.children).indexOf(row);
                
                // Show confirmation dialog for delete action
                if (action === 'delete') {
                    showDeleteConfirmation(() => {
                        console.log('PCV action', action, 'on row', rowIndex);
                    });
                } else {
                    // Note to Cindy: tambahin action lainnya di sini ya cin
                    console.log('PCV action', action, 'on row', rowIndex);
                }
                
                // close dropdown after action
                const dd = item.closest('.action-dropdown');
                if (dd) dd.classList.remove('show');
                const btn = dd.previousElementSibling;
                if (btn && btn.classList.contains('action-btn')) btn.setAttribute('aria-expanded', 'false');
            });
        });

        if (addGlobalListeners) {
            // Close dropdowns when clicking outside
            document.addEventListener('click', () => {
                document.querySelectorAll('.action-dropdown.show').forEach(dd => dd.classList.remove('show'));
                document.querySelectorAll('.action-btn[aria-expanded="true"]').forEach(b => b.setAttribute('aria-expanded', 'false'));
            });

            // Close on Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    document.querySelectorAll('.action-dropdown.show').forEach(dd => dd.classList.remove('show'));
                    document.querySelectorAll('.action-btn[aria-expanded="true"]').forEach(b => b.setAttribute('aria-expanded', 'false'));
                }
            });
            window._pofDropdownListenersAdded = true;
        }
    }

    return { init };
})();

// Global delete confirmation modal function (shared with pof.js)
function showDeleteConfirmation(onConfirm) {
    let modal = document.getElementById('delete-confirm-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'delete-confirm-modal';
        modal.className = 'delete-modal-overlay';
        modal.innerHTML = `
            <div class="delete-modal">
                <div class="delete-modal-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                        <path d="M10 11v6"></path>
                        <path d="M14 11v6"></path>
                    </svg>
                </div>
                <div class="delete-modal-title">Delete Record?</div>
                <div class="delete-modal-message">Are you sure you want to delete this record? This action cannot be undone.</div>
                <div class="delete-modal-actions">
                    <button class="btn-cancel" type="button">Cancel</button>
                    <button class="btn-delete" type="button">Delete</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    modal.classList.add('show');
    const cancelBtn = modal.querySelector('.btn-cancel');
    const deleteBtn = modal.querySelector('.btn-delete');
    
    const closeModal = () => modal.classList.remove('show');
    
    cancelBtn.onclick = closeModal;
    deleteBtn.onclick = () => {
        closeModal();
        onConfirm();
    };
    modal.onclick = (e) => {
        if (e.target === modal) closeModal();
    };
}
