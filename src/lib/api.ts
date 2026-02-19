import axios from "axios";
import { auth } from "@/lib/auth";
import { unauthorized } from "next/navigation";

const api = axios.create({
    baseURL: process.env.BACKEND_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(async (config) => {
    const session = await auth();

    console.log("TOKEN", session?.backendToken);

    if (session?.backendToken) {
        config.headers.Authorization = `Bearer ${session.backendToken}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        console.log("ERROR", error);

        if (error.response.status in [401, 403, 500]) {
            unauthorized();
        }

        return Promise.reject(error);
    },
);

export { api };
