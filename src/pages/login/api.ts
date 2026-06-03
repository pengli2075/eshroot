import { httpGet, httpPost } from '@/api/request';
import type { AppLocale } from '@/locales';

export type LoginPageInfo = {
    systemName: string;
    demoAccount: string;
    demoPassword: string;
    locale?: AppLocale;
    loginLogo?: string;
    loginBackground?: string;
    copyrightText?: string;
    companyName?: string;
    companyUrl?: string;
    singleSignOnType?: string;
    clientId?: string;
};

export type LoginPageInfoResponse = Partial<LoginPageInfo> & {
    ehsManagementToolSuite?: string;
    serverDomainNameCustomResMap?: Partial<{
        SDOMNCRT_MFE_LOGIN_LOGO: string;
        SDOMNCRT_MFE_LOGO: string;
        SDOMNCRT_MFE_BGIMG: string;
    }>;
};

export type LoginPayload = {
    USERNAME: string;
    PASSWORD: string;
    JavaScriptEnabled: 'Y';
    authCode?: string;
    secondAuthType?: string;
};

export type LoginResult = {
    LOGIN_REDIRECT?: 'requirePasswordChange' | 'userLoginSecondAuth' | string;
    secondAuthType?: 'SMS' | 'VMFA' | string;
    _EVENT_MESSAGE_?: string;
    userLoginId?: string;
};

export type CurrentUser = {
    userLoginId?: string;
    userName?: string;
    userCompanyName?: string;
    userCompany?: string;
    locale?: string;
    securityPermissionMap?: Record<string, boolean | string>;
    [key: string]: unknown;
};

export function getLoginPageInfo() {
    return httpGet<LoginPageInfoResponse>('/getSystemPropertyCopyrightInfo');
}

export function loginByPassword(payload: LoginPayload) {
    return httpPost<LoginResult, LoginPayload>('/ajaxLogin', payload);
}

export function getCurrentUserInfo() {
    return httpPost<CurrentUser, Record<string, never>>('/getGlobalInfoByUserLogin', {});
}
