import { httpPost } from './request';
import type { AppLocale } from '@/locales';

export type SetSessionLocalePayload = {
    newLocale: AppLocale;
};

export function setSessionLocale(payload: SetSessionLocalePayload) {
    return httpPost<unknown, SetSessionLocalePayload>('/ajaxSetSessionLocale', payload);
}
