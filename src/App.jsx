import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Award,
  Clock3,
  Download,
  Lightbulb,
  Mail,
  Menu,
  MessageCircle,
  Mic2,
  Pause,
  Play,
  ScanSearch,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import {
  certifications,
  education,
  experience,
  leadership,
  navLinks,
  processSteps,
  profile,
  projects,
  skillGroups,
  softSkills,
  stackHighlights,
} from "./data";

function GithubIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.586 2 12.253c0 4.537 2.865 8.382 6.839 9.74.5.094.683-.223.683-.494 0-.243-.009-.888-.014-1.743-2.782.62-3.369-1.377-3.369-1.377-.455-1.183-1.11-1.498-1.11-1.498-.908-.638.069-.625.069-.625 1.004.072 1.532 1.06 1.532 1.06.892 1.57 2.341 1.116 2.91.854.091-.663.35-1.116.636-1.372-2.22-.26-4.555-1.14-4.555-5.077 0-1.122.39-2.04 1.029-2.759-.103-.26-.446-1.302.098-2.714 0 0 .84-.276 2.75 1.054A9.3 9.3 0 0 1 12 6.91a9.3 9.3 0 0 1 2.504.346c1.909-1.33 2.748-1.054 2.748-1.054.546 1.412.202 2.454.1 2.714.64.719 1.028 1.637 1.028 2.759 0 3.947-2.339 4.814-4.566 5.069.359.318.679.944.679 1.904 0 1.374-.012 2.482-.012 2.82 0 .273.18.593.688.492C19.138 20.631 22 16.787 22 12.253 22 6.586 17.523 2 12 2Z" />
    </svg>
  );
}

function LinkedinIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};

function Wave({ flip = false, className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1440 90"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={flip ? { transform: "scaleY(-1)" } : undefined}
    >
      <path d="M0,48 C240,96 480,0 720,32 C960,64 1200,96 1440,40 L1440,90 L0,90 Z" />
    </svg>
  );
}

function SoftSkillIcon({ type }) {
  const props = { size: 28, strokeWidth: 1.75 };
  switch (type) {
    case "leadership":
      return <Sparkles {...props} />;
    case "speaking":
      return <Mic2 {...props} />;
    case "collab":
      return <Users {...props} />;
    case "comms":
      return <MessageCircle {...props} />;
    case "solve":
      return <Lightbulb {...props} />;
    case "adapt":
      return <ArrowRight {...props} />;
    case "detail":
      return <ScanSearch {...props} />;
    case "time":
      return <Clock3 {...props} />;
    default:
      return <Sparkles {...props} />;
  }
}

function PhotoSlot({ className = "", src }) {
  const image = src || profile.heroPhoto || profile.photo;
  if (image) {
    return (
      <img
        className={`hero-photo ${className}`}
        src={image}
        alt={profile.name}
      />
    );
  }
  return (
    <div className={`photo-placeholder ${className}`}>
      <div>
        <strong>Your photo here</strong>
        <span>Add a photo in `src/data.js`</span>
      </div>
    </div>
  );
}

function HeroMedia() {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const stop = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    setPlaying(false);
  };

  const toggle = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (playing) {
      stop();
      return;
    }

    try {
      video.muted = false;
      video.volume = 1;
      video.currentTime = 0;
      await video.play();
      setPlaying(true);
    } catch {
      stop();
    }
  };

  return (
    <div className="hero-photo-wrap">
      <video
        key={profile.heroVideo}
        ref={videoRef}
        className="hero-photo hero-video"
        src={profile.heroVideo}
        poster={profile.heroPhoto}
        playsInline
        preload="auto"
        onEnded={stop}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button
        type="button"
        className="hero-float"
        onClick={toggle}
        aria-label={playing ? "Pause intro video" : "Play intro video"}
      >
        <div style={{ textAlign: "center" }}>
          {playing ? (
            <Pause size={22} fill="currentColor" />
          ) : (
            <Play size={22} fill="currentColor" />
          )}
          <span>{playing ? "PAUSE" : "PLAY"}</span>
        </div>
      </button>
    </div>
  );
}

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [formStatus, setFormStatus] = useState("");
  const [formSending, setFormSending] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const ids = ["home", "about", "skills", "projects", "contact"];
      for (const id of [...ids].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY + 120 >= el.offsetTop) {
          setActive(id);
          break;
        }
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const first = String(data.get("firstName") || "").trim();
    const last = String(data.get("lastName") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    const fullName = `${first} ${last}`.trim();

    setFormSending(true);
    setFormStatus("Sending your message…");

    try {
      if (!profile.web3formsAccessKey) {
        throw new Error("SETUP_REQUIRED");
      }

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: profile.web3formsAccessKey,
          name: fullName,
          email,
          message,
          subject: `Portfolio inquiry from ${fullName}`,
          from_name: "Portfolio Contact Form",
          replyto: email,
        }),
      });

      const result = await res.json().catch(() => ({}));
      if (!res.ok || result.success === false) {
        throw new Error(result.message || "Failed to send");
      }

      setFormStatus("Message sent successfully. I will reply soon.");
      form.reset();
    } catch (err) {
      if (String(err?.message) === "SETUP_REQUIRED") {
        setFormStatus(
          "Contact form setup needed: get a free Access Key from web3forms.com and share it to finish setup."
        );
      } else {
        setFormStatus(
          `Could not send right now. Email me directly at ${profile.email}`
        );
      }
    } finally {
      setFormSending(false);
    }
  };

  return (
    <>
      <header className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-inner">
          <a className="brand" href="#home">
            {profile.shortName} <span>Rawani</span>
          </a>
          <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={active === link.href.slice(1) ? "active" : ""}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a className="btn btn-outline nav-cta" href="#contact">
            Hire Me
          </a>
          <button
            className="nav-toggle"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <aside className="social-rail" aria-label="Social links">
        <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub">
          <GithubIcon size={18} />
        </a>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
        >
          <LinkedinIcon size={18} />
        </a>
        <a href={`mailto:${profile.email}`} aria-label="Email">
          <Mail size={18} />
        </a>
      </aside>

      <main>
        <section className="hero" id="home">
          <div className="hero-grid">
            <motion.div
              className="hero-copy"
              initial="hidden"
              animate="show"
              variants={fadeUp}
            >
              <h1>
                Hi, I&apos;m {profile.shortName},
              </h1>
              <p className="hero-role">{profile.role}</p>
              <p className="hero-bio">
                I build <strong>Generative AI</strong> applications,{" "}
                <strong>RAG</strong> pipelines, <strong>LLM</strong> evaluation
                workflows, and backend services with <strong>Python</strong>,{" "}
                <strong>LangChain</strong>, and <strong>FastAPI</strong>.
              </p>
              <div className="hero-actions">
                <a className="btn btn-solid" href="#projects">
                  View My Work
                </a>
                <a className="btn btn-ghost" href="#contact">
                  Contact Me
                </a>
                <a
                  className="btn btn-outline"
                  href={profile.resume}
                  download="Suraj_Kumar_Rawani_Resume.pdf"
                  onClick={async (e) => {
                    e.preventDefault();
                    const resumeUrl = profile.resume;
                    try {
                      const res = await fetch(resumeUrl);
                      if (!res.ok) throw new Error("Resume not found");
                      const blob = await res.blob();
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "Suraj_Kumar_Rawani_Resume.pdf";
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      URL.revokeObjectURL(url);
                    } catch {
                      window.open(resumeUrl, "_blank", "noopener,noreferrer");
                    }
                  }}
                >
                  <Download size={16} /> Resume
                </a>
              </div>
            </motion.div>

            <motion.div
              className="hero-visual"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <HeroMedia />
            </motion.div>
          </div>
          <a className="hero-scroll" href="#about" aria-label="Scroll to about">
            <ArrowDown size={22} />
          </a>
        </section>

        <section className="hello-section" id="about">
          <div className="hello-sparks" aria-hidden="true">
            <span className="spark hello-spark hello-spark-a" />
            <span className="spark hello-spark hello-spark-b" />
            <span className="spark hello-spark hello-spark-c" />
          </div>

          <div className="hello-inner">
            <div className="idcard-stage">
              <span className="idcard-anchor" aria-hidden="true" />
              <motion.div
                className="idcard-pendulum"
                initial={{ rotate: -18, y: -80, opacity: 0 }}
                whileInView={{
                  rotate: [-18, 10, -8, 5, -3, 0],
                  y: 0,
                  opacity: 1,
                }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{
                  duration: 1.35,
                  ease: [0.22, 1, 0.36, 1],
                  times: [0, 0.28, 0.5, 0.7, 0.88, 1],
                }}
              >
                <span className="idcard-string" aria-hidden="true" />
                <span className="idcard-clip" aria-hidden="true" />
                <motion.div
                  className="idcard"
                  animate={{ rotate: [-7, -3, -7] }}
                  transition={{
                    duration: 3.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.4,
                  }}
                  whileHover={{
                    rotate: -2,
                    y: -6,
                    scale: 1.03,
                    transition: { duration: 0.35 },
                  }}
                >
                  <img src={profile.heroPhoto} alt={profile.name} />
                </motion.div>
              </motion.div>
            </div>

            <motion.div
              className="hello-copy"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              custom={1}
            >
              <h2>Hello!</h2>
              <p>
                Hi, my name is <strong>SURAJ KUMAR RAWANI</strong>, an AI/ML
                Engineer based in New Delhi, India, dedicated to crafting clean,
                functional, and highly scalable Generative AI applications.
              </p>
              <div className="hello-stack">
                {stackHighlights.map((item) => (
                  <div className="hello-stack-item" key={item.label}>
                    <div className={`hello-stack-icon ${item.icon}`}>
                      {item.icon === "python" && (
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path
                            fill="currentColor"
                            d="M12 2C7.6 2 7.3 4 7.3 4v2.2h4.8v.7H5.4S3 6.7 3 11.1s1.9 4.3 1.9 4.3h2.3v-2.1S7 11 9.1 11h4.7c2 0 1.9-1.1 1.9-1.1V4.8S16.1 2 12 2zm-2.1 1.3a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 22c4.4 0 4.7-2 4.7-2v-2.2h-4.8v-.7h6.7S21 17.3 21 12.9s-1.9-4.3-1.9-4.3h-2.3v2.1s.2 2.3-1.9 2.3H10.2c-2 0-1.9 1.1-1.9 1.1v5.1S7.9 22 12 22zm2.1-1.3a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6z"
                            opacity="0.85"
                          />
                        </svg>
                      )}
                      {item.icon === "langchain" && (
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2" />
                          <path
                            fill="currentColor"
                            d="M7 12a5 5 0 0 1 5-5h1v2h-1a3 3 0 1 0 0 6h1v2h-1a5 5 0 0 1-5-5zm4-1h6v2h-6v-2z"
                          />
                        </svg>
                      )}
                      {item.icon === "rag" && (
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <circle cx="12" cy="12" r="3" fill="currentColor" />
                          <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="1.6" />
                          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
                          <circle cx="19" cy="8" r="1.4" fill="currentColor" />
                          <circle cx="5" cy="9" r="1.2" fill="currentColor" />
                          <circle cx="16" cy="18" r="1.2" fill="currentColor" />
                        </svg>
                      )}
                    </div>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <svg
            className="hello-wave"
            viewBox="0 0 1440 160"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M0,160 L0,95 C180,30 360,140 540,85 C720,30 900,125 1080,70 C1260,20 1380,90 1440,55 L1440,160 Z" />
          </svg>
        </section>

        <section className="skills" id="skills">
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
            >
              <span className="section-label">Technical Stack</span>
              <h2 className="section-title">MY SKILLSET</h2>
              <p className="section-copy">
                A focused stack for Generative AI, retrieval systems, backend
                services, and reproducible ML workflows.
              </p>
            </motion.div>
            <div className="skill-groups">
              {skillGroups.map((group, i) => (
                <motion.div
                  key={group.title}
                  className="skill-group"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={fadeUp}
                  custom={i}
                >
                  <h3>{group.title}</h3>
                  <div className="skill-tags">
                    {group.items.map((item) => (
                      <span className="skill-tag" key={item}>
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="process" id="process">
          <div className="process-wrap">
            <motion.div
              className="process-intro"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
            >
              <span className="section-label">My Process</span>
              <h2 className="section-title">
                Here&apos;s how I turn ideas into real-world applications.
              </h2>
              <p className="section-copy">
                I follow a structured, creative, and highly technical approach to
                turn ideas into robust Generative AI systems.
              </p>
            </motion.div>

            <div className="process-board">
              <svg
                className="process-paths"
                viewBox="0 0 900 720"
                preserveAspectRatio="xMidYMid meet"
                aria-hidden="true"
              >
                <path
                  className="process-dash"
                  d="M420 70 C520 90, 580 120, 640 160"
                  fill="none"
                />
                <path
                  className="process-dash"
                  d="M620 280 C520 340, 380 380, 280 430"
                  fill="none"
                />
                <path
                  className="process-dash"
                  d="M300 540 C420 580, 560 600, 680 640"
                  fill="none"
                />
                <polygon className="process-arrow" points="635,168 648,155 652,172" />
                <polygon className="process-arrow" points="268,438 280,425 286,442" />
                <polygon className="process-arrow" points="678,648 692,636 696,654" />
              </svg>

              {processSteps.map((step, i) => (
                <motion.article
                  key={step.num}
                  className={`badge-card badge-${step.num} ${step.accent ? "accent" : ""}`}
                  style={{ "--tilt": `${i % 2 === 0 ? -5 : 4}deg` }}
                  initial={{ opacity: 0, y: 50, rotate: i % 2 === 0 ? -12 : 10 }}
                  whileInView={{ opacity: 1, y: 0, rotate: i % 2 === 0 ? -5 : 4 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    delay: 0.12 * i,
                    duration: 0.75,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{
                    y: -14,
                    rotate: 0,
                    scale: 1.05,
                    transition: { duration: 0.28 },
                  }}
                >
                  <span className="badge-hole" aria-hidden="true" />
                  <div className="badge-num">{step.num}</div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                  {step.note && (
                    <span className="badge-note">{step.note}</span>
                  )}
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="projects" id="projects">
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
            >
              <span className="section-label">Selected Work</span>
              <h2 className="section-title">PROJECTS</h2>
              <p className="section-copy">
                Benchmarks, RAG systems, and agentic apps from evaluation labs
                to interactive Streamlit products.
              </p>
            </motion.div>
            <div className="project-list">
              {projects.map((project, i) => (
                <motion.article
                  key={project.num}
                  className="project-card"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={fadeUp}
                  custom={i}
                >
                  <div className="project-top">
                    <span className="project-num">{project.num}</span>
                    <h3>{project.title}</h3>
                  </div>
                  <p>{project.body}</p>
                  <div className="project-tags">
                    {project.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <div className="project-actions">
                    {project.github && (
                      <a
                        className="btn btn-ghost"
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <GithubIcon size={15} /> GitHub
                      </a>
                    )}
                    <a className="btn btn-red" href={profile.github} target="_blank" rel="noreferrer">
                      More on GitHub <ArrowRight size={15} />
                    </a>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="experience" id="experience">
          <span className="spark exp-spark" aria-hidden="true" />
          <div className="exp-inner">
            <motion.div
              className="exp-head"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.35 }}
              variants={fadeUp}
            >
              <h2>WORK EXPERIENCE</h2>
              <p>
                Practical roles where I applied AI/ML engineering principles and
                built real-world systems.
              </p>
            </motion.div>

            <div className="exp-grid">
              {experience.map((item, i) => (
                <motion.article
                  key={item.title}
                  className="exp-glass"
                  initial={{ opacity: 0, y: 36 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{
                    delay: 0.12 * i,
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{
                    y: -10,
                    scale: 1.02,
                    transition: { duration: 0.25 },
                  }}
                >
                  <div className="exp-glass-top">
                    <span className="exp-dates">{item.dates}</span>
                    <span className="exp-pill">{item.badge}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <div className="exp-org">{item.org}</div>

                  <div className="exp-block">
                    <div className="exp-label">Skills gained:</div>
                    <ul>
                      {item.skills.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="exp-block">
                    <div className="exp-label">Technologies</div>
                    <div className="exp-tech">
                      {item.tech.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            <div className="exp-edu">
              {education.map((ed) => (
                <div key={ed.title} className="exp-edu-item">
                  <strong>{ed.title}</strong>
                  <span>{ed.meta}</span>
                </div>
              ))}
            </div>
          </div>

          <svg
            className="exp-bottom-wave"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M0,0 C240,80 480,20 720,70 C960,120 1200,40 1440,90 L1440,120 L0,120 Z" />
          </svg>
        </section>

        <section className="leadership" id="leadership">
          <svg
            className="lead-top-wave"
            viewBox="0 0 1440 90"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M0,0 L0,40 C240,90 480,10 720,50 C960,90 1200,20 1440,55 L1440,0 Z" />
          </svg>

          <div className="lead-inner">
            <motion.div
              className="lead-head"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.35 }}
              variants={fadeUp}
            >
              <span className="section-label">Activities</span>
              <h2>LEADERSHIP &amp; ENGAGEMENT</h2>
              <p>
                Contributing to AI evaluation initiatives, open-source projects,
                and collaborative LLM benchmarking work.
              </p>
            </motion.div>

            <div className="lead-timeline">
              {leadership.map((item, i) => (
                <motion.div
                  key={item.title}
                  className="lead-item"
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    delay: 0.1 * i,
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <article className="lead-card">
                    <span className="lead-badge">{item.badge}</span>
                    <h3>{item.title}</h3>
                    <div className="lead-role">{item.role}</div>
                    <p>{item.body}</p>
                  </article>
                  <span className="lead-dot" aria-hidden="true" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="soft-skills" id="soft-skills">
          <div className="soft-inner">
            <motion.div
              className="soft-head"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.35 }}
              variants={fadeUp}
            >
              <span className="section-label">Core Competencies</span>
              <h2>PROFESSIONAL SOFT SKILLS</h2>
              <p>
                Essential traits that make me an effective engineer, coordinator,
                and communicator.
              </p>
            </motion.div>

            <div className="soft-grid">
              {softSkills.map((skill, i) => (
                <motion.article
                  key={skill.title}
                  className="soft-card"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    delay: 0.05 * i,
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <div className={`soft-icon soft-icon-${skill.icon}`}>
                    <SoftSkillIcon type={skill.icon} />
                  </div>
                  <h3>{skill.title}</h3>
                  <p>{skill.body}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="certs" id="certs">
          <div className="cert-sparks" aria-hidden="true">
            <span className="spark" style={{ top: "18%", left: "8%", width: 18, height: 18 }} />
            <span className="spark" style={{ top: "28%", right: "12%", width: 14, height: 14 }} />
            <span className="spark" style={{ bottom: "22%", left: "18%", width: 12, height: 12 }} />
          </div>
          <div className="container">
            <h2 className="section-title">Certifications</h2>
            <p className="section-copy">
              Industry-recognized credentials that validate hands-on AI and data
              platform expertise.
            </p>
            <div className="cert-grid">
              {certifications.map((cert, i) => (
                <motion.article
                  key={cert.title}
                  className="cert-card"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={fadeUp}
                  custom={i}
                >
                  <div className="cert-icon">
                    <Award size={20} />
                  </div>
                  <div>
                    <h3>{cert.title}</h3>
                    <span>{cert.issuer}</span>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="contact" id="contact">
          <div className="contact-bg-type" aria-hidden="true">
            SURAJ
          </div>
          <div className="container">
            <motion.div
              className="contact-panel"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
            >
              <h2>REACH ME</h2>
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="field">
                  <label htmlFor="firstName">First Name</label>
                  <input id="firstName" name="firstName" required />
                </div>
                <div className="field message">
                  <label htmlFor="message">Type your message here</label>
                  <textarea id="message" name="message" required />
                </div>
                <div className="field">
                  <label htmlFor="lastName">Last Name</label>
                  <input id="lastName" name="lastName" required />
                </div>
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" required />
                </div>
                <label className="consent">
                  <input type="checkbox" required />
                  <span>
                    I give permission to contact me at this email address.
                  </span>
                </label>
                <div className="form-footer">
                  <p className="form-note">
                    Usually replies within 24–48 hours. Or email directly:{" "}
                    <a href={`mailto:${profile.email}`}>{profile.email}</a>
                  </p>
                  <button
                    className="btn btn-outline"
                    type="submit"
                    disabled={formSending}
                  >
                    {formSending ? "Sending…" : "Send Message"}{" "}
                    <ArrowRight size={16} />
                  </button>
                </div>
                {formStatus && (
                  <p className="form-note" style={{ gridColumn: "1 / -1" }}>
                    {formStatus}
                  </p>
                )}
              </form>
            </motion.div>

            <footer className="site-footer">
              <div className="footer-grid">
                <div>
                  <strong>Focus</strong>
                  Generative AI & RAG systems
                  <br />
                  LLM evaluation & agentic workflows
                  <br />
                  Python · LangChain · FastAPI
                </div>
                <div>
                  <strong>Education</strong>
                  MCA — Chandigarh University
                  <br />
                  BCA — Suresh Gyan Vihar University
                  <br />
                  <a href="#projects" style={{ textDecoration: "underline" }}>
                    View Work
                  </a>
                </div>
                <div>
                  <strong>Availability</strong>
                  Open to AI/ML roles & collaborations
                  <br />
                  {profile.location}
                  <br />
                  {profile.phone}
                </div>
              </div>
              <div className="footer-bottom">
                <span>© {new Date().getFullYear()} {profile.name}</span>
                <span>Built to match the portfolio reel aesthetic</span>
              </div>
            </footer>
          </div>
        </section>
      </main>
    </>
  );
}
