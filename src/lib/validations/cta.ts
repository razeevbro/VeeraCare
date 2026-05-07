import { z } from "zod";

/** Optgroup labels + role labels exactly as shown in the CTA dropdown. */
export const serviceNeededGroups = {
  "Domestic & Care": [
    "Housemaid",
    "Nanny/Babysitter",
    "Elderly Caretaker",
    "Personal Cook",
    "Private Driver",
  ],
  "Cleaning & Facilities": [
    "Deep Cleaning",
    "Janitorial Staff",
    "Plumber",
    "Electrician",
    "Gardener/Landscaper",
  ],
  Construction: ["General Laborer", "Mason", "Carpenter", "Painter"],
  "Events & Hospitality": ["Waitstaff/Catering", "Bartender", "Event Setup Crew"],
  Security: ["General Security Guard", "VIP Security", "Bouncer"],
  "Corporate Support": ["Office Boy/Peon", "Receptionist", "Delivery Courier"],
} as const;

export const serviceNeededOptions = [
  ...serviceNeededGroups["Domestic & Care"],
  ...serviceNeededGroups["Cleaning & Facilities"],
  ...serviceNeededGroups.Construction,
  ...serviceNeededGroups["Events & Hospitality"],
  ...serviceNeededGroups.Security,
  ...serviceNeededGroups["Corporate Support"],
] as const;

export type ServiceNeeded = (typeof serviceNeededOptions)[number];

export const ctaRequestSchema = z
  .object({
    inquiryType: z.enum(["HIRING", "WORKER"]),
    name: z.string().min(1, "Name is required").max(120),
    phone: z
      .string()
      .min(7, "Enter a valid phone number")
      .max(32)
      .regex(/^[0-9+()\-.\s]+$/, "Enter a valid phone number"),
    email: z.string().email("Enter a valid email"),
    serviceNeeded: z.enum(serviceNeededOptions),
    /** Worker: preferred schedule / start date. Optional for hiring inquiries. */
    availability: z.string().max(500).optional(),
    message: z.string().min(1, "Message is required").max(2000),
  })
  .superRefine((data, ctx) => {
    if (data.inquiryType === "WORKER") {
      const a = data.availability?.trim();
      if (!a) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Add your availability (days, shifts, or when you can start).",
          path: ["availability"],
        });
      }
    }
  });

export type CTARequestInput = z.infer<typeof ctaRequestSchema>;
