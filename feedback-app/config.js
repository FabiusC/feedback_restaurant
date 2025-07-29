// Configuration file for the Feedback Restaurant App
export const config = {
    // API Configuration
    api: {
        baseUrl: 'http://localhost:3000/api',
        endpoints: {
            reviews: {
                submit: '/reviews',
                public: '/reviews/public'
            },
            employees: {
                all: '/employees',
                byId: (id) => `/employees/${id}`,
                stats: (id) => `/employees/${id}/stats`
            }
        }
    },

    // App Configuration
    app: {
        name: 'Feedback Restaurant',
        version: '1.0.0',
        autoRefreshInterval: 30000 // 30 seconds
    }
}; 