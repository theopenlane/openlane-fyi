import { defineAction } from "astro:actions";
import { Resend } from "resend";
import { z } from "astro:schema";

const resend = new Resend(import.meta.env.SECRET_RESEND_API_KEY);

export const server = {
  send: defineAction({
    accept: "form",
    input: z.object({
      name: z.string(),
      email: z.string().email(),
      message: z.string(),
    }),
    handler: async ({ name, email, message }) => {
      const { data, error } = await resend.emails.send({
        from: "Openlane <no-reply@mail.theopenlane.io>",
        to: "info@theopenlane.io",
        subject: "Openlane Investment",
        html: `
          <div style="font-family: sans-serif; font-size: 14px;">
            <strong>New Investment Submission</strong><br><br>

            <strong>Name:</strong> ${name}<br>
            <strong>Email:</strong> ${email}<br>
            <strong>Message:</strong><br>
            ${message.replace(/\n/g, "<br>")}
          </div>
        `,
      });

      if (error) {
        console.log(error);
        throw error;
      }

      return data;
    },
  }),
};
