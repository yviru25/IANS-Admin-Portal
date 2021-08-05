import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 2,
        label: 'Dashboard',
        icon: 'ri-dashboard-line',
        link: '/'
    },
    {
        id: 14,
        label: 'Master Data',
        icon: 'ri-database-fill',
        subItems: [
            {
                id: 15,
                label: 'Country Management',
                link: '/master-data/country/management',
                parentId: 14
            },
            {
                id: 16,
                label: 'State Management',
                link: '/master-data/state/management',
                parentId: 14
            },
            {
                id: 17,
                label: 'City Management',
                link: '/master-data/city/management',
                parentId: 14
            },
            {
                id: 18,
                label: 'Service Management',
                link: '/email/read',
                parentId: 14
            },
            {
                id: 19,
                label: 'Customer Management',
                link: '/email/read',
                parentId: 14
            }
        ]
    },
    {
        id: 3,
        label: 'Invoice Management',
        icon: 'ri-price-tag-2-line',
        link: '/calendar'
    },
    {
        id: 5,
        label: 'Report',
        icon: 'ri-store-2-line',
        subItems: [
            {
                id: 6,
                label: 'Report 1',
                link: '/ecommerce/products',
                parentId: 5
            },
            {
                id: 8,
                label: 'Report 2',
                link: '/ecommerce/orders',
                parentId: 5
            },
            {
                id: 9,
                label: 'Report 3',
                link: '/ecommerce/customers',
                parentId: 5
            },
            {
                id: 10,
                label: 'Report 4',
                link: '/ecommerce/cart',
                parentId: 5
            }
        ]
    },
    {
        id: 4,
        label: 'Notification',
        icon: 'ri-notification-3-line',
        link: '/chat'
    },
    {
        id: 15,
        label: 'Expired Customer',
        icon: 'ri-file-list-3-line',
        link: '/kanban-board'
    }
];
