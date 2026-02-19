import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        backendToken?: string;
        picture?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id?: string;
        backendToken?: string;
        picture?: string;
    }
}
