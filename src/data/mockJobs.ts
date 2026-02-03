export interface Job {
    id: string;
    title: string;
    company: string;
    salary: string;
    type: 'Full-time' | 'Part-time' | 'Contract';
    location: string;
    requirements: {
        minScore?: number;
        minConsistency?: number; // 0-100
        minEndurance?: number; // hours per shift
        requiresBike?: boolean;
    };
    tags: string[];
    matchReason?: string;
}

export const MOCK_JOBS: Job[] = [
    {
        id: '1',
        title: 'Quick Commerce Runner',
        company: 'Zepto',
        salary: '₹25,000 - ₹30,000 / mo',
        type: 'Full-time',
        location: 'Indiranagar, Bangalore',
        requirements: {
            minScore: 650,
            minConsistency: 80,
            requiresBike: true
        },
        tags: ['Urgent', 'Bike Required', 'High Incentives']
    },
    {
        id: '2',
        title: 'Warehouse Associate',
        company: 'Amazon',
        salary: '₹18,000 - ₹22,000 / mo',
        type: 'Full-time',
        location: 'Whitefield, Bangalore',
        requirements: {
            minScore: 600,
            minEndurance: 8
        },
        tags: ['Stable Shift', 'Insurance', 'Transport']
    },
    {
        id: '3',
        title: 'Security Guard',
        company: 'SIS Security',
        salary: '₹15,000 - ₹18,000 / mo',
        type: 'Full-time',
        location: 'Koramangala, Bangalore',
        requirements: {
            minScore: 550,
            minConsistency: 90
        },
        tags: ['Night Shift', 'Accommodation']
    },
    {
        id: '4',
        title: 'Fleet Manager (Junior)',
        company: 'Uber',
        salary: '₹35,000 - ₹45,000 / mo',
        type: 'Full-time',
        location: 'HSR Layout, Bangalore',
        requirements: {
            minScore: 750,
            minConsistency: 95,
            minEndurance: 10
        },
        tags: ['Career Growth', 'Office Job', 'Laptop Provided']
    }
];
