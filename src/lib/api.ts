import axios from "axios";
import { redirect } from "next/navigation";
import { ApiError, type BackendErrorResponse } from "@/lib/api-error";
import { auth } from "@/lib/auth";

const api = axios.create({
    baseURL: process.env.BACKEND_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(async (config) => {
    const session = await auth();

    if (session?.backendToken) {
        config.headers.Authorization = `Bearer ${session.backendToken}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (!error.response) {
            return Promise.reject(
                new ApiError(
                    {
                        code: "NETWORK_ERROR",
                        message:
                            "A network error occurred. Please check your connection.",
                        details: null,
                        timestamp: new Date().toISOString(),
                    },
                    0,
                ),
            );
        }

        const status = error.response.status;

        if (status === 401) {
            redirect("/errors/401");
        }

        const data = error.response.data as BackendErrorResponse;

        return Promise.reject(new ApiError(data, status));
    },
);

export { api };
