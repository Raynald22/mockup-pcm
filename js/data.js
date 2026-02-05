const MOCK_DATA = {
    progress: {
        target: 5000000000,
        revenue: 2200000000,
        invoice: 1800000000
    },

    cards: [
        { label: 'Target', value: 5000000000 },
        { label: 'Current Rev', value: 2200000 },
        { label: 'Invoice', value: 1800000000 }
    ],

    projects: [
        { name: 'PPON 2025 PN Makassar', budget: 800000000, spent: 150000000, remaining: 650000000 },
        { name: 'PPON 2025 PN Jakarta Utara', budget: 1200000000, spent: 0, remaining: 1200000000 },
        { name: 'PPON 2025 PN Bekasi', budget: 950000000, spent: 0, remaining: 950000000 },
        { name: 'PPON 2025 PN Surabaya', budget: 750000000, spent: 200000000, remaining: 550000000 },
        { name: 'PPON 2025 PN Bandung', budget: 600000000, spent: 100000000, remaining: 500000000 }
    ],

    invoices: [
        { number: 'INV-2025-001', amount: 150000000, date: '2025-01-15', status: 'paid' },
        { number: 'INV-2025-002', amount: 200000000, date: '2025-01-20', status: 'paid' },
        { number: 'INV-2025-003', amount: 350000000, date: '2025-02-01', status: 'pending' },
        { number: 'INV-2025-004', amount: 100000000, date: '2025-02-05', status: 'pending' },
        { number: 'INV-2025-005', amount: 450000000, date: '2025-02-10', status: 'overdue' }
    ]
};
