export default {
    common: {
        appName: 'ESH Root 学习系统',
        switchLanguage: '切换语言',
        chinese: '简体中文',
        traditionalChinese: '繁體中文',
        english: '英文',
        logout: '退出登录',
        submit: '提交',
        cancel: '取消',
    },
    login: {
        title: '欢迎回来',
        subtitle: '从登录页开始学习 Vue 3、TypeScript、表单和全局国际化。',
        accountLabel: '账号',
        accountPlaceholder: '请输入账号',
        passwordLabel: '密码',
        passwordPlaceholder: '请输入密码',
        rememberMe: '记住登录状态',
        loginButton: '登录',
        helperTitle: '演示账号',
        helperText: '当前使用本地模拟登录，方便你先学习页面结构和状态流转。',
        demoAccount: '账号：admin',
        demoPassword: '密码：123456',
        requiredAccount: '请输入账号',
        requiredPassword: '请输入密码',
        invalidCredentials: '账号或密码错误，请使用演示账号继续学习。',
        success: '登录成功，欢迎进入系统。',
    },
    dashboard: {
        title: '学习控制台',
        welcome: '你已经完成了登录页和全局 i18n 的第一步。',
        summaryTitle: '接下来适合继续练习的模块',
        cards: {
            router: {
                title: '路由结构',
                description: '继续练习登录守卫、菜单路由和页面拆分。',
            },
            pinia: {
                title: '状态管理',
                description: '把用户信息、菜单状态和主题切换收进 Pinia。',
            },
            request: {
                title: '接口封装',
                description: '接入 axios，请求登录、列表和详情接口。',
            },
        },
    },
};
