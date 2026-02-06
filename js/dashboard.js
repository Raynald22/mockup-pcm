const DashboardManager = (() => {
    function init() {
        renderProgressBar();
        renderCards();
        renderTable('projects-table', MOCK_DATA.projects, projectColumns(), 5);
        renderTable('invoices-table', MOCK_DATA.invoices, invoiceColumns(), 5);
    }

    function formatRp(num) {
        return 'Rp ' + num.toLocaleString('id-ID');
    }

    function renderProgressBar() {
        const barEl = document.getElementById('progress-bar');
        const summaryEl = document.getElementById('progress-summary');
        const legendEl = document.getElementById('progress-legend');
        if (!barEl) return;

        const { target, revenue, invoice } = MOCK_DATA.progress;
        const total = target;
        const achieved = invoice + revenue;
        const invPct = (invoice / total * 100).toFixed(1);
        const revPct = (revenue / total * 100).toFixed(1);
        const remainPct = Math.max(0, 100 - parseFloat(invPct) - parseFloat(revPct)).toFixed(1);
        const achievedPct = Math.min(100, parseFloat(invPct) + parseFloat(revPct)).toFixed(1);

        if (summaryEl) {
            summaryEl.innerHTML = `
                <span class="summary-text">Terpenuhi <strong>${formatRp(achieved)}</strong> dari target <strong>${formatRp(target)}</strong></span>
            `;
        }

        barEl.innerHTML = `
            <div class="segment" style="width:${invPct}%;background:linear-gradient(135deg,#EAB308,#CA8A04)">
                ${parseFloat(invPct) > 10 ? formatRp(invoice) : ''}
                <span class="segment-tooltip">Invoice: ${formatRp(invoice)} (${invPct}%)</span>
            </div>
            <div class="segment" style="width:${revPct}%;background:linear-gradient(135deg,#22C55E,#16A34A)">
                ${parseFloat(revPct) > 10 ? formatRp(revenue) : ''}
                <span class="segment-tooltip">Revenue: ${formatRp(revenue)} (${revPct}%)</span>
            </div>
            <div class="segment segment-remaining" style="width:${remainPct}%">
                ${parseFloat(remainPct) > 8 ? 'Target: ' + formatRp(target) : ''}
                <span class="segment-tooltip">Target: ${formatRp(target)}</span>
            </div>
        `;

        if (legendEl) {
            legendEl.innerHTML = `
                <div class="legend-item">
                    <span class="dot" style="background:#EAB308"></span>
                    <span class="legend-label">Invoice</span>
                </div>
                <div class="legend-item">
                    <span class="dot" style="background:#22C55E"></span>
                    <span class="legend-label">Revenue</span>
                </div>
                <div class="legend-item">
                    <span class="dot" style="background:#94A3B8"></span>
                    <span class="legend-label">Target</span>
                </div>
            `;
        }
    }

    function renderCards() {
        const el = document.getElementById('summary-cards');
        if (!el) return;

        const cardMeta = [
            {
                iconClass: 'icon-slate',
                accentClass: 'accent-slate',
                icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>'
            },
            {
                iconClass: 'icon-green',
                accentClass: 'accent-green',
                icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>'
            },
            {
                iconClass: 'icon-yellow',
                accentClass: 'accent-yellow',
                icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>'
            }
        ];

        el.innerHTML = MOCK_DATA.cards.map((card, i) => `
            <div class="card summary-card ${cardMeta[i].accentClass}">
                <div class="card-label">
                    <span>${card.label}</span>
                    <div class="card-icon ${cardMeta[i].iconClass}">${cardMeta[i].icon}</div>
                </div>
                <div class="card-value">${formatRp(card.value)}</div>
            </div>
        `).join('');
    }

    function projectColumns() {
        return [
            { key: 'name', label: 'Project' },
            { key: 'budget', label: 'Budget', format: formatRp },
            { key: 'spent', label: 'Spent', format: formatRp },
            { key: 'remaining', label: 'Remaining', format: formatRp }
        ];
    }

    function invoiceColumns() {
        return [
            { key: 'number', label: 'Invoice #' },
            { key: 'amount', label: 'Amount', format: formatRp },
            { key: 'date', label: 'Date' },
            { key: 'status', label: 'Status', format: (v) => `<span class="status-badge ${v}"><span class="badge-dot"></span>${v.charAt(0).toUpperCase() + v.slice(1)}</span>` }
        ];
    }

    function renderTable(id, data, columns, defaultPerPage = 5) {
        const el = document.getElementById(id);
        if (!el) return;

        let page = 1;
        let pageSize = defaultPerPage;

        function render() {
            const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
            if (page > totalPages) page = totalPages;
            const displayData = data.slice((page - 1) * pageSize, page * pageSize);

            const thead = columns.map(c => `<th>${c.label}</th>`).join('');
            const tbody = data.length === 0
                ? `<tr><td colspan="${columns.length}" class="empty-state">Tidak ada data</td></tr>`
                : displayData.map(row => {
                    const cells = columns.map(c => {
                        const val = c.format ? c.format(row[c.key]) : row[c.key];
                        return `<td>${val}</td>`;
                    }).join('');
                    return `<tr>${cells}</tr>`;
                }).join('');

            const windowSize = 5;
            let startPage = Math.max(1, page - Math.floor(windowSize / 2));
            let endPage = Math.min(totalPages, startPage + windowSize - 1);
            if (endPage - startPage + 1 < windowSize) startPage = Math.max(1, endPage - windowSize + 1);
            const pageButtons = [];
            for (let p = startPage; p <= endPage; p++) {
                pageButtons.push(`<button class="pager-btn pager-page ${page === p ? 'current' : ''}" data-page="${p}" aria-label="Page ${p}">${p}</button>`);
            }

            el.innerHTML = `
                <table>
                    <thead><tr>${thead}</tr></thead>
                    <tbody>${tbody}</tbody>
                </table>
                <div class="table-footer">
                    <div class="table-pager">
                        
                        <div class="pager-controls">
                            per page
                            <select class="page-size-select" aria-label="Rows per page">
                                ${[5, 10, 25, 100].map(s => `<option value="${s}" ${pageSize === s ? 'selected' : ''}>${s}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                </div>
            `;

            el.querySelector('.page-size-select')?.addEventListener('change', (e) => {
                pageSize = parseInt(e.target.value);
                page = 1;
                render();
            });
            el.querySelectorAll('.pager-page').forEach(btn => {
                btn.addEventListener('click', () => { page = parseInt(btn.dataset.page); render(); });
            });
            el.querySelector('.pager-first')?.addEventListener('click', () => { page = 1; render(); });
            el.querySelector('.pager-prev')?.addEventListener('click', () => { if (page > 1) { page--; render(); } });
            el.querySelector('.pager-next')?.addEventListener('click', () => { if (page < totalPages) { page++; render(); } });
            el.querySelector('.pager-last')?.addEventListener('click', () => { page = totalPages; render(); });
        }

        render();
    }

    return { init };
})();
