import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { generateBackendToken } from "@/lib/jwt";

const TEST_SECRET = "test-secret-key-for-jwt-signing";

// Track calls made to the mock chain
let constructorArgs: unknown[] = [];
let setProtectedHeaderArgs: unknown[] = [];
let setSubjectArgs: unknown[] = [];
let setIssuedAtCalled = false;
let setExpirationTimeArgs: unknown[] = [];
let signArgs: unknown[] = [];

// Mock jose with a class-based mock that can be used with `new`
vi.mock("jose", () => {
    class MockSignJWT {
        constructor(...args: unknown[]) {
            constructorArgs = args;
        }
        setProtectedHeader(...args: unknown[]) {
            setProtectedHeaderArgs = args;
            return this;
        }
        setSubject(...args: unknown[]) {
            setSubjectArgs = args;
            return this;
        }
        setIssuedAt() {
            setIssuedAtCalled = true;
            return this;
        }
        setExpirationTime(...args: unknown[]) {
            setExpirationTimeArgs = args;
            return this;
        }
        async sign(...args: unknown[]) {
            signArgs = args;
            return "mock.jwt.token";
        }
    }

    return {
        SignJWT: MockSignJWT,
    };
});

describe("generateBackendToken", () => {
    beforeEach(() => {
        vi.stubEnv("AUTH_SECRET", TEST_SECRET);
        constructorArgs = [];
        setProtectedHeaderArgs = [];
        setSubjectArgs = [];
        setIssuedAtCalled = false;
        setExpirationTimeArgs = [];
        signArgs = [];
    });

    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it("returns a JWT string", async () => {
        const token = await generateBackendToken({
            userId: "user-123",
            email: "test@example.com",
            username: "Test User",
            picture: "https://example.com/avatar.png",
        });

        expect(typeof token).toBe("string");
        expect(token).toBe("mock.jwt.token");
    });

    it("constructs SignJWT with correct claims (email, username, picture)", async () => {
        await generateBackendToken({
            userId: "user-456",
            email: "jane@example.com",
            username: "Jane Doe",
            picture: "https://example.com/jane.png",
        });

        expect(constructorArgs[0]).toEqual({
            email: "jane@example.com",
            username: "Jane Doe",
            picture: "https://example.com/jane.png",
        });
    });

    it("sets HS256 protected header", async () => {
        await generateBackendToken({
            userId: "user-789",
            email: "test@example.com",
            username: "Test",
            picture: "",
        });

        expect(setProtectedHeaderArgs[0]).toEqual({ alg: "HS256" });
    });

    it("sets subject to userId", async () => {
        await generateBackendToken({
            userId: "my-unique-id",
            email: "test@example.com",
            username: "Test",
            picture: "",
        });

        expect(setSubjectArgs[0]).toBe("my-unique-id");
    });

    it("calls setIssuedAt", async () => {
        await generateBackendToken({
            userId: "user-789",
            email: "test@example.com",
            username: "Test",
            picture: "",
        });

        expect(setIssuedAtCalled).toBe(true);
    });

    it("sets expiration to 30 days", async () => {
        await generateBackendToken({
            userId: "user-789",
            email: "test@example.com",
            username: "Test",
            picture: "",
        });

        expect(setExpirationTimeArgs[0]).toBe("30d");
    });

    it("signs with the encoded AUTH_SECRET", async () => {
        await generateBackendToken({
            userId: "user-789",
            email: "test@example.com",
            username: "Test",
            picture: "",
        });

        expect(signArgs).toHaveLength(1);
        const signArg = signArgs[0] as ArrayLike<number>;
        // Verify it's a typed array with the right content
        expect(signArg.constructor.name).toBe("Uint8Array");
        const decoded = new TextDecoder().decode(
            new Uint8Array(Array.from(signArg)),
        );
        expect(decoded).toBe(TEST_SECRET);
    });

    it("does not include userId in JWT payload claims (only in sub)", async () => {
        await generateBackendToken({
            userId: "user-999",
            email: "test@example.com",
            username: "Test",
            picture: "",
        });

        const payload = constructorArgs[0] as Record<string, unknown>;
        expect(payload).not.toHaveProperty("userId");
        expect(payload).not.toHaveProperty("sub");
    });
});
