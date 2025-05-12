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
        await sendEmail("Welcome to the platform", email, name)
    })

    await context.sleep("wait-for-3-days", 60 * 60 * 24 * 3)

    while (true) {
        const state = await context.run("check-user-state", async () => {
            return await getUserState()
        })

        if (state === "non-active") {
            await context.run("send-email-non-active", async () => {
                await sendEmail("Email to non-active users", email, name)
            })
        } else if (state === "active") {
            await context.run("send-email-active", async () => {
                await sendEmail("Send newsletter to active users", email, name)
            })
        }

        await context.sleep("wait-for-1-month", 60 * 60 * 24 * 30)
    }
});

async function sendEmail(subject: string, email: string, name: string) {
    try {
        const response = await emailjs.send(
            process.env.EMAILJS_SERVICE_ID!,
            process.env.EMAILJS_TEMPLATE_ID!,
            {
                user_email: email,
                user_name: name, // <- ESSA VARIÁVEL precisa ser enviada
                subject: subject,
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