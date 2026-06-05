import { httpGet, httpPost } from './request';
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

export type SetSessionLocalePayload = {
    newLocale: AppLocale;
};

export function getLoginPageInfo() {
    return httpGet<LoginPageInfoResponse>('/getSystemPropertyCopyrightInfo');
}

export function setSessionLocale(payload: SetSessionLocalePayload) {
    return httpPost<unknown, SetSessionLocalePayload>('/ajaxSetSessionLocale', payload);
}
