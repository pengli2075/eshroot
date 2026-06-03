export type ApiResponse<T> = {
    code?: number | string;
    success?: boolean;
    message?: string;
    msg?: string;
    data: T;
};

export type RequestErrorPayload = {
    status?: number;
    message: string;
};
