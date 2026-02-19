import { SignJWT } from "jose";

/**
 * Generates a JWT signed with HS256 (HMAC-SHA256) compatible with
 * Spring Boot's NimbusJwtDecoder using a shared secret (AUTH_SECRET).
 *
 * Claims produced:
 *  - sub:      userId (UUID string)
 *  - email:    user email
 *  - username: user display name (maps to Prisma User.name)
 *  - iat:      issued at (auto)
 *  - exp:      expiration (30 days)
 *
 * Spring Boot counterpart expects:
 *  - SecretKeySpec(jwtSecret.getBytes(), "HmacSHA256")
 *  - NimbusJwtDecoder.withSecretKey(key).build()
 */
export async function generateBackendToken(payload: {
    userId: string;
    email: string;
    username: string;
    picture: string;
}): Promise<string> {
    const secret = new TextEncoder().encode(process.env.AUTH_SECRET!);

    return new SignJWT({
        email: payload.email,
        username: payload.username,
        picture: payload.picture,
    })
        .setProtectedHeader({ alg: "HS256" })
        .setSubject(payload.userId)
        .setIssuedAt()
        .setExpirationTime("30d")
        .sign(secret);
}
