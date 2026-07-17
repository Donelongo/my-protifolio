import { useEffect, useMemo, useState } from "react";
import {
  Apple,
  Check,
  Clipboard,
  Code2,
  Cog,
  Copy,
  Database,
  ExternalLink,
  BriefcaseBusiness,
  GitFork,
  Layers3,
  Map,
  MapPin,
  Music2,
  Phone,
  Play,
  Server,
  Smartphone,
  Sparkles,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import profileImage from "../assets/dagmawi-elias-lewi.webp";
import {
  contactDetails,
  experience,
  type Project,
  type ProjectCategory,
  projects,
  skillGroups,
  socialLinks,
} from "../data/portfolio";
import {
  MagneticLink,
  Reveal,
  SectionHeading,
  TechTag,
} from "./UI";

type Notify = (message: string) => void;

const projectIcons = {
  music: Music2,
  mobile: Smartphone,
  mechanical: Cog,
  map: Map,
  team: Users,
};

const skillIcons = [Code2, Server, Database, Map, Smartphone, Wrench];

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="home" className="hero-section" aria-labelledby="hero-heading">
      <div className="hero-orb hero-orb--one" aria-hidden="true" />
      <div className="hero-orb hero-orb--two" aria-hidden="true" />
      <div className="site-container hero-grid">
        <motion.div
          className="hero-copy"
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hero-introline">
            <div className="availability">
              <span aria-hidden="true" />
              Addis Ababa, Ethiopia · Full Stack Software Engineer
            </div>
            <motion.figure
              className="hero-visual"
              initial={reduceMotion ? false : { opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
            >
              <img
                src={profileImage}
                alt="Portrait of Dagmawi Elias Lewi"
                width="1200"
                height="1600"
                fetchPriority="high"
                decoding="async"
              />
            </motion.figure>
          </div>
          <h1 id="hero-heading">
            Full Stack Engineer crafting thoughtful digital experiences<span>.</span>
          </h1>
          <p className="hero-summary">
            I&apos;m Dagmawi Elias Lewi, a Software Engineering graduate building responsive
            web, backend, mobile, and GIS products with clean code and thoughtful design.
          </p>
          <div className="hero-actions">
            <MagneticLink href="#projects">Explore selected work</MagneticLink>
            <MagneticLink href="#contact" variant="secondary">
              Contact me
            </MagneticLink>
          </div>
          <div className="hero-status" aria-label="Portfolio snapshot">
            <div>
              <strong>05</strong>
              <span>Selected projects</span>
            </div>
            <div>
              <strong>06</strong>
              <span>Technical disciplines</span>
            </div>
            <div>
              <i aria-hidden="true" />
              <span>Open to collaboration</span>
            </div>
          </div>
          <div className="hero-technology" aria-label="Core capabilities">
            <span>React</span>
            <span>TypeScript</span>
            <span>Django</span>
            <span>Flutter</span>
            <span>GIS</span>
          </div>
        </motion.div>

      </div>
      <a className="scroll-cue" href="#about" aria-label="Scroll to about">
        <span />
        Scroll to explore
      </a>
    </section>
  );
}

export function About() {
  return (
    <section id="about" className="section-block section-block--tinted">
      <div className="site-container">
        <SectionHeading
          eyebrow="01 · About"
          title="Product thinking, grounded in clean engineering."
          description="I care about how a product feels in a user's hands and how well the system behind it holds up."
        />
        <div className="about-grid">
          <Reveal className="about-copy">
            <p className="about-lead">
              I&apos;m a Software Engineering graduate and Full Stack Developer with a strong
              interest in polished frontend experiences, backed by capable server-side,
              database, mobile, and GIS development skills.
            </p>
            <p>
              I enjoy turning complex requirements into clear interfaces and maintainable
              systems. My experience spans responsive web development, Flutter applications,
              interactive geospatial products, and collaborative product engineering.
              Currently, I contribute to Dentrace as part of the engineering team.
            </p>
          </Reveal>

          <div className="about-principles">
            {[
              {
                number: "01",
                title: "Frontend focused",
                copy: "Responsive, accessible interfaces with thoughtful hierarchy and detail.",
              },
              {
                number: "02",
                title: "Full-stack capable",
                copy: "Backend APIs, databases, mobile development, and GIS implementation.",
              },
              {
                number: "03",
                title: "Collaborative mindset",
                copy: "Clear communication, practical problem solving, and shared ownership of quality.",
              },
            ].map((item, index) => (
              <Reveal key={item.number} className="principle-row" delay={index * 0.08}>
                <span>{item.number}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const Icon = projectIcons[project.icon];
  const visualUrl = project.liveUrl ?? project.googlePlayUrl;
  const visual = (
    <>
      <div className="project-number">
        Project {String(index + 1).padStart(2, "0")}
      </div>
      <Icon size={64} strokeWidth={1.15} aria-hidden="true" />
      <span>{visualUrl ? "Open project ↗" : project.category}</span>
    </>
  );

  return (
    <motion.article
      className="project-card"
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 14 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      {visualUrl ? (
        <a
          className={`project-visual project-visual--${project.visualTone}`}
          href={visualUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${project.title} ${project.liveUrl ? "website" : "on Google Play"}`}
        >
          {visual}
        </a>
      ) : (
        <div className={`project-visual project-visual--${project.visualTone}`}>{visual}</div>
      )}

      <div className="project-body">
        <div className="project-topline">
          <div>
            <p className="project-role">{project.role}</p>
            <h3>{project.title}</h3>
          </div>
          {project.collaboration ? (
            <span className="collaboration-label">
              <Users size={14} aria-hidden="true" />
              {project.collaboration}
            </span>
          ) : null}
        </div>
        <p className="project-description">{project.description}</p>
        <div className="project-tags">
          {project.technologies.map((technology) => (
            <TechTag key={technology}>{technology}</TechTag>
          ))}
        </div>
        <div className="project-details">
          <div>
            <p>Challenge</p>
            <span>{project.challenge}</span>
          </div>
          <div>
            <p>Solution</p>
            <span>{project.solution}</span>
          </div>
        </div>
        <div className="project-actions">
          {project.liveUrl ? (
            <a href={project.liveUrl} target="_blank" rel="noreferrer">
              Visit website <ExternalLink size={15} aria-hidden="true" />
            </a>
          ) : !project.googlePlayUrl ? (
            <span className="unavailable-link" aria-label="No public demo available">
              No public demo
            </span>
          ) : null}
          {project.googlePlayUrl ? (
            <a href={project.googlePlayUrl} target="_blank" rel="noreferrer">
              <Play size={15} fill="currentColor" aria-hidden="true" /> Google Play
            </a>
          ) : null}
          {project.appStoreUrl ? (
            <a href={project.appStoreUrl} target="_blank" rel="noreferrer">
              <Apple size={15} aria-hidden="true" /> App Store
            </a>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}

export function Projects() {
  const [filter, setFilter] = useState<"All" | ProjectCategory>("All");
  const [selectedId, setSelectedId] = useState(projects[0].id);
  const filteredProjects = useMemo(
    () => (filter === "All" ? projects : projects.filter((project) => project.category === filter)),
    [filter],
  );
  const selectedProject =
    filteredProjects.find((project) => project.id === selectedId) ?? filteredProjects[0];
  const selectedIndex = projects.findIndex((project) => project.id === selectedProject.id);
  const filters: ("All" | ProjectCategory)[] = ["All", "Web", "Mobile", "GIS", "Team"];

  useEffect(() => {
    if (!filteredProjects.some((project) => project.id === selectedId)) {
      setSelectedId(filteredProjects[0].id);
    }
  }, [filteredProjects, selectedId]);

  return (
    <section id="projects" className="section-block">
      <div className="site-container">
        <SectionHeading
          eyebrow="02 · Featured projects"
          title="Real work, presented with clarity."
          description="A selection of web, mobile, GIS, and collaborative engineering work—without inflated claims or fictional case studies."
        />
        <Reveal className="project-filters">
          <p>Choose a track</p>
          <div role="group" aria-label="Filter projects by category">
            {filters.map((item) => (
              <button
                type="button"
                key={item}
                className={filter === item ? "active" : ""}
                onClick={() => setFilter(item)}
                aria-pressed={filter === item}
              >
                {item}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="project-explorer">
          <Reveal className="project-index" aria-label="Select a project">
            <div className="project-index__progress" aria-hidden="true">
              <span style={{ width: `${((selectedIndex + 1) / projects.length) * 100}%` }} />
            </div>
            {filteredProjects.map((project) => {
              const projectIndex = projects.findIndex((item) => item.id === project.id);
              const active = project.id === selectedProject.id;
              return (
                <button
                  type="button"
                  key={project.id}
                  className={active ? "active" : ""}
                  onClick={() => setSelectedId(project.id)}
                  aria-pressed={active}
                >
                  <span>{String(projectIndex + 1).padStart(2, "0")}</span>
                  <span>
                    <strong>{project.title}</strong>
                    <small>{project.category}</small>
                  </span>
                  <i aria-hidden="true" />
                </button>
              );
            })}
            <p>{filteredProjects.length} real projects · select to inspect</p>
          </Reveal>

          <motion.div className="project-stage" layout>
            <AnimatePresence mode="wait">
              <ProjectCard
                key={selectedProject.id}
                project={selectedProject}
                index={selectedIndex}
              />
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function Experience() {
  return (
    <section id="experience" className="section-block section-block--tinted">
      <div className="site-container">
        <SectionHeading
          eyebrow="03 · Experience"
          title="Contributing, learning, and delivering with teams."
          description="A focused view of Dagmawi's current role, internship experience, and previous software-project support."
        />
        <div className="timeline" aria-label="Professional experience timeline">
          {experience.map((item, index) => (
            <Reveal key={`${item.company}-${item.role}`} className="timeline-item" delay={index * 0.09}>
              <div className="timeline-status">
                <span className={item.status === "Current" ? "current" : ""} />
                <p>{item.status}</p>
              </div>
              <div className="timeline-role">
                <h3>{item.role}</h3>
                <p>{item.company}</p>
              </div>
              <div className="timeline-copy">
                <p>{item.description}</p>
                <div>
                  {item.highlights.map((highlight) => (
                    <TechTag key={highlight}>{highlight}</TechTag>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Skills() {
  return (
    <section id="skills" className="section-block">
      <div className="site-container">
        <SectionHeading
          eyebrow="04 · Capabilities"
          title="A practical full-stack toolkit."
          description="Skills are grouped by discipline and shown without arbitrary proficiency percentages."
        />
        <div className="skills-grid">
          {skillGroups.map((group, index) => {
            const Icon = skillIcons[index];
            return (
              <Reveal key={group.title} className="skill-card" delay={index * 0.055}>
                <div className="skill-card__heading">
                  <Icon size={20} aria-hidden="true" />
                  <h3>{group.title}</h3>
                </div>
                <div className="skill-list">
                  {group.skills.map((skill, skillIndex) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, x: -6 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.04 * skillIndex }}
                    >
                      <i aria-hidden="true" /> {skill}
                    </motion.span>
                  ))}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function CurrentWork() {
  return (
    <section className="section-block current-work-section" aria-labelledby="current-work-title">
      <div className="site-container">
        <Reveal className="current-work">
          <div className="current-work__icon">
            <Layers3 size={32} aria-hidden="true" />
          </div>
          <div>
            <p className="eyebrow">05 · Current work</p>
            <h2 id="current-work-title">Contributing at Dentrace.</h2>
            <p>
              Dagmawi currently contributes as part of the engineering team, supporting the
              development and improvement of modern software solutions. This is collaborative
              work delivered with the wider team.
            </p>
          </div>
          <MagneticLink href="https://www.dentrace.io/" variant="secondary" external icon="external">
            Visit Dentrace
          </MagneticLink>
        </Reveal>
      </div>
    </section>
  );
}

export function WhyWorkWithMe() {
  const reasons = [
    {
      icon: Sparkles,
      title: "Modern development",
      copy: "I build clean, maintainable software using modern technologies and engineering practices.",
    },
    {
      icon: Zap,
      title: "Performance focused",
      copy: "I prioritize responsive interfaces, optimized loading, and architectures designed to scale.",
    },
    {
      icon: Users,
      title: "Collaborative",
      copy: "I enjoy working with teams, communicating clearly, and contributing to shared goals.",
    },
  ];

  return (
    <section className="section-block section-block--tinted" aria-labelledby="why-heading">
      <div className="site-container">
        <SectionHeading
          eyebrow="06 · Why work with me"
          title="Reliable collaboration, thoughtful execution."
          description="A straightforward working style built around quality, performance, and shared outcomes."
        />
        <div className="reasons-grid">
          {reasons.map((reason, index) => (
            <Reveal key={reason.title} className="reason-card" delay={index * 0.08}>
              <reason.icon size={25} aria-hidden="true" />
              <span>0{index + 1}</span>
              <h3>{reason.title}</h3>
              <p>{reason.copy}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Contact({ notify }: { notify: Notify }) {
  const copyEmailFallback = () => {
    const textArea = document.createElement("textarea");
    textArea.value = contactDetails.email;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();
    const copied = document.execCommand("copy");
    textArea.remove();
    return copied;
  };

  const handleCopy = async () => {
    try {
      if (!navigator.clipboard) throw new Error("Clipboard API unavailable");
      await navigator.clipboard.writeText(contactDetails.email);
      notify("Email copied to clipboard.");
    } catch {
      notify(copyEmailFallback() ? "Email copied to clipboard." : `Email: ${contactDetails.email}`);
    }
  };

  return (
    <section id="contact" className="section-block contact-section">
      <div className="site-container">
        <Reveal className="contact-panel">
          <div className="contact-intro">
            <p className="eyebrow">05 · Contact</p>
            <h2>Let&apos;s build something meaningful together<span>.</span></h2>
            <p>
              Have a project in mind? Reach me directly by email or phone, or connect
              through LinkedIn and GitHub.
            </p>
            <div className="contact-primary-actions">
              <MagneticLink href={socialLinks.linkedin} external icon="external">
                Connect on LinkedIn
              </MagneticLink>
              <MagneticLink href={socialLinks.github} variant="secondary" external icon="external">
                View GitHub
              </MagneticLink>
            </div>
          </div>

          <div className="contact-details">
            <div className="contact-row">
              <div><Clipboard size={18} /><span>Professional email</span></div>
              <button type="button" onClick={handleCopy} aria-label="Copy professional email">
                {contactDetails.email} <Copy size={15} />
              </button>
            </div>
            <div className="contact-row">
              <div><Phone size={18} /><span>Phone</span></div>
              <a href={`tel:${contactDetails.phone}`} aria-label={`Call ${contactDetails.phone}`}>
                {contactDetails.phone}
              </a>
            </div>
            <div className="contact-row">
              <div><MapPin size={18} /><span>Location</span></div>
              <span>Addis Ababa, Ethiopia</span>
            </div>
            <div className="contact-social-pair">
              <a href={socialLinks.github} target="_blank" rel="noreferrer">
                <GitFork size={18} /> GitHub <ExternalLink size={14} />
              </a>
              <a href={socialLinks.linkedin} target="_blank" rel="noreferrer">
                <BriefcaseBusiness size={18} /> LinkedIn <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
