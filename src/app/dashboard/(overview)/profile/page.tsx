import { ProfileForm } from "@/components/profile-form";
import { auth } from "@/lib/auth";

export const metadata = {
    title: "Profile",
};

export default async function ProfilePage() {
    const session = await auth();

    if (!session?.user) {
        return null;
    }

    return (
        <ProfileForm
            user={{
                name: session.user.name ?? "",
                email: session.user.email ?? "",
                image: session.user.image ?? null,
            }}
        />
    );
}
