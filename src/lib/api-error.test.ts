import { describe, expect, it } from "vitest";
import { ApiError, type BackendErrorResponse } from "@/lib/api-error";

describe("ApiError", () => {
    const mockResponse: BackendErrorResponse = {
        code: "NOT_FOUND",
        message: "Organization not found",
        details: { organizationId: "abc-123" },
        timestamp: "2024-01-15T12:00:00Z",
    };

    it("creates an ApiError with all fields from BackendErrorResponse", () => {
        const error = new ApiError(mockResponse, 404);

        expect(error.message).toBe("Organization not found");
        expect(error.code).toBe("NOT_FOUND");
        expect(error.details).toEqual({ organizationId: "abc-123" });
        expect(error.timestamp).toBe("2024-01-15T12:00:00Z");
        expect(error.status).toBe(404);
    });

    it("sets name to 'ApiError'", () => {
        const error = new ApiError(mockResponse, 404);
        expect(error.name).toBe("ApiError");
    });

    it("is an instance of Error", () => {
        const error = new ApiError(mockResponse, 404);
        expect(error).toBeInstanceOf(Error);
    });

    it("is an instance of ApiError", () => {
        const error = new ApiError(mockResponse, 500);
        expect(error).toBeInstanceOf(ApiError);
    });

    it("handles null details", () => {
        const response: BackendErrorResponse = {
            code: "INTERNAL_ERROR",
            message: "Something went wrong",
            details: null,
            timestamp: "2024-01-15T12:00:00Z",
        };
        const error = new ApiError(response, 500);
        expect(error.details).toBeNull();
    });

    it("handles status 0 for network errors", () => {
        const response: BackendErrorResponse = {
            code: "NETWORK_ERROR",
            message: "A network error occurred. Please check your connection.",
            details: null,
            timestamp: "2024-01-15T12:00:00Z",
        };
        const error = new ApiError(response, 0);
        expect(error.status).toBe(0);
        expect(error.code).toBe("NETWORK_ERROR");
    });

    it("preserves stack trace", () => {
        const error = new ApiError(mockResponse, 404);
        expect(error.stack).toBeDefined();
        expect(error.stack).toContain("ApiError");
    });

    it("works with try/catch pattern", () => {
        try {
            throw new ApiError(mockResponse, 400);
        } catch (err) {
            expect(err).toBeInstanceOf(ApiError);
            if (err instanceof ApiError) {
                expect(err.status).toBe(400);
                expect(err.message).toBe("Organization not found");
            }
        }
    });
});
