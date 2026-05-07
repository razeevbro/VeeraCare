"use client";

import type { ReactNode } from "react";
import { RemoteImage as Image } from "@/components/media/RemoteImage";
import Link from "next/link";
import {
  ArrowUpRight,
  Briefcase,
  Clock,
  FileText,
  GraduationCap,
  UsersRound,
} from "lucide-react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { ServicesDualActions } from "@/components/landing/PromoCtas";
import { staggerContainer, staggerItem } from "@/lib/motion-variants";

const unsplash = (photoPath: string) =>
  `https://images.unsplash.com/${photoPath}?auto=format&fit=crop&w=1200&q=82`;

type Card = {
  title: string;
  body: string;
  icons: ReactNode;
  image: string;
  imageAlt: string;
};

/** Distinct, role-relevant photography per solution (no duplicate URLs). */
const cards: Card[] = [
  {
    title: "Contract staffing",
    body: "Flexible talent for projects and peaks with safety, and attendance rigor for onsite roles.",
    icons: (
      <>
        <FileText className="h-5 w-5" strokeWidth={1.35} />
      </>
    ),
    image: unsplash("photo-1621905252507-b35492cc74b4"),
    imageAlt: "Onsite technician in safety gear at a facility",
  },
  {
    title: "Direct hire & embedded teams",
    body: "Permanent placements and dependable staffing lanes that support your standards, schedules, and onsite expectations.",
    icons: <UsersRound className="h-5 w-5" strokeWidth={1.35} />,
    image: unsplash("photo-1522071820081-009f0129c71c"),
    imageAlt: "Team collaborating in a professional workplace",
  },
  {
    title: "Workforce planning",
    body: "Forecast labor demand, shift coverage, and staffing risk with clear reporting for operations and facilities leadership.",
    icons: <Briefcase className="h-5 w-5" strokeWidth={1.35} />,
    image: unsplash("photo-1553877522-43269d4ea984"),
    imageAlt: "Operations planning session with laptop and notes",
  },
  {
    title: "Employer of record",
    body: "Payroll, benefits, and compliance for onsite teams while your managers retain day-to-day direction from skilled technicians to facilities support staff.",
    icons: <Clock className="h-5 w-5" strokeWidth={1.35} />,
    image: unsplash("photo-1450101499163-c8848c66ca85"),
    imageAlt: "Business paperwork and compliance documents on a desk",
  },
  {
    title: "Hire · Train · Deploy",
    body: "Upskill cohorts for safety critical and onsite tasks orientation, role discipline, maintenance readiness, and standardized cleaning protocols.",
    icons: <GraduationCap className="h-5 w-5" strokeWidth={1.35} />,
    image: unsplash("photo-1524178232363-1fb2b075b655"),
    imageAlt: "Training session or classroom instruction",
  },
];

export function WhatWeDo() {
  return (
    <section id="services" className="border-b border-neutral-200 bg-white py-16 md:py-24">
      <div className="mx-auto max-w-[1320px] px-4 md:px-8">
        <Reveal blur>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand">Solutions</p>
          <h2 className="mt-4 text-3xl font-bold uppercase tracking-tight text-black md:text-4xl">
            What we deliver
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-neutral-700">
            Facilities programs and staffing models designed for onsite operations delivered with
            consistent supervision, safety orientation, and accountability.
          </p>
        </Reveal>

        <motion.div
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {cards.map((card) => (
            <motion.article
              key={card.title}
              variants={staggerItem}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.28 }}
              className="group/card flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:border-brand/25 hover:shadow-2xl hover:shadow-brand/10 hover:ring-2 hover:ring-brand/10"
            >
              <div className="flex items-start justify-between gap-3 p-6 pb-2">
                <div className="flex items-center gap-2 text-neutral-500 transition-colors duration-300 group-hover/card:text-brand [&_svg]:transition-colors">
                  {card.icons}
                </div>
                <Link
                  href="#contact"
                  aria-label={`Learn about ${card.title}`}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand shadow-sm transition-all duration-300 hover:scale-110 hover:bg-brand hover:text-white hover:shadow-md"
                >
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-300 group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5"
                    strokeWidth={2}
                  />
                </Link>
              </div>
              <div className="px-6 pb-4">
                <h3 className="text-lg font-bold text-black">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">{card.body}</p>
              </div>
              <div className="relative mt-auto aspect-[16/10] w-full">
                <Image
                  src={card.image}
                  alt={card.imageAlt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover/card:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </motion.article>
          ))}
        </motion.div>

        <Reveal delay={0.12}>
          <ServicesDualActions className="mt-14" />
        </Reveal>
      </div>
    </section>
  );
}
