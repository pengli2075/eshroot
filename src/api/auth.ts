import { httpPost } from './request';

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

export function loginByPassword(payload: LoginPayload) {
    return httpPost<LoginResult, LoginPayload>('/ajaxLogin', payload);
}

export function getCurrentUserInfo() {
    return httpPost<CurrentUser, Record<string, never>>('/getGlobalInfoByUserLogin', {});
}

export function logoutCurrentUser() {
    return httpPost<unknown, Record<string, never>>('/ajaxLogout', {});
}
