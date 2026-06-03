export default {
    common: {
        appName: 'ESH Root Learning App',
        switchLanguage: 'Language',
        chinese: 'Simplified Chinese',
        traditionalChinese: 'Traditional Chinese',
        english: 'English',
        logout: 'Logout',
        submit: 'Submit',
        cancel: 'Cancel',
    },
    login: {
        title: 'Welcome back',
        subtitle: 'Start with a login page to learn Vue 3, TypeScript, forms, and global i18n.',
        accountLabel: 'Account',
        accountPlaceholder: 'Enter your account',
        passwordLabel: 'Password',
        passwordPlaceholder: 'Enter your password',
        rememberMe: 'Remember login state',
        loginButton: 'Sign in',
        helperTitle: 'Demo account',
        helperText:
            'This project uses local mock authentication so you can focus on UI and state flow first.',
        demoAccount: 'Account: admin',
        demoPassword: 'Password: 123456',
        requiredAccount: 'Please enter your account',
        requiredPassword: 'Please enter your password',
        invalidCredentials: 'Invalid credentials. Use the demo account to continue learning.',
        success: 'Login succeeded. Welcome to the app.',
    },
    dashboard: {
        title: 'Learning Dashboard',
        welcome: 'You have finished the first step: a login page with global i18n.',
        summaryTitle: 'Good next modules to practice',
        cards: {
            router: {
                title: 'Routing',
                description: 'Continue with route guards, menu routes, and page splitting.',
            },
            pinia: {
                title: 'State Management',
                description: 'Move user info, menu state, and theme switch into Pinia.',
            },
            request: {
                title: 'API Layer',
                description: 'Add axios and start calling login, list, and detail APIs.',
            },
        },
    },
};
