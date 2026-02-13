"use client";

import { oauthAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { GithubDark } from "@/components/ui/svgs/githubDark";
import { GithubLight } from "@/components/ui/svgs/githubLight";
import { Google } from "@/components/ui/svgs/google";

export function OAuthButtons() {
    return (
        <div className="grid grid-cols-2 gap-3">
            <form action={() => oauthAction("github")}>
                <Button
                    type="submit"
                    variant="outline"
                    className="w-full"
                    size="sm"
                >
                    <GithubLight className="mr-2 h-4 w-4 dark:hidden" />
                    <GithubDark className="mr-2 hidden h-4 w-4 dark:block" />
                    GitHub
                </Button>
            </form>
            <form action={() => oauthAction("google")}>
                <Button
                    type="submit"
                    variant="outline"
                    className="w-full"
                    size="sm"
                >
                    <Google className="mr-2 h-4 w-4" />
                    Google
                </Button>
            </form>
        </div>
    );
}
