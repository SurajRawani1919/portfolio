export const profile = {
  name: "Suraj Kumar Rawani",
  shortName: "Suraj",
  role: "AI/ML Engineer",
  location: "New Delhi, India",
  email: "rawanisuraj1919@gmail.com",
  phone: "+91 7061205601",
  summary:
    "I build Generative AI applications, RAG pipelines, LLM evaluation workflows, and backend services with Python, LangChain, and FastAPI.",
  about:
    "Hi, my name is SURAJ KUMAR RAWANI, an AI/ML Engineer based in New Delhi, India, dedicated to crafting clean, functional, and highly scalable Generative AI applications.",
  linkedin: "https://www.linkedin.com/in/suraj-kumar-rawani-0483b7298/",
  github: "https://github.com/SurajRawani1919",
  instagram: "https://www.instagram.com/suraj_singh1919/",
  photo: import.meta.env.BASE_URL + "photo.png",
  heroPhoto: import.meta.env.BASE_URL + "media/hero-portrait.jpg",
  heroVideo: import.meta.env.BASE_URL + "media/hero-intro.mp4?v=12",
  resume: import.meta.env.BASE_URL + "Suraj_Kumar_Rawani_Resume.pdf",
  // Free key from https://web3forms.com (tied to profile.email)
  web3formsAccessKey: "",
};

export const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export const stackHighlights = [
  { label: "PYTHON", icon: "python" },
  { label: "LANGCHAIN", icon: "langchain" },
  { label: "RAG / LLMs", icon: "rag" },
];

export const skillGroups = [
  {
    title: "Programming & Data",
    items: ["Python", "SQL", "Pandas", "NumPy"],
  },
  {
    title: "Generative AI & NLP",
    items: [
      "Generative AI",
      "LLMs",
      "NLP",
      "RAG",
      "Prompt Engineering",
      "Embeddings",
      "LLM Evaluation",
      "Agentic AI",
    ],
  },
  {
    title: "AI Frameworks",
    items: ["LangChain", "Hugging Face", "FAISS", "Scikit-learn", "Streamlit"],
  },
  {
    title: "Backend & Deployment",
    items: ["FastAPI", "REST APIs", "Docker", "Git/GitHub", "CI/CD", "Linux", "Databricks"],
  },
];

export const processSteps = [
  {
    num: "01",
    title: "Research",
    body: "I start by understanding goals, data constraints, and evaluation criteria to lay a rock-solid foundation for the project.",
    accent: true,
    note: null,
  },
  {
    num: "02",
    title: "Design",
    body: "Crafting clean RAG architectures, prompt strategies, and agent workflows that guarantee measurable, safe, and scalable systems.",
    accent: false,
    note: null,
  },
  {
    num: "03",
    title: "Develop",
    body: "Building scalable backends and interactive AI apps with Python, LangChain, FastAPI, and Streamlit using modern best practices.",
    accent: true,
    note: null,
  },
  {
    num: "04",
    title: "Deploy",
    body: "Rigorous testing, performance optimization, and seamless deployment with Docker and CI/CD, followed by ongoing evaluation support.",
    accent: true,
    note: "Ready to ship!",
  },
];

export const projects = [
  {
    num: "01",
    title: "AgentGuard — Agent Reliability Evaluation",
    body: "Evidence-driven evaluation platform for autonomous AI agents. Multi-stage pipeline verifies tool traces, semantic entailment, and critical failures instead of relying on a single LLM-as-a-Judge pass.",
    tags: ["Python", "Agent Evaluation", "Streamlit", "Trajectories", "Deterministic Verifiers"],
    github: "https://github.com/SurajRawani1919/agentguard-eval",
  },
  {
    num: "02",
    title: "NVIDIA SysBench — LLM Instruction Following",
    body: "Designed multi-turn, constraint-driven evaluation tasks to benchmark LLMs on instruction-following, reasoning stability, and safe refusal — scored with CSR, ISR, and SSR metrics.",
    tags: ["LLM Evaluation", "Prompt Engineering", "Multi-Turn Reasoning", "Alignment"],
    github: null,
  },
  {
    num: "03",
    title: "RAG LLM App (Gemini + Streamlit)",
    body: "Document Q&A with ingestion, embeddings, and vector retrieval. Users upload docs and chat over grounded context via a Streamlit interface powered by LangChain and Gemini/Hugging Face models.",
    tags: ["Python", "LangChain", "FAISS", "Gemini", "Streamlit", "RAG"],
    github:
      "https://github.com/SurajRawani1919/RAG-Retrieval-Augmented-Generation-with-Gemini-Streamlit",
  },
  {
    num: "04",
    title: "Agentic HR Chatbot",
    body: "Planner-based HR assistant that routes between policy RAG (FAISS + citations), public holiday APIs, and direct Gemini answers for general HR questions.",
    tags: ["Agentic AI", "Gemini", "FAISS", "LangChain", "Streamlit"],
    github: "https://github.com/SurajRawani1919/Agentic-HR-Chatbot",
  },
  {
    num: "05",
    title: "Handshake AI — Project Dynamo (Terminal-Bench)",
    body: "Built Dockerized terminal coding tasks for AI agent evaluation — Dockerfile, task.toml, Harbor CLI validation, and automated tests for coding, debugging, and CLI workflows.",
    tags: ["Docker", "AI Evaluation", "CLI", "Python", "Benchmarking"],
    github: "https://github.com/SurajRawani1919/Project-Dynamo-assessment",
  },
  {
    num: "06",
    title: "ATS Resume Analyzer",
    body: "Streamlit ATS tool that parses PDFs, scores resumes against job descriptions with Gemini, and surfaces match insights for hiring workflows.",
    tags: ["Python", "Streamlit", "Gemini", "PyPDF2", "NLP"],
    github: "https://github.com/SurajRawani1919/ATS-Project",
  },
  {
    num: "07",
    title: "Gesture-Controlled 3D",
    body: "Browser hand-tracking demo: MediaPipe landmarks drive a Three.js scene — dual-hand gestures to move objects and swipe between visual modes via webcam.",
    tags: ["JavaScript", "Three.js", "MediaPipe", "WebGL", "Vite"],
    github: "https://github.com/SurajRawani1919/gesture-controlled-3d",
  },
  {
    num: "08",
    title: "NLP Automation Studio",
    body: "End-to-end Streamlit NLP pipeline — upload data, stem/lemmatize, vectorize (Count/TF-IDF), train Naive Bayes, and visualize confusion matrices, word clouds, and sentiment.",
    tags: ["Python", "Streamlit", "NLTK", "Scikit-learn", "NLP"],
    github: "https://github.com/SurajRawani1919/nlp-automation",
  },
];

export const experience = [
  {
    badge: "Full-time",
    title: "AI/ML Engineer",
    org: "JUPITER AI LABS, NOIDA",
    dates: "SEP 2025 — PRESENT",
    skills: [
      "Machine Learning",
      "Data Pipelines",
      "Model Evaluation",
      "Backend Services",
    ],
    tech: ["Python", "SQL", "Docker", "Databricks", "Git"],
  },
  {
    badge: "Internship",
    title: "Data Scientist Intern",
    org: "REGEX SOFTWARE SERVICES, JAIPUR",
    dates: "NOV 2024 — MAY 2025",
    skills: [
      "Data Collection",
      "Preprocessing",
      "Data Analysis",
      "ML Workflows",
    ],
    tech: ["Python", "SQL", "Pandas", "NumPy"],
  },
  {
    badge: "Contract",
    title: "AI Evaluation — Project Dynamo",
    org: "HANDSHAKE AI",
    dates: "JUL 2026 — OCT 2026",
    skills: [
      "Agent Benchmarking",
      "Task Design",
      "Docker Environments",
      "Automated Testing",
    ],
    tech: ["Python", "Docker", "Harbor CLI", "CLI"],
  },
];

export const education = [
  {
    title: "MCA — Chandigarh University",
    meta: "Jun 2025 — Expected 2027",
  },
  {
    title: "BCA — Suresh Gyan Vihar University",
    meta: "Jun 2022 — Apr 2025",
  },
];

export const leadership = [
  {
    badge: "Contract",
    title: "Handshake AI — Project Dynamo",
    role: "AI EVALUATION CONTRIBUTOR",
    body: "Designed Dockerized Terminal-Bench tasks for AI agent evaluation, including automated tests, Harbor CLI validation, and instruction-following scenarios.",
  },
  {
    badge: "Open Source",
    title: "Public AI/ML Repositories",
    role: "BUILDER & MAINTAINER",
    body: "Published and maintained RAG apps, agentic chatbots, and NLP tools on GitHub to share practical Generative AI workflows with the developer community.",
  },
  {
    badge: "Community",
    title: "LLM Evaluation & Agentic AI Practice",
    role: "PEER COLLABORATOR",
    body: "Collaborated on LLM instruction-following benchmarks and agent reliability evaluation workflows, focusing on measurable, reproducible AI systems.",
  },
];

export const softSkills = [
  {
    title: "Leadership",
    icon: "leadership",
    body: "Guiding teams, managing tasks, and driving project completion with shared vision.",
  },
  {
    title: "Public Speaking",
    icon: "speaking",
    body: "Confident stage presence — delivering articulate technical ideas in demos and reviews.",
  },
  {
    title: "Team Collaboration",
    icon: "collab",
    body: "Collaborating across fields — shipping RAG systems, agents, and evaluation pipelines in sync.",
  },
  {
    title: "Communication",
    icon: "comms",
    body: "Clear, concise, and structured interactions in both business and technical contexts.",
  },
  {
    title: "Problem Solving",
    icon: "solve",
    body: "Breaking down complex AI failures into measurable checks, root causes, and reliable fixes.",
  },
  {
    title: "Adaptability",
    icon: "adapt",
    body: "Learning new models, tools, and frameworks quickly as Generative AI workflows evolve.",
  },
  {
    title: "Attention to Detail",
    icon: "detail",
    body: "Careful prompt design, constraint checks, and evaluation criteria that keep systems trustworthy.",
  },
  {
    title: "Time Management",
    icon: "time",
    body: "Balancing research, development, and delivery so projects ship on schedule without cutting quality.",
  },
];

export const certifications = [
  {
    title: "Fine-Tuning for LLMs: from Beginner to Advanced",
    issuer: "LinkedIn — March 2026",
  },
  {
    title:
      "Advanced LLMs with Retrieval Augmented Generation (RAG): Practical Projects for AI Applications",
    issuer: "LinkedIn — February 2026",
  },
  {
    title: "Intro to Snowflake for Devs, Data Scientists, Data Engineers",
    issuer: "LinkedIn — February 2026",
  },
  {
    title: "Databricks Fundamentals Accreditation",
    issuer: "Databricks",
  },
];
