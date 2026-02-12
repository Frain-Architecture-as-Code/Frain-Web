import axios from "axios";
import { encode } from "next-auth/jwt";
import { auth } from "@/lib/auth";

const api = axios.create({
    baseURL: process.env.BACKEND_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(async (config) => {
    const session = await auth();

    if (session?.user) {
        const token = await encode({
            token: {
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
            },
            secret: process.env.AUTH_SECRET!,
            salt: "authjs.session-token",
        });

        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export { api };
