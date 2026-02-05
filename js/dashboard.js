const DashboardManager = (() => {
    function init() {
        renderProgressBar();
        renderCards();
        renderTable('projects-table', MOCK_DATA.projects, projectColumns());
        renderTable('invoices-table', MOCK_DATA.invoices, invoiceColumns());
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
        const remaining = Math.max(0, target - achieved);
        const invPct = (invoice / total * 100).toFixed(1);
        const revPct = (revenue / total * 100).toFixed(1);
        const remainPct = Math.max(0, 100 - parseFloat(invPct) - parseFloat(revPct)).toFixed(1);
        const achievedPct = Math.min(100, parseFloat(invPct) + parseFloat(revPct)).toFixed(1);

        if (summaryEl) {
            summaryEl.innerHTML = `
                <span class="summary-text"><strong>${formatRp(achieved)}</strong> dari ${formatRp(target)}</span>
                <span class="summary-pct">${achievedPct}%</span>
            `;
        }

        barEl.innerHTML = `
            <div class="segment" style="width:${invPct}%;background:linear-gradient(135deg,#3B82F6,#2563EB)">
                ${parseFloat(invPct) > 8 ? formatRp(invoice) : ''}
                <span class="segment-tooltip">Invoice: ${formatRp(invoice)} (${invPct}%)</span>
            </div>
            <div class="segment" style="width:${revPct}%;background:linear-gradient(135deg,#22C55E,#16A34A)">
                ${parseFloat(revPct) > 8 ? formatRp(revenue) : ''}
                <span class="segment-tooltip">Revenue: ${formatRp(revenue)} (${revPct}%)</span>
            </div>
            <div class="segment" style="width:${remainPct}%;background:linear-gradient(135deg,#94A3B8,#64748B)">
                ${parseFloat(remainPct) > 8 ? formatRp(remaining) : ''}
                <span class="segment-tooltip">Target: ${formatRp(target)}</span>
            </div>
        `;

        if (legendEl) {
            legendEl.innerHTML = `
                <div class="legend-item">
                    <span class="dot" style="background:#3B82F6"></span>
                    <span class="legend-label">Invoice</span>
                    <span class="legend-value">${formatRp(invoice)} (${invPct}%)</span>
                </div>
                <div class="legend-item">
                    <span class="dot" style="background:#22C55E"></span>
                    <span class="legend-label">Revenue</span>
                    <span class="legend-value">${formatRp(revenue)} (${revPct}%)</span>
                </div>
                <div class="legend-item">
                    <span class="dot" style="background:#94A3B8"></span>
                    <span class="legend-label">Target</span>
                    <span class="legend-value">${formatRp(target)}</span>
                </div>
            `;
        }
    }

    function renderCards() {
        const el = document.getElementById('summary-cards');
        if (!el) return;

        const cardMeta = [
            {
                iconClass: 'icon-blue',
                icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>'
            },
            {
                iconClass: 'icon-green',
                icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>'
            },
            {
                iconClass: 'icon-purple',
                icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>'
            }
        ];

        el.innerHTML = MOCK_DATA.cards.map((card, i) => `
            <div class="card summary-card">
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

    function renderTable(id, data, columns) {
        const el = document.getElementById(id);
        if (!el) return;

        const thead = columns.map(c => `<th>${c.label}</th>`).join('');
        const tbody = data.map((row, i) => {
            const cells = columns.map(c => {
                const val = c.format ? c.format(row[c.key]) : row[c.key];
                return `<td>${val}</td>`;
            }).join('');
            return `<tr>${cells}</tr>`;
        }).join('');

        el.innerHTML = `
            <table>
                <thead><tr>${thead}</tr></thead>
                <tbody>${tbody}</tbody>
            </table>
            <div class="table-footer">
                <span>1-${data.length} dari ${data.length}</span>
            </div>
        `;
    }

    return { init };
})();
