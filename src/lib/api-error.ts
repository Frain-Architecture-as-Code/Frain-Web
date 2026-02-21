export interface BackendErrorResponse {
    code: string;
    message: string;
    details: unknown;
    timestamp: string;
}

export class ApiError extends Error {
    readonly code: string;
    readonly details: unknown;
    readonly timestamp: string;
    readonly status: number;

    constructor(response: BackendErrorResponse, status: number) {
        super(response.message);
        this.name = "ApiError";
        this.code = response.code;
        this.details = response.details;
        this.timestamp = response.timestamp;
        this.status = status;
    }
}
