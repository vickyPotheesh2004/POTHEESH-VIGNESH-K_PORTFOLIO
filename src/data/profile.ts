/**
 * Profile content.
 *
 * PROVENANCE RULE: every claim below is tagged with where it came from.
 *  - "resume"    → stated on Potheesh Vignesh K's own résumé (self-reported)
 *  - "repo"      → verifiable in a public repository he owns
 *  - "verified"  → directly checked by the person building this site
 * Nothing here is invented, and self-reported figures are never presented as
 * independently measured.
 */

export type Provenance = "resume" | "repo" | "verified";

export const ABOUT = {
  /** The user asked About Me to open with this exact framing. */
  lead: "Aspiring AI/ML Engineer.",
  subhead:
    "I build local-first AI systems — hybrid retrieval, multi-agent reasoning, and deterministic verification — and I publish the source behind every claim on this site.",

  paragraphs: [
    "I am an aspiring AI/ML engineer and solo AI researcher, graduating in June 2026 with a B.E. in Electronics & Communication Engineering from R.M.K. Engineering College. My route into AI was not the usual one: I came through electronics, chip architecture seminars and signal problems, and the thing that pulled me into machine learning was the same instinct — I wanted to measure whether a system actually works, not listen to it tell me it does.",
    "That instinct shaped how I build. My work clusters around three ideas. First, retrieval should be hybrid, because dense embeddings miss exact figures and keyword search misses paraphrase — the systems I build run both and fuse the results. Second, a language model is an orchestrator, not an oracle, so arithmetic, extraction and verification belong in deterministic, tested code that the model calls rather than guesses at. Third, if a number cannot be traced to a source, it should not be presented as an answer — several of my projects abstain rather than fabricate.",
    "I have worked as an AI intern at Tata Consultancy Services, building a multi-modal document analysis and retrieval system, and as an AI/ML intern at Infosys Springboard, building a multilingual podcast transcription and topic-segmentation pipeline. Alongside that I maintain a growing set of open-source projects — an evidence-driven financial exception investigation system, a multi-agent financial analyst built on a 19-node pipeline, a monsoon safety companion, a print hub, and eight deterministic Python libraries published as part of the FinBench stack.",
    "In parallel I am an IEEE-published researcher, with two conference papers on AGI-assisted drone systems and MEC/MFA-based wearable health monitoring.",
    "What I am honest about: I am early in my career. My strongest evidence is working repositories, tests and documentation, not years on a payroll. Where a result is self-reported or came out of a hackathon rather than an independent benchmark, this site says so plainly, on the same line as the number.",
  ],

  /** The workspace / how-I-work image, second reference image. */
  workspaceCaption:
    "The desk the projects on this site were actually built at — dual displays, oscilloscope-era habits, and a lot of terminal output.",

  principles: [
    {
      title: "Retrieval over recall",
      body: "Answers must be grounded in a traceable source — a document, a filing, a sensor reading — with the reference shown alongside the result.",
    },
    {
      title: "Deterministic where it counts",
      body: "Maths, extraction and verification live in tested Python functions. The model coordinates; it does not do the arithmetic that matters.",
    },
    {
      title: "Abstain rather than invent",
      body: "When evidence is incomplete or conflicting, the correct output is a flagged gap for a human, not a confident guess.",
    },
    {
      title: "Local-first by default",
      body: "Several of these systems run entirely offline on consumer hardware — zero API cost, and confidential documents never leave the machine.",
    },
    {
      title: "Label the evidence",
      body: "Self-reported résumé figures, hackathon claims and independently verifiable repository facts are never allowed to look like the same thing.",
    },
    {
      title: "Human keeps the decision",
      body: "High-impact actions stay under human control. The systems surface, explain and route; a person decides.",
    },
  ],

  /** Quick-fact datasheet rendered beside the portrait. */
  facts: [
    { label: "Based in", value: "SriKalahasti, Andhra Pradesh, India" },
    { label: "Graduating", value: "June 2026 — B.E. Electronics & Communication" },
    { label: "Focus", value: "RAG, agentic AI, LLM evaluation, local inference" },
    { label: "Currently", value: "AI intern at Tata Consultancy Services" },
    { label: "Also", value: "Solo AI researcher and open-source author" },
    { label: "Working languages", value: "English, Telugu, Hindi, Tamil" },
  ],
} as const;

export interface SkillGroup {
  title: string;
  /** Where this list is evidenced. */
  provenance: Provenance;
  note?: string;
  items: string[];
}

export const SKILLS: SkillGroup[] = [
  {
    title: "Languages",
    provenance: "resume",
    items: ["Python"],
  },
  {
    title: "AI / ML frameworks & services",
    provenance: "resume",
    items: [
      "LangChain",
      "LangGraph",
      "LlamaIndex",
      "Hugging Face",
      "SBERT",
      "Whisper ASR",
      "BM25",
      "ChromaDB",
      "OpenRouter",
      "OpenAI API",
      "Anthropic API",
      "Gemini API",
    ],
  },
  {
    title: "NLP & machine learning",
    provenance: "resume",
    items: [
      "Retrieval-augmented generation",
      "Fine-tuning",
      "LLM evaluation",
      "Semantic search",
      "Topic segmentation",
      "Named entity recognition",
      "Text classification",
      "SHAP explainability",
      "Monte Carlo simulation",
      "TF-IDF",
      "Cross-encoder reranking",
      "Reinforcement learning",
    ],
  },
  {
    title: "Agentic AI",
    provenance: "resume",
    items: [
      "Multi-agent systems",
      "Prompt engineering",
      "Planner–Implementor–Validator architecture",
      "Autonomous AI workflows",
    ],
  },
  {
    title: "Application & developer tooling",
    provenance: "resume",
    items: [
      "FastAPI",
      "Flask",
      "Git",
      "Streamlit",
      "Firebase",
      "n8n",
      "Google Opal",
    ],
  },
  {
    title: "Open-source LLMs",
    provenance: "resume",
    items: ["LLaMA", "Mistral", "BGE-M3"],
  },
  {
    title: "Evidenced in public repositories",
    provenance: "repo",
    note: "Additional stacks visible in shipped source, beyond the résumé list.",
    items: [
      "Next.js 15 App Router",
      "React 19",
      "TypeScript",
      "Tailwind CSS v4",
      "Vite",
      "Three.js",
      "Leaflet",
      "SQLite",
      "Docker",
      "Vitest",
      "pytest",
      "PyPI packaging",
      "Cloudflare / Vercel deployment",
    ],
  },
];

export interface ExperienceEntry {
  role: string;
  org: string;
  period: string;
  location?: string;
  provenance: Provenance;
  summary: string;
  highlights: string[];
  /** Figures that come from the résumé rather than a peer-reviewed measurement. */
  reportedFigures?: string[];
}

export const EXPERIENCE: ExperienceEntry[] = [
  {
    role: "Artificial Intelligence Intern",
    org: "Tata Consultancy Services",
    period: "Feb 2026 – Present",
    provenance: "resume",
    summary:
      "Built a production-grade multi-modal document analysis system that turns unstructured files into a searchable NLP knowledge base, then deployed it behind a REST API.",
    highlights: [
      "Architected a multi-modal ingestion pipeline covering PDF, DOCX, images, CSV and Excel, transforming unstructured files into a searchable knowledge base.",
      "Engineered hybrid retrieval combining ChromaDB semantic vector search with BM25 keyword indexing for large document collections.",
      "Designed an intent-classification layer routing each query to one of four workflows: document Q&A, insight generation, improvement analysis, and IEEE paper generation.",
      "Deployed the full pipeline as a REST API using FastAPI.",
    ],
    reportedFigures: [
      "Response quality improved by 40% using multi-LLM orchestration through OpenRouter — self-reported, not an independently measured benchmark.",
    ],
  },
  {
    role: "AI / ML Intern",
    org: "Infosys Springboard",
    period: "Dec 2025 – Feb 2026",
    provenance: "resume",
    summary:
      "Built an end-to-end NLP pipeline converting podcast audio into timestamped, topic-segmented transcripts with multilingual support.",
    highlights: [
      "Built an end-to-end NLP pipeline using Whisper ASR, SBERT and TF-IDF to produce timestamped, topic-segmented transcripts.",
      "Designed hybrid topic segmentation combining semantic drift detection with lexical divergence analysis.",
      "Implemented multilingual support — language detection, translation and Roman transliteration — across four or more languages.",
      "Built a Streamlit interface with keyword search, auto-navigation and per-segment translation.",
    ],
    reportedFigures: [
      "Manual podcast review time reduced by 60% — self-reported, not an independently measured benchmark.",
    ],
  },
];

export const EDUCATION = {
  degree: "B.E. Electronics & Communication Engineering",
  institution: "R.M.K. Engineering College, Tamil Nadu",
  period: "Expected graduation: June 2026",
  detail: "CGPA 6.6 / 10",
  earlier: [
    "Class 12 — 68%, Narayana, Andhra Pradesh (2022)",
    "Class 10 — 61%, Velammal Bodhi Campus (2020)",
  ],
} as const;

export interface Publication {
  title: string;
  venue: string;
  year: string;
  authors: string;
  kind: "conference" | "journal";
  note?: string;
}

export const PUBLICATIONS: Publication[] = [
  {
    title:
      "Defence System Enhancement by Portable Drones Using Artificial General Intelligence (AGI)",
    venue: "IEEE ICEC2NT",
    year: "2025",
    authors: "Potheesh Vignesh K",
    kind: "conference",
  },
  {
    title:
      "AI-based Health Monitoring Wearable Device in Telemedicine using MEC and MFA Technology",
    venue: "IEEE ICCCSMD",
    year: "2025",
    authors: "Potheesh Vignesh K",
    kind: "conference",
  },
];

export const CERTIFICATIONS = [
  { name: "Foundations of Prompt Engineering", issuer: "AWS", date: "Aug 2024" },
  {
    name: "Google Startup School: Prompt to Prototype",
    issuer: "Google",
    date: "Dec 2025",
  },
  { name: "OpenAI GPT-3 for Developers", issuer: "Infosys", date: "Feb 2025" },
  { name: "AI-first Software Engineering", issuer: "Infosys", date: "Feb 2025" },
  { name: "Introduction to Deep Learning", issuer: "Infosys", date: "Jan 2025" },
  {
    name: "Introduction to Artificial Intelligence",
    issuer: "Infosys",
    date: "Jan 2025",
  },
  { name: "Mastering Python", issuer: "Infosys", date: "Jan 2025" },
];

export const COMMUNITY = [
  {
    name: "Google Developer Program",
    role: "Generative AI contributor",
  },
  {
    name: "Vibe Coding & Innovation Club India",
    role: "Member",
  },
  {
    name: "DEV++ Community",
    role: "Open-source AI collaboration",
  },
];

export const SPOKEN_LANGUAGES = [
  { name: "English", level: "Professional" },
  { name: "Telugu", level: "Native" },
  { name: "Hindi", level: "Proficient" },
  { name: "Tamil", level: "Proficient" },
];

export interface Service {
  slug: string;
  title: string;
  summary: string;
  deliverables: string[];
  /** The honest hard requirement — what this needs from the client to work. */
  needs: string[];
  /** Verified proof from his own repositories. */
  evidence: string;
}

export const SERVICES: Service[] = [
  {
    slug: "rag-systems",
    title: "Retrieval-augmented systems",
    summary:
      "Document intelligence that actually cites its sources — hybrid vector plus keyword retrieval over your own files, with the reference shown next to every answer.",
    deliverables: [
      "Multi-format ingestion (PDF, DOCX, spreadsheets, images with OCR)",
      "Hybrid index combining dense vectors with BM25 keyword search",
      "Query intent routing so different questions hit different workflows",
      "Grounded answers with the source document and location attached",
      "Deployment as a REST API or an internal Streamlit interface",
    ],
    needs: [
      "A representative sample of your real documents",
      "A definition of what a correct answer looks like",
    ],
    evidence:
      "AI Document Q&A System — ChromaDB + BM25 hybrid index over 10+ file types, with a local-LLM routing layer.",
  },
  {
    slug: "agentic-pipelines",
    title: "Agentic and multi-agent pipelines",
    summary:
      "Multi-step reasoning pipelines where each stage has a defined job, a validation step, and an explainable failure path instead of one long prompt hoping for the best.",
    deliverables: [
      "Pipeline design with explicit stages and hand-off contracts",
      "Planner–Implementor–Validator separation so work is checked, not assumed",
      "Structured output with schema validation and retry handling",
      "Per-stage instrumentation so you can see where a run went wrong",
      "Documented architecture diagram and stage-by-stage rationale",
    ],
    needs: [
      "The decision or workflow being automated, described step by step",
      "Examples of good and bad outputs",
    ],
    evidence:
      "FinBench Multi-Agent Business Analyst — a 19-node pipeline with hybrid retrieval, validation layers and structured grounding.",
  },
  {
    slug: "local-private-ai",
    title: "Local and private AI deployment",
    summary:
      "AI that runs on your own hardware. No per-query API bill, and documents that legally cannot leave your network never leave it.",
    deliverables: [
      "Local model selection matched to the hardware you actually have",
      "Fully offline inference for confidential documents",
      "Health monitoring so you can see when the local model is unavailable",
      "Cost analysis against the cloud API you would otherwise pay for",
    ],
    needs: [
      "Access details for the target machine (GPU, RAM, OS)",
      "Confirmation of which data is not permitted to leave the network",
    ],
    evidence:
      "AI Document Q&A System routes work across three local models (Llama 3.1 8B, Qwen 2.5 3B, Gemma 3 4B) through Ollama at zero API cost.",
  },
  {
    slug: "llm-evaluation",
    title: "LLM evaluation and verification harnesses",
    summary:
      "The part most AI projects skip: proving the system is right. Deterministic checks, abstention rules, and an honest report of where accuracy actually lands.",
    deliverables: [
      "Test suites over real question/answer pairs",
      "Deterministic verification of extracted figures against source documents",
      "Abstention logic so the system flags uncertainty instead of guessing",
      "An accuracy report that states its own limits and sample size",
    ],
    needs: [
      "A ground-truth set, or the raw documents needed to build one",
      "Agreement on the accuracy bar that counts as acceptable",
    ],
    evidence:
      "fina-verify-lib — a deterministic financial answer verification and abstention engine, part of the FinBench stack.",
  },
  {
    slug: "speech-audio",
    title: "Speech and audio intelligence",
    summary:
      "Turn recordings into structured, searchable knowledge — transcription, topic segmentation, and navigation that makes a long audio file usable.",
    deliverables: [
      "Speech-to-text with word-level timestamps",
      "Topic segmentation with generated titles for each segment",
      "Multilingual handling including transliteration",
      "Search and click-to-navigate across the transcript",
    ],
    needs: [
      "Sample recordings in the languages and audio conditions you care about",
      "An indication of what the end user needs to find quickly",
    ],
    evidence:
      "LEXARA AI and the AI Automated Podcast Transcription system — Whisper Small transcription with hybrid semantic plus lexical topic segmentation across 4+ languages.",
  },
  {
    slug: "ai-web-apps",
    title: "AI web applications",
    summary:
      "The interface layer that makes a model usable by people who will never open a terminal — built with the same evidence discipline as the backend.",
    deliverables: [
      "Responsive front end with accessible dark and light themes",
      "AI features wired to real endpoints, never faked interfaces",
      "Honest loading, empty, error and not-configured states",
      "Deployment with SEO, metadata and analytics configured",
    ],
    needs: [
      "Who the users are and on what devices",
      "Any brand, colour or typography constraints",
    ],
    evidence:
      "VarshaAI (Next.js 15, React 19, Tailwind v4, live on Vercel) and Arome Haven (React, TypeScript, Vite, Docker).",
  },
  {
    slug: "automation-tooling",
    title: "Python automation and packaging",
    summary:
      "The unglamorous work that saves hours: deterministic libraries, file and document pipelines, and local tools packaged so other people can install them.",
    deliverables: [
      "Reusable Python packages with a clean public API",
      "Test suites covering the failure cases, not just the happy path",
      "Packaging and publishing so the library installs with one command",
      "Documentation that explains why the code exists, not just what it does",
    ],
    needs: [
      "The manual process being replaced, with its current edge cases",
      "The environment the tool has to run in",
    ],
    evidence:
      "Eight published FinBench libraries — including fina-maths-lib with 1500 deterministic formulas and fina-algo-lib covering valuation, risk and time-series routines.",
  },
];
