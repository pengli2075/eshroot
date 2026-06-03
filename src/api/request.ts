import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import type { ApiResponse, RequestErrorPayload } from './types';

type FormPostValue = string | number | boolean | null | undefined;
type CommonResponsePayload = {
    LOGIN_REDIRECT?: string;
    CommonSessionTimeoutPleaseLogIn?: string;
    _ERROR_MESSAGE_?: string;
    _ERROR_MESSAGE_LIST_?: string | string[];
    _EVENT_MESSAGE_?: string;
    _EVENT_MESSAGE_LIST_?: string | string[];
};

type SessionExpiredHandler = () => void;

let sessionExpiredHandler: SessionExpiredHandler | undefined;

export function registerSessionExpiredHandler(handler: SessionExpiredHandler) {
    sessionExpiredHandler = handler;
}

function resolveErrorMessage(error: AxiosError<RequestErrorPayload>) {
    return (
        error.response?.data?.message ||
        error.message ||
        'The request failed. Please try again later.'
    );
}

const requestClient = axios.create({
    baseURL: '/api/control',
    timeout: 15000,
    // 由服务端通过 Cookie 维护 session，跨域开发代理时也需要允许携带凭证。
    withCredentials: true,
});

requestClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError<RequestErrorPayload>) => {
        return Promise.reject(
            new Error(
                resolveErrorMessage(error) ||
                    `Request failed with status ${error.response?.status}`,
            ),
        );
    },
);

function unwrapResponse<T>(response: AxiosResponse<ApiResponse<T> | T>) {
    const body = response.data;

    if (body && typeof body === 'object') {
        const commonBody = body as CommonResponsePayload;
        const errorMessage =
            commonBody._ERROR_MESSAGE_ ||
            (Array.isArray(commonBody._ERROR_MESSAGE_LIST_)
                ? commonBody._ERROR_MESSAGE_LIST_.join('\n')
                : commonBody._ERROR_MESSAGE_LIST_);

        if (commonBody.LOGIN_REDIRECT === 'error' || errorMessage) {
            if (commonBody.LOGIN_REDIRECT === 'error') {
                sessionExpiredHandler?.();
            }

            throw Object.assign(new Error(errorMessage || 'Request failed.'), commonBody);
        }
    }

    if (body && typeof body === 'object' && 'data' in body) {
        const apiBody = body as ApiResponse<T>;
        const isFailure =
            apiBody.success === false ||
            apiBody.code === 'error' ||
            apiBody.code === 'ERROR' ||
            apiBody.code === 500;

        if (isFailure) {
            throw new Error(apiBody.message || apiBody.msg || 'Request failed.');
        }

        return apiBody.data;
    }

    return body as T;
}

function isPlainObject(data: unknown): data is Record<string, FormPostValue | FormPostValue[]> {
    return Object.prototype.toString.call(data) === '[object Object]';
}

function toFormUrlEncoded(data: unknown) {
    if (!isPlainObject(data)) {
        return data;
    }

    const formData = new URLSearchParams();

    Object.entries(data).forEach(([key, value]) => {
        const values = Array.isArray(value) ? value : [value];

        values.forEach((item) => {
            if (item !== undefined && item !== null) {
                formData.append(key, String(item));
            }
        });
    });

    return formData;
}

export function httpGet<T>(url: string, config?: AxiosRequestConfig) {
    return requestClient.get<ApiResponse<T> | T>(url, config).then(unwrapResponse<T>);
}

export function httpPost<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>) {
    return requestClient
        .post<ApiResponse<T> | T>(url, toFormUrlEncoded(data), {
            ...config,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                ...config?.headers,
            },
        })
        .then(unwrapResponse<T>);
}

export { requestClient };
