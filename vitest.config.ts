import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
        },
    },
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: ["./src/__tests__/setup.ts"],
        include: ["src/**/*.test.{ts,tsx}"],
        coverage: {
            provider: "v8",
            include: ["src/lib/**", "src/services/**", "src/stores/**"],
            exclude: [
                "src/generated/**",
                "src/components/ui/**",
                "src/**/*.d.ts",
            ],
        },
    },
});
