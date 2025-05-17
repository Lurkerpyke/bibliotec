//lib/actions/auth.ts
"use server";

import { eq } from "drizzle-orm";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { hash } from "bcryptjs";
import { signIn } from "@/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ratelimit from "@/lib/ratelimit";

export const signInWithCredentials = async (
    params: Pick<AuthCredentials, "email" | "password">,
) => {
    const { email, password } = params;

    const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
    const { success } = await ratelimit.limit(ip);

    if (!success) return redirect("/too-fast");

    try {
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            return { success: false, error: result.error };
        }

        return { success: true };
    } catch (error) {
        console.log(error, "Signin error");
        return { success: false, error: "Signin error" };
    }
};

export const signUp = async (params: AuthCredentials) => {
    const { fullName, email, universityId, password, universityCard } = params;

    const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
    const { success } = await ratelimit.limit(ip);

    if (!success) return redirect("/too-fast");

    const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

    if (existingUser.length > 0) {
        return { success: false, error: "User already exists" };
    }

    const hashedPassword = await hash(password, 10);

    try {
        await db.insert(users).values({
            fullName,
            email,
            universityId,
            password: hashedPassword,
            universityCard,
        });

        await signInWithCredentials({ email, password });

        // 🚀 Dispara a workflow da Upstash para envio de e-mail
        // Inside signUp try block
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/workflows/onboarding`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, name: fullName }),
        });

        if (!res.ok) {
            const error = await res.text();
            console.error('❌ Workflow failed:', error);
            throw new Error('Failed to trigger welcome email');
  }


        return { success: true };
    } catch (error) {
        console.log(error, "Signup error");
        return { success: false, error: "Signup error" };
    }
};