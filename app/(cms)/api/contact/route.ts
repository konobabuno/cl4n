// app/(cms)/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const resend = new Resend(process.env.RESEND_API_KEY);

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const { name, compania, correo, subject, message } = await req.json();

    const safeName = String(name ?? "").slice(0, 200);
    const safeCompania = String(compania ?? "").slice(0, 200);
    const safeCorreo = String(correo ?? "").trim();
    const safeSubject = String(subject ?? "").slice(0, 200);
    const safeMessage = String(message ?? "").slice(0, 5000);

    // 1) Enviar a admin (con reply-to del usuario si es válido)
    const adminPromise = resend.emails.send({
      from: "Contacto CL4N <onboarding@resend.dev>",
      to: ["robejafet@gmail.com"],
      subject: `Contacto desde CL4N: ${safeSubject}`,
      html: `
        <p><b>Nombre:</b> ${safeName}</p>
        <p><b>Compañía:</b> ${safeCompania}</p>
        <p><b>Email:</b> ${safeCorreo}</p>
        <p><b>Asunto:</b> ${safeSubject}</p>
        <p><b>Mensaje:</b><br/>${safeMessage.replace(/\n/g, "<br/>")}</p>
      `,
      text: `Nombre: ${safeName}
Compañía: ${safeCompania}
Email: ${safeCorreo}
Asunto: ${safeSubject}

Mensaje:
${safeMessage}`,
      replyTo: isValidEmail(safeCorreo) ? [safeCorreo] : undefined,
    });

    const userPromise =
      isValidEmail(safeCorreo)
        ? resend.emails.send({
            from: "CL4N <onboarding@resend.dev>",
            to: [safeCorreo],
            subject: "Gracias por tu mensaje",
            html: `
              <p>¡Gracias por escribirnos! Te responderemos en breve.</p>
              <p>Atte. <b>CL4N</b></p>
            `,
            text: `¡Gracias por escribirnos! Te responderemos en breve.\n\nAtte. CL4N`,
          })
        : null;

    const results = await Promise.allSettled(
      [adminPromise, userPromise].filter(Boolean) as Promise<any>[]
    );

    const [adminResult, userResult] = results;

    if (adminResult?.status === "rejected" || (adminResult as any)?.value?.error) {
      const err =
        (adminResult as any)?.reason?.message ||
        (adminResult as any)?.value?.error?.message ||
        "Failed to send admin email";
      return NextResponse.json({ error: err, target: "admin" }, { status: 500 });
    }

    if (userResult && (userResult.status === "rejected" || (userResult as any)?.value?.error)) {
      const err =
        (userResult as any)?.reason?.message ||
        (userResult as any)?.value?.error?.message ||
        "Failed to send user email";
      return NextResponse.json(
        { success: true, warning: err, target: "user" },
        { status: 200 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}