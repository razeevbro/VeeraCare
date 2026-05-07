import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ctaRequestSchema } from "@/lib/validations/cta";
import { sendCtaRequestEmail } from "@/lib/email/cta";
import type { ServiceNeeded as DbServiceNeeded } from "@prisma/client";
import type { CTARequestInput } from "@/lib/validations/cta";

function toDbServiceNeeded(service: CTARequestInput["serviceNeeded"]): DbServiceNeeded {
  const map: Record<CTARequestInput["serviceNeeded"], DbServiceNeeded> = {
    Housemaid: "HOUSEMAID",
    "Nanny/Babysitter": "NANNY_BABYSITTER",
    "Elderly Caretaker": "ELDERLY_CARETAKER",
    "Personal Cook": "PERSONAL_COOK",
    "Private Driver": "PRIVATE_DRIVER",
    "Deep Cleaning": "DEEP_CLEANING",
    "Janitorial Staff": "JANITORIAL_STAFF",
    Plumber: "PLUMBER",
    Electrician: "ELECTRICIAN",
    "Gardener/Landscaper": "GARDENER_LANDSCAPER",
    "General Laborer": "GENERAL_LABORER",
    Mason: "MASON",
    Carpenter: "CARPENTER",
    Painter: "PAINTER",
    "Waitstaff/Catering": "WAITSTAFF_CATERING",
    Bartender: "BARTENDER",
    "Event Setup Crew": "EVENT_SETUP_CREW",
    "General Security Guard": "GENERAL_SECURITY_GUARD",
    "VIP Security": "VIP_SECURITY",
    Bouncer: "BOUNCER",
    "Office Boy/Peon": "OFFICE_BOY_PEON",
    Receptionist: "RECEPTIONIST",
    "Delivery Courier": "DELIVERY_COURIER",
  };
  return map[service];
}

export async function POST(req: Request) {
  try {
    const sourcePath = req.headers.get("x-pathname") ?? undefined;
    const json = await req.json();
    const parsed = ctaRequestSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const created = await prisma.staffRequest.create({
      data: {
        inquiryType: parsed.data.inquiryType,
        name: parsed.data.name,
        phone: parsed.data.phone,
        email: parsed.data.email.toLowerCase(),
        serviceNeeded: toDbServiceNeeded(parsed.data.serviceNeeded),
        availability:
          parsed.data.inquiryType === "WORKER"
            ? (parsed.data.availability?.trim() ?? null)
            : null,
        message: parsed.data.message,
        sourcePath,
      },
    });

    const mail = await sendCtaRequestEmail({
      request: parsed.data,
      requestId: created.id,
      sourcePath,
    });

    return NextResponse.json({
      ok: true,
      id: created.id,
      saved: true,
      emailSent: mail.status === "sent",
      emailSkipped: mail.status === "skipped",
      ...(mail.status === "failed" ? { emailError: mail.error } : {}),
    });
  } catch (err) {
    console.error("[cta-request]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
