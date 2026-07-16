import type { MouseEvent, ReactNode } from "react";
import { useState } from "react";
import { ArrowDownToLine, ArrowRight, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-72px" }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "split";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "split",
}: SectionHeadingProps) {
  return (
    <Reveal
      className={`section-heading ${align === "left" ? "section-heading--left" : ""}`}
    >
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {description ? <p className="section-heading__copy">{description}</p> : null}
    </Reveal>
  );
}

type MagneticLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "quiet";
  icon?: "arrow" | "external" | "download";
  className?: string;
  external?: boolean;
  ariaLabel?: string;
};

export function MagneticLink({
  href,
  children,
  variant = "primary",
  icon = "arrow",
  className = "",
  external = false,
  ariaLabel,
}: MagneticLinkProps) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const reduceMotion = useReducedMotion();

  const handleMove = (event: MouseEvent<HTMLAnchorElement>) => {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setOffset({
      x: (event.clientX - rect.left - rect.width / 2) * 0.12,
      y: (event.clientY - rect.top - rect.height / 2) * 0.12,
    });
  };

  const Icon =
    icon === "external"
      ? ArrowUpRight
      : icon === "download"
        ? ArrowDownToLine
        : ArrowRight;

  return (
    <motion.a
      href={href}
      aria-label={ariaLabel}
      className={`magnetic-button magnetic-button--${variant} ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      animate={offset}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
    >
      <span>{children}</span>
      <Icon size={16} aria-hidden="true" />
    </motion.a>
  );
}

export function TechTag({ children }: { children: ReactNode }) {
  return <span className="tech-tag">{children}</span>;
}
