// app/api/workflows/onboarding/route.ts

import { serve } from "@upstash/workflow/nextjs";
import emailjs from '@emailjs/nodejs';

type InitialData = {
    email: string;
    name: string; // <-- agora aceitamos o nome também
};

export const { POST } = serve<InitialData>(async (context) => {
    const { email, name } = context.requestPayload

    await context.run("new-signup", async () => {
        await sendEmail("Welcome to the platform", email, name, process.env.EMAILJS_TEMPLATE_ID!)
    })

    await context.sleep("wait-for-3-days", 60 * 60 * 24 * 3)

    while (true) {
        const state = await context.run("check-user-state", async () => {
            return await getUserState()
        })

        if (state === "non-active") {
            await context.run("send-email-non-active", async () => {
                await sendEmail("Email to non-active users", email, name, process.env.EMAILJS_TEMPLATE_NON_ACTIVE!)
            })
        }

        await context.sleep("wait-for-1-month", 60 * 60 * 24 * 30)
    }
});

async function sendEmail(subject: string, email: string, name: string, templateId: string) {
    try {
        const response = await emailjs.send(
            process.env.EMAILJS_SERVICE_ID!,
            templateId,
            {
                email: email,          // Corresponde ao {{email}} do template
                user_name: name,       // Corresponde ao {{user_name}} do template
                subject: subject,      // Corresponde ao {{subject}} do template
            },
            {
                publicKey: process.env.EMAILJS_PUBLIC_KEY!,
                privateKey: process.env.EMAILJS_PRIVATE_KEY!,
            }
        );

        console.log('✅ Email enviado:', response);
    } catch (err) {
        console.error('❌ Erro ao enviar email:', err);
    }
}


type UserState = "non-active" | "active"

const getUserState = async (): Promise<UserState> => {
    // Implement user state logic here
    return "non-active"
}