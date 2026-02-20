import axios from "axios";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

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
        const status = error.response.status;

        console.log(error.response);

        if (status === 401) {
            redirect("/errors/401");
        }

        return Promise.reject(error);
    },
);

export { api };
