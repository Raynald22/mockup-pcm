const PofManager = (() => {
    function init() {
        renderTable('pof-table', MOCK_DATA.pofs, pofColumns());

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

        // Handle "+ Add POF" button
        const addBtn = document.querySelector('.add-pof-btn');
        if (addBtn) {
            addBtn.onclick = () => {
                DrawerManager.open({
                    title: 'Input POF (Payment Order Form)',
                    subtitle: 'Isi form untuk membuat petty cash voucher baru.',
                    contentHtml: `
                        <form id="pcv-form">
                            <!-- POF Information Section -->
                            <div class="form-section">
                                <div class="form-group">
                                    <label for="no_pof">No. POF</label>
                                    <input type="text" id="no_pof" class="form-control" placeholder="Input POF number">
                                </div>

                                <div class="form-group">
                                    <label for="pof_date">POF Date*</label>
                                    <input type="date" id="pof_date" class="form-control" required>
                                </div>

                                <div class="form-group">
                                    <label for="company_name">Company Name</label>
                                    <input type="text" id="company_name" class="form-control" placeholder="Input company name">
                                </div>

                                <div class="form-group">
                                    <label for="departement">Departement</label>
                                    <input type="text" id="departement" class="form-control" placeholder="Input department">
                                </div>

                                <div class="form-group">
                                    <label for="employee_id">Employee ID*</label>
                                    <input type="text" id="employee_id" class="form-control" value="12712" required>
                                </div>

                                <div class="form-group">
                                    <label for="project">Project*</label>
                                    <div class="input-with-icon">
                                        <input type="text" id="project" class="form-control" placeholder="Select project" required>
                                        <button type="button" class="input-icon-btn"
                                            onclick="LookupManager.open('Lookup Project', 'pages/lookup-project.html', (data) => { document.getElementById('project').value = data.number })">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                                stroke-linecap="round" stroke-linejoin="round">
                                                <circle cx="11" cy="11" r="8"></circle>
                                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="approved_to">Approved To</label>
                                    <select id="approved_to" class="form-control">
                                        <option value="">Select approver</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Paid To Section -->
                            <div class="form-section" style="padding-top: 20px;">
                                <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 20px; color: var(--drawer-text-main);">Paid To
                                </h3>

                                <div class="form-group">
                                    <label for="bank">Bank</label>
                                    <select id="bank" class="form-control">
                                        <option value="">Select Bank</option>
                                        <option value="BRI">BRI - PT. BANK RAKYAT INDONESIA (PERSERO), Tbk</option>
                                        <option value="Mandiri">Mandiri - PT. BANK MANDIRI (PERSERO), Tbk</option>
                                        <option value="BNI">BNI - PT. BANK NEGARA INDONESIA (PERSERO), Tbk</option>
                                        <option value="BTN">BTN - PT. BANK TABUNGAN NEGARA (PERSERO), Tbk</option>
                                        <option value="Danamon">Danamon - PT. BANK DANAMON INDONESIA, Tbk</option>
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label for="account_number">Account Number</label>
                                    <input type="text" id="account_number" class="form-control" placeholder="Input account number">
                                </div>

                                <div class="form-group">
                                    <label for="account_name">Account Name</label>
                                    <input type="text" id="account_name" class="form-control" placeholder="Input account name">
                                </div>

                                <div class="form-group">
                                    <label for="amount">Amount to be Paid</label>
                                    <input type="number" id="amount" class="form-control" placeholder="Input amount">
                                </div>

                                <div class="form-group">
                                    <label for="due_date">Due Date</label>
                                    <input type="date" id="due_date" class="form-control">
                                </div>

                                <div class="form-group">
                                    <label for="description">Description</label>
                                    <textarea id="description" class="form-control" rows="3" placeholder="Input description"></textarea>
                                </div>

                                <!-- POF Details Section -->
                                <div class="details-section">
                                    <div class="details-section-label">POF Details</div>
                                    <div class="details-header">
                                        <button type="button" class="btn-add-detail" id="btn-add-account-code">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                            </svg>
                                            Account Code
                                        </button>
                                    </div>
                                    <div class="details-table-container">
                                        <table class="details-table">
                                            <thead>
                                                <tr>
                                                    <th>No</th>
                                                    <th>Account Code</th>
                                                    <th>Description</th>
                                                    <th>Amount</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody id="pof-details-body">
                                                <tr class="empty-row">
                                                    <td colspan="5">Data Kosong</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </form>
                    `,
                    onSave: () => {
                        console.log('Saving POF data...');
                        DrawerManager.close();
                    }
                });

                // Attach logic for POF Details after drawer opens
                const detailsBody = document.getElementById('pof-details-body');
                const addAccountBtn = document.getElementById('btn-add-account-code');
                let detailsData = [{
                    code: 'A013 - Hardware',
                    desc: 'CPU',
                    amount: 350000
                }];

                const renderDetails = () => {
                    if (detailsData.length === 0) {
                        detailsBody.innerHTML = `
                            <tr class="empty-row">
                                <td colspan="5">Data Kosong</td>
                            </tr>
                        `;
                        return;
                    }

                    detailsBody.innerHTML = detailsData.map((item, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${item.code}</td>
                            <td>${item.desc}</td>
                            <td>Rp.${item.amount.toLocaleString('id-ID')}.00</td>
                            <td>
                                <button type="button" class="btn-action-view" title="View">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    `).join('');
                };

                if (addAccountBtn) {
                    addAccountBtn.onclick = () => {
                        LookupManager.open('Input Account POF', 'pages/input-account-pof.html');
                    };
                }

                // Render initial dummy data
                renderDetails();

                // Global function for the modal to call
                PofManager.addAccountFromModal = () => {
                    const code = document.getElementById('acc_code').value;
                    const desc = document.getElementById('acc_desc').value;
                    const amountStr = document.getElementById('acc_amount').value;
                    const amount = parseInt(amountStr.replace(/[^0-9]/g, '')) || 0;

                    if (code && desc) {
                        detailsData.push({ code, desc, amount });
                        renderDetails();
                        LookupManager.close();
                    }
                };
            };
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

    function formatPaymentStatus(val) {
        if (val === 'DRAFT') return 'DRAFT';
        if (val === 'APPROVE_FIN') return 'APPROVED FINANCE';
        if (val === 'APPROVE_MGT') return 'APPROVED MANAGER';
        return String(val ?? '');
    }

    function pofColumns() {
        return [
            { key: 'companyName', label: 'Company' },
            { key: 'costNumber', label: 'POF Number' },
            { key: 'dueDate', label: 'Due Date', format: formatDate },
            { key: 'projectNumber', label: 'Project Number' },
            { key: 'projectName', label: 'Project Name' },
            { key: 'amount', label: 'Amount', format: formatRp  },
            { key: 'statusDescription', label: 'Status', format: formatPaymentStatus },
            { key: 'paymentStatusDesc', label: 'Status Payment'},
            { key: 'documentStatus', label: 'Document', format: formatDocumentStatus },
            { key: 'action', label: 'Actions' },
        ];
    }

    function renderTable(id, data, columns) {
        const el = document.getElementById(id);
        if (!el) return;

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
                        <button class="pager-btn pager-first" ${state.page === 1 ? 'disabled' : ''} title="First">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 18L13 12l6-6"></path><path d="M11 18L5 12l6-6"></path></svg>
                        </button>
                        <button class="pager-btn pager-prev" ${state.page === 1 ? 'disabled' : ''} title="Previous">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"></path></svg>
                        </button>
                        <div class="pager-pages">
                            ${(() => {
                const pages = [];
                const windowSize = 5;
                let startPage = Math.max(1, state.page - Math.floor(windowSize / 2));
                let endPage = Math.min(totalPages, startPage + windowSize - 1);
                if (endPage - startPage + 1 < windowSize) startPage = Math.max(1, endPage - windowSize + 1);
                for (let p = startPage; p <= endPage; p++) {
                    pages.push(`<button class="pager-btn pager-page ${state.page === p ? 'current' : ''}" data-page="${p}" aria-label="Page ${p}">${p}</button>`);
                }
                return pages.join('');
            })()}
                        </div>
                        <button class="pager-btn pager-next" ${state.page === totalPages ? 'disabled' : ''} title="Next">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"></path></svg>
                        </button>
                        <button class="pager-btn pager-last" ${state.page === totalPages ? 'disabled' : ''} title="Last">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 18l6-6-6-6"></path><path d="M13 18l6-6-6-6"></path></svg>
                        </button>
                    </div>
                    <div class="pager-controls">
                        Lines per page
                        <select class="page-size-select" aria-label="Rows per page">
                            ${[5, 10, 25, 100].map(s => `<option value="${s}" ${state.pageSize === s ? 'selected' : ''}>${s}</option>`).join('')}
                        </select>
                    </div>
                </div>
            </div>
        `;

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
                // emit or handle actions here - for now just log
                console.log('POF action', action, 'on row', rowIndex);
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