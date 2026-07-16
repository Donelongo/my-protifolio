import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowUp,
  BriefcaseBusiness,
  GitFork,
  Menu,
  X,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { socialLinks } from "../data/portfolio";
import { MagneticLink } from "./UI";

const navigation = [
  { label: "About", href: "#about", id: "about" },
  { label: "Projects", href: "#projects", id: "projects" },
  { label: "Experience", href: "#experience", id: "experience" },
  { label: "Skills", href: "#skills", id: "skills" },
  { label: "Contact", href: "#contact", id: "contact" },
];

function useActiveSection() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const sections = ["home", ...navigation.map((item) => item.id)]
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    let hashTimer: number | undefined;

    const syncHash = (sectionId: string) => {
      const nextHash = sectionId === "home" ? "" : `#${sectionId}`;
      if (window.location.hash !== nextHash) {
        const nextUrl = `${window.location.pathname}${window.location.search}${nextHash}`;
        window.history.replaceState(window.history.state, "", nextUrl);
      }
    };

    const update = () => {
      const marker = window.scrollY + 180;
      const current = sections.reduce(
        (selected, section) => (section.offsetTop <= marker ? section : selected),
        sections[0],
      );
      if (!current?.id) return;

      setActive(current.id);
      window.clearTimeout(hashTimer);
      hashTimer = window.setTimeout(() => syncHash(current.id), 140);
    };

    const initialSection = sections.find(
      (section) => `#${section.id}` === window.location.hash && section.id !== "home",
    );
    const initialFrame = initialSection
      ? window.requestAnimationFrame(() => {
          const root = document.documentElement;
          const previousScrollBehavior = root.style.scrollBehavior;
          root.style.scrollBehavior = "auto";
          setActive(initialSection.id);
          initialSection.scrollIntoView({ block: "start" });
          root.style.scrollBehavior = previousScrollBehavior;
          window.clearTimeout(hashTimer);
          hashTimer = window.setTimeout(() => syncHash(initialSection.id), 140);
        })
      : undefined;

    if (!initialSection) update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      if (initialFrame) window.cancelAnimationFrame(initialFrame);
      window.clearTimeout(hashTimer);
      window.removeEventListener("scroll", update);
    };
  }, []);

  return active;
}

export function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), reduceMotion ? 120 : 900);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.1 : 0.45 }}
          aria-hidden="true"
        >
          <motion.div
            className="loading-mark"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            DEL<span>.</span>
          </motion.div>
          <div className="loading-line">
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: reduceMotion ? 0.1 : 0.7, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 130, damping: 28 });
  return <motion.div className="scroll-progress" style={{ scaleX }} />;
}

export function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 450, damping: 38 });
  const springY = useSpring(y, { stiffness: 450, damping: 38 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(pointer: fine) and (min-width: 1024px)");
    const update = () => setEnabled(media.matches);
    const move = (event: globalThis.MouseEvent) => {
      x.set(event.clientX - 8);
      y.set(event.clientY - 8);
    };
    update();
    media.addEventListener("change", update);
    window.addEventListener("mousemove", move);
    return () => {
      media.removeEventListener("change", update);
      window.removeEventListener("mousemove", move);
    };
  }, [x, y]);

  if (!enabled) return null;
  return <motion.div className="cursor-dot" style={{ x: springX, y: springY }} />;
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const active = useActiveSection();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="site-header">
      <nav className="site-container nav-shell" aria-label="Primary navigation">
        <a className="wordmark" href="#home" aria-label="Dagmawi Elias Lewi, home">
          DEL<span>.</span>
        </a>

        <div className="desktop-nav" aria-label="Section navigation">
          {navigation.map((item) => (
            <a
              key={item.id}
              className={active === item.id ? "active" : ""}
              href={item.href}
            >
              {item.label}
            </a>
          ))}
        </div>

        <a className="nav-cta" href="#contact">
          Start a project
        </a>

        <button
          type="button"
          className="menu-toggle"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close navigation" : "Open navigation"}
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-navigation"
            className="mobile-drawer"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <div className="site-container mobile-drawer__inner">
              {navigation.map((item, index) => (
                <motion.a
                  key={item.id}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <span>0{index + 1}</span>
                  {item.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

export function FloatingSocials() {
  return (
    <aside className="floating-socials" aria-label="Social links">
      <a href={socialLinks.github} target="_blank" rel="noreferrer" aria-label="GitHub">
        <GitFork size={17} />
      </a>
      <span />
      <a
        href={socialLinks.linkedin}
        target="_blank"
        rel="noreferrer"
        aria-label="LinkedIn"
      >
        <BriefcaseBusiness size={17} />
      </a>
    </aside>
  );
}

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > 640);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.a
          href="#home"
          className="back-to-top"
          aria-label="Back to top"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
        >
          <ArrowUp size={18} />
        </motion.a>
      ) : null}
    </AnimatePresence>
  );
}

export function Toast({ message }: { message: string }) {
  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          className="toast"
          role="status"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
        >
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container footer-grid">
        <div>
          <a className="wordmark" href="#home">
            DEL<span>.</span>
          </a>
          <p>Dagmawi Elias Lewi · Full Stack Software Engineer</p>
          <p>Addis Ababa, Ethiopia</p>
        </div>
        <div>
          <p className="footer-label">Navigation</p>
          <div className="footer-links">
            {navigation.map((item) => (
              <a key={item.id} href={item.href}>
                {item.label}
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="footer-label">Connect</p>
          <div className="footer-links">
            <a href={socialLinks.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href={socialLinks.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
      <div className="site-container footer-bottom">
        <p>© {new Date().getFullYear()} Dagmawi Elias Lewi. All rights reserved.</p>
        <p>Designed and built with care in Addis Ababa.</p>
      </div>
    </footer>
  );
}

export function NotFound() {
  return (
    <main className="not-found">
      <div className="not-found__content">
        <p className="eyebrow">Page not found</p>
        <h1>404<span>.</span></h1>
        <p>The page you are looking for does not exist or may have moved.</p>
        <MagneticLink href="/" icon="arrow">
          <ArrowLeft size={16} /> Return home
        </MagneticLink>
      </div>
    </main>
  );
}
