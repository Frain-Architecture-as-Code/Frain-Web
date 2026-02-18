import axios from "axios";
import { auth } from "@/lib/auth";

const api = axios.create({
    baseURL: process.env.BACKEND_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(async (config) => {
    const session = await auth();

    console.log("TOKEN", session?.backendToken);
    console.log("PROFILE URL", session?.picture);

    if (session?.backendToken) {
        config.headers.Authorization = `Bearer ${session.backendToken}`;
    }

    return config;
});

export { api };
