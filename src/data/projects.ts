/**
 * Project catalogue.
 *
 * PROVENANCE RULE — every figure carries an `evidence` tag:
 *  - "verified" → checked first-hand by the person building this site (URL resolves,
 *                 package exists on PyPI, file present in the repository tree)
 *  - "reported" → stated by the project's own README / résumé / hackathon submission.
 *                 Presented as a claim, never as an independent measurement.
 *  - "proposed" → not built yet. Lives under future work only.
 *
 * Projects deliberately excluded at Potheesh Vignesh K's request: FundLink,
 * FundLink---prod, FPGA_ARCH_demo, and the NeetCode submissions repository.
 */

export type Evidence = "verified" | "reported" | "proposed";

export type ProjectStatus =
  | "shipped"
  | "in-development"
  | "prototype"
  | "documented-design";

export interface ProjectLink {
  label: string;
  href: string;
  kind: "repo" | "live" | "package";
}

export interface PipelineStage {
  /** Mono index, e.g. "01". */
  id: string;
  name: string;
  detail: string;
  /** Drives the diagram accent colour. */
  role: "input" | "process" | "reasoning" | "validation" | "output";
}

export interface DataFlowStep {
  from: string;
  to: string;
  payload: string;
}

export interface ResultRow {
  label: string;
  value: string;
  evidence: Evidence;
  source: string;
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  /** Short category used on cards and the datasheet. */
  category: string;
  year: string;
  status: ProjectStatus;
  /** Explains the status honestly when it is not simply "shipped". */
  statusNote: string;
  featured: boolean;
  /** Sort order on the projects index. Lower = earlier. */
  order: number;
  role: string;
  summary: string[];
  problem: string;
  audience: string;
  constraints: string[];
  approach: string[];
  stack: string[];
  pipeline: PipelineStage[];
  dataFlow: DataFlowStep[];
  techniques: string[];
  implementation: { title: string; detail: string }[];
  verification: { title: string; detail: string }[];
  results: ResultRow[];
  limitations: string[];
  futureWork: string[];
  /** Honest scope warning — required for anything with published-only designs. */
  caveat?: string;
  links: ProjectLink[];
  video?: {
    src: string;
    poster: string;
    caption: string;
    /**
     * "confirmed" → the recording's content matches this project's implementation.
     * "inferred"  → matched by filename and subject only; flagged for review.
     */
    confidence: "confirmed" | "inferred";
  };
  related: string[];
}

export const PROJECTS: Project[] = [
  /* ------------------------------------------------------------------ 01 */
  {
    slug: "finbench",
    title: "FinBench — Multi-Agent Business Analyst",
    tagline:
      "A fully local multi-agent system that extracts, debates and explains financial figures directly from SEC 10-K filings.",
    category: "Agentic AI · Financial reasoning",
    year: "2026",
    status: "in-development",
    statusNote:
      "The repository is public and under active development. The benchmark evaluation is described as in progress, so the accuracy figure below is the project's own reported number rather than a finished external benchmark.",
    featured: true,
    order: 1,
    role: "Solo — architecture, implementation, test suite, documentation",
    summary: [
      "FinBench answers natural-language questions about company filings and returns not just a number, but a confidence value, the underlying GAAP concept, and a reference into the filing it came from. It runs entirely on local hardware with no API cost.",
      "The defining design choice is that the language model orchestrates rather than computes. Extraction, arithmetic, verification and formatting are delegated to eight deterministic Python libraries, so an answer can be traced and reproduced instead of being assembled from model recall.",
    ],
    problem:
      "Financial question answering over filings fails in a specific way: the model produces a plausible number that is subtly the wrong one. Filings are full of near-identical metrics — revenue against deferred revenue, GAAP against non-GAAP variants, footnotes that read like headline figures, and units that change between tables. A single-prompt retrieval system has no mechanism to notice that it picked the wrong line.",
    audience:
      "Financial analysts and operations teams who need answers they can audit, and engineering teams constrained to on-premise or zero-API-cost infrastructure.",
    constraints: [
      "No cloud inference — the whole pipeline must run offline on consumer hardware.",
      "Answers must be reproducible; the project pins a seed so runs can be replayed.",
      "Every numeric answer needs a citable reference into the source filing.",
      "Arithmetic must not be performed in prompt space.",
    ],
    approach: [
      "Retrieval is hybrid: BM25 keyword search for exact figures, dense BGE-M3 embeddings for paraphrase, fused with reciprocal rank fusion and reranked.",
      "A 19-node pipeline separates the work into planning, implementation and validation stages rather than one long prompt.",
      "The Planner–Implementor–Validator structure means an answer must survive an independent check before it is returned.",
      "Deterministic libraries own extraction, formula execution, verification and rendering; the model's job is routing and explanation.",
      "Low confidence or conflicting evidence triggers abstention rather than a guess.",
    ],
    stack: [
      "Python 3.11+",
      "LangGraph",
      "BM25",
      "BGE-M3 embeddings",
      "Llama 3.1 8B (local)",
      "SHAP",
      "Monte Carlo simulation",
      "FastAPI",
      "pytest",
    ],
    pipeline: [
      {
        id: "01",
        name: "Ingest filing",
        detail: "SEC 10-K document plus iXBRL numeric facts are loaded and normalised.",
        role: "input",
      },
      {
        id: "02",
        name: "Structure detection",
        detail: "Tables, footnotes and narrative sections are separated so headline figures are not confused with mentions.",
        role: "process",
      },
      {
        id: "03",
        name: "Index build",
        detail: "BM25 keyword index and dense embedding index are built over the same chunks.",
        role: "process",
      },
      {
        id: "04",
        name: "Query planning",
        detail: "The planner decomposes the question into the metric being asked for and the period it applies to.",
        role: "reasoning",
      },
      {
        id: "05",
        name: "Hybrid retrieval",
        detail: "Exact-figure and semantic searches run in parallel and are fused with reciprocal rank fusion.",
        role: "process",
      },
      {
        id: "06",
        name: "Rerank",
        detail: "Candidate passages are reranked so the most likely source table reaches the reasoning stage first.",
        role: "process",
      },
      {
        id: "07",
        name: "Deterministic extraction",
        detail: "fina_extractor_lib pulls candidate values and rejects footnote and narrative traps.",
        role: "validation",
      },
      {
        id: "08",
        name: "Formula execution",
        detail: "fina_maths_lib evaluates derived metrics from tested functions instead of model arithmetic.",
        role: "validation",
      },
      {
        id: "09",
        name: "Algorithm lookups",
        detail: "fina_algo_lib supplies valuation, risk and time-series routines where the question needs them.",
        role: "process",
      },
      {
        id: "10",
        name: "Evidence assembly",
        detail: "The candidate answer is bound to its source reference and the iXBRL fact it came from.",
        role: "process",
      },
      {
        id: "11",
        name: "Verification",
        detail: "fina_verify_lib independently checks the answer against the extracted evidence and can abstain.",
        role: "validation",
      },
      {
        id: "12",
        name: "Explanation layer",
        detail: "SHAP attribution and causal DAG views explain which inputs moved the result.",
        role: "output",
      },
      {
        id: "13",
        name: "Format and render",
        detail: "fina_format_lib renders the answer with confidence, concept and reference attached.",
        role: "output",
      },
    ],
    dataFlow: [
      {
        from: "10-K filing (PDF / iXBRL)",
        to: "Ingestion and structure detection",
        payload: "Raw text, tables, footnotes, numeric facts with period context",
      },
      {
        from: "Ingestion",
        to: "BM25 + dense index",
        payload: "Chunked passages with source offsets and section labels",
      },
      {
        from: "Natural-language question",
        to: "Planner node",
        payload: "Metric intent and target period",
      },
      {
        from: "Planner",
        to: "Hybrid retriever",
        payload: "Keyword query plus embedding query, issued in parallel",
      },
      {
        from: "Hybrid retriever",
        to: "Extraction library",
        payload: "Ranked candidate passages with provenance offsets",
      },
      {
        from: "Extraction library",
        to: "Verification library",
        payload: "Candidate numeric value, unit, period and source reference",
      },
      {
        from: "Verification library",
        to: "Answer renderer",
        payload: "Accepted value with confidence, or an explicit abstention",
      },
      {
        from: "Answer renderer",
        to: "Caller",
        payload: "Answer, confidence, GAAP concept, filing reference, execution time",
      },
    ],
    techniques: [
      "Hybrid retrieval (BM25 + dense embeddings)",
      "Reciprocal rank fusion",
      "Cross-encoder reranking",
      "Planner–Implementor–Validator agent separation",
      "Structured output with schema validation and retry",
      "Deterministic tool execution over model arithmetic",
      "Explanation via SHAP attribution",
      "Seed-pinned reproducibility",
    ],
    implementation: [
      {
        title: "The model is not allowed to do sums",
        detail:
          "Formula evaluation is moved out of the prompt and into fina_maths_lib, a library of individually implemented and tested functions. The agent calls a function; it does not estimate the arithmetic.",
      },
      {
        title: "Eight libraries instead of one large codebase",
        detail:
          "Extraction, maths, algorithms, logic rules, patterns, verification, formatting and question handling are separate installable packages, each independently testable and versioned.",
      },
      {
        title: "Grounding on iXBRL rather than prose",
        detail:
          "The pipeline prefers machine-readable numeric facts over narrative mentions, which is what makes the returned reference meaningful.",
      },
      {
        title: "Validation as a pipeline stage, not an afterthought",
        detail:
          "Verification is a node with the authority to reject the upstream answer, not a final formatting step.",
      },
    ],
    verification: [
      {
        title: "Test suite",
        detail:
          "The repository advertises 128+ passing tests covering the pipeline and the deterministic libraries.",
      },
      {
        title: "Reproducibility controls",
        detail:
          "Runs are seed-pinned so results can be replayed, which is a prerequisite for trusting an accuracy number at all.",
      },
      {
        title: "Abstention path",
        detail:
          "fina_verify_lib exists specifically to refuse an answer when evidence is insufficient or contradictory.",
      },
    ],
    results: [
      {
        label: "Reported accuracy",
        value: "84.2%",
        evidence: "reported",
        source: "Repository README badge, benchmark described as in progress",
      },
      {
        label: "Reported tests",
        value: "128+ passing",
        evidence: "reported",
        source: "Repository README badge",
      },
      {
        label: "Pipeline size",
        value: "19 nodes",
        evidence: "reported",
        source: "README states 19 nodes; the repository description says 20 — see limitations",
      },
      {
        label: "Inference cost",
        value: "$0 — fully local",
        evidence: "reported",
        source: "README claim; consistent with the stated local-model design",
      },
    ],
    limitations: [
      "The 84.2% figure is the project's own reported number and the README states the benchmark evaluation is still in progress. It has not been reproduced against an independent harness.",
      "The README describes a 19-node pipeline while the repository description says 20 nodes. The count has not been reconciled.",
      "Local-only inference caps answer quality at what the chosen 8B-class model can route and explain.",
      "Coverage is bounded by the deterministic libraries: a question needing a formula that is not implemented cannot be answered.",
      "Financial filings are long and structured; the extraction layer is tuned to that shape and is not a general document reader.",
    ],
    futureWork: [
      "Complete and publish the benchmark evaluation with a stated sample size and evaluation harness.",
      "Reconcile the node count and publish the full pipeline graph as a versioned diagram.",
      "Extend extraction beyond 10-K filings to other filing types.",
      "Add an evaluation dashboard that tracks accuracy per question category over time.",
    ],
    caveat:
      "This is research and engineering work, not a licensed financial product. It produces analysis grounded in filings; it does not give investment advice.",
    links: [
      {
        label: "Source repository",
        href: "https://github.com/vickyPotheesh2004/finbench_agent-Multi_Agent_Business_Analyst_System",
        kind: "repo",
      },
    ],
    video: {
      src: "/videos/finbench.mp4",
      poster: "/videos/posters/finbench.jpg",
      caption: "Pipeline walkthrough — asking a filing question and inspecting the grounded answer.",
      confidence: "confirmed",
    },
    related: ["fina-suite", "researchhelp", "causa"],
  },

  /* ------------------------------------------------------------------ 02 */
  {
    slug: "causa",
    title: "Causa — Financial Exception Resolution",
    tagline:
      "An evidence-driven investigation system for payment exceptions, built so that no decision is made without a traceable audit trail.",
    category: "Fintech · Case management",
    year: "2026",
    status: "prototype",
    statusNote:
      "Runs as a local demonstration against synthetic data. The repository states that production deployment, real data and identity are the deploying company's responsibility, and the server refuses to bind off loopback.",
    featured: true,
    order: 2,
    role: "Solo — system design, implementation, audit model, documentation",
    summary: [
      "Payment operations teams reconcile information scattered across payment, fee, refund, settlement, adjustment and bank sources. Causa normalises those records into immutable financial events, detects exceptions, builds an explainable risk assessment, routes the case to the right department, and keeps a tamper-evident audit trail.",
      "The discipline that matters here is what the system refuses to do. It performs no payment action, holds no funds, and never declares fraud. High-impact decisions stay with a human, and when no AI provider is configured the output is explicitly labelled as a deterministic fallback rather than being dressed up as model analysis.",
    ],
    problem:
      "When a payment discrepancy appears, the hard part is not spotting it — it is connecting the evidence, recognising that the same issue was already reported, explaining why the risk score is what it is, and preserving a chain of custody that survives an audit. Spreadsheets and ticket queues lose those links.",
    audience:
      "Financial operations and reconciliation teams in regulated environments where auditability is a hard requirement rather than a nice-to-have.",
    constraints: [
      "No payment movement and no funds held — the system investigates, it does not transact.",
      "No fraud declarations; risk is expressed as explainable factors for human review.",
      "Records must be tenant-scoped so one customer's cases cannot leak into another's.",
      "The system must remain useful with no AI provider available at all.",
    ],
    approach: [
      "Normalise every source record into an immutable financial event carrying a SHA-256 content hash.",
      "Detect exception classes across settlement, fee, refund, adjustment, bank, timing, duplicate and suspicious-activity categories.",
      "Build a case from the normalised evidence so a reviewer sees the full chain, not one row.",
      "Score risk and, critically, explain the contributing factors and the routing rule behind each decision.",
      "Escalate incomplete, conflicting, repeat and suspicious cases to a human rather than resolving them silently.",
      "Hash-chain audit events per tenant, with an admin integrity check endpoint to verify the chain.",
    ],
    stack: [
      "Python 3.11+",
      "SQLite",
      "Local HTTP API (loopback only)",
      "SHA-256 content hashing",
      "Optional OpenRouter models",
      "Synthetic Razorpay-shaped sample data",
    ],
    pipeline: [
      {
        id: "01",
        name: "Source ingestion",
        detail: "Payment, fee, refund, settlement, adjustment and bank records are loaded and normalised.",
        role: "input",
      },
      {
        id: "02",
        name: "Immutable event store",
        detail: "Each record becomes an event with a SHA-256 content hash, so later edits are detectable.",
        role: "process",
      },
      {
        id: "03",
        name: "Exception detection",
        detail: "Eight categories are checked, including timing, duplicate and suspicious activity.",
        role: "process",
      },
      {
        id: "04",
        name: "Case assembly",
        detail: "Related events are grouped into a tenant-scoped case with a usable evidence chain.",
        role: "process",
      },
      {
        id: "05",
        name: "Explainable risk scoring",
        detail: "Risk factors are surfaced individually and mapped to the routing rule that uses them.",
        role: "reasoning",
      },
      {
        id: "06",
        name: "Investigation narrative",
        detail: "An LLM may draft the investigation if configured; otherwise deterministic fallback output is clearly labelled as such.",
        role: "reasoning",
      },
      {
        id: "07",
        name: "Human escalation gate",
        detail: "Incomplete, conflicting, repeat and suspicious cases are escalated instead of auto-resolved.",
        role: "validation",
      },
      {
        id: "08",
        name: "Department routing",
        detail: "The case is routed to the owning team with the reason for that route attached.",
        role: "output",
      },
      {
        id: "09",
        name: "Hash-chained audit",
        detail: "Audit events are chained per tenant; an admin endpoint verifies chain integrity.",
        role: "output",
      },
      {
        id: "10",
        name: "Resolution verification",
        detail: "A submitted resolution is verified against the original evidence before the case closes.",
        role: "validation",
      },
    ],
    dataFlow: [
      {
        from: "Source record feeds",
        to: "Normalisation",
        payload: "Payment, fee, refund, settlement, adjustment and bank rows",
      },
      {
        from: "Normalisation",
        to: "Immutable event store",
        payload: "Normalised event with SHA-256 content hash",
      },
      {
        from: "Event store",
        to: "Exception detector",
        payload: "Tenant-scoped events with timestamps and amounts",
      },
      {
        from: "Exception detector",
        to: "Case builder",
        payload: "Flagged exceptions with the category that triggered them",
      },
      {
        from: "Case builder",
        to: "Risk scorer",
        payload: "Case with linked evidence and repeat-report history",
      },
      {
        from: "Risk scorer",
        to: "Escalation gate",
        payload: "Risk factors, score and the routing rule applied",
      },
      {
        from: "Escalation gate",
        to: "Audit chain",
        payload: "Decision, actor, timestamp and rationale, hash-chained",
      },
      {
        from: "Submitted resolution",
        to: "Verification endpoint",
        payload: "Proposed resolution checked against original evidence",
      },
    ],
    techniques: [
      "Event normalisation into an immutable log",
      "Content-hash based tamper detection",
      "Hash-chained audit trails with an integrity check",
      "Tenant-scoped data isolation",
      "Explainable rule-based risk scoring",
      "Human-in-the-loop escalation policy",
      "Explicit deterministic fallback labelling when no model is configured",
    ],
    implementation: [
      {
        title: "The server refuses to run in production mode",
        detail:
          "It rejects non-loopback binding and refuses a production environment flag, so the demo cannot accidentally be pointed at real data.",
      },
      {
        title: "Fallback output is labelled, not disguised",
        detail:
          "When no AI provider is configured, the investigation output is tagged as deterministic fallback. It is never presented as LLM-generated analysis.",
      },
      {
        title: "Audit integrity as a first-class endpoint",
        detail:
          "Because audit events are hash-chained per tenant, an administrator can verify that the chain has not been rewritten.",
      },
      {
        title: "Synthetic data with realistic field names",
        detail:
          "Sample records follow publicly documented payment API field shapes, but the documentation provides no real transaction data and the repository states it uses fictional samples.",
      },
    ],
    verification: [
      {
        title: "Restricted execution boundary",
        detail:
          "Loopback-only binding and a rejected production flag are enforced in code, not left to operator discipline.",
      },
      {
        title: "Immutable records",
        detail:
          "SHA-256 content hashing means an altered record no longer matches its stored hash.",
      },
      {
        title: "Integrity check endpoint",
        detail:
          "The admin endpoint can re-verify the tenant audit chain on demand.",
      },
    ],
    results: [
      {
        label: "Exception categories handled",
        value: "8",
        evidence: "reported",
        source: "README — settlement, fee, refund, adjustment, bank, timing, duplicate, suspicious activity",
      },
      {
        label: "Data used",
        value: "Synthetic only",
        evidence: "reported",
        source: "README states fictional sample records throughout",
      },
      {
        label: "Live demo reachable",
        value: "Yes — HTTP 200",
        evidence: "verified",
        source: "causa-ai-financial-exception.vercel.app returned HTTP 200 during build checks",
      },
      {
        label: "Works without an AI provider",
        value: "Yes",
        evidence: "reported",
        source: "README — deterministic fallback mode",
      },
    ],
    limitations: [
      "It investigates discrepancies; it does not fix them. Resolution is verified, not executed.",
      "The risk model is rule-based and explainable, which is deliberate — but it is not a statistically validated fraud model.",
      "The public demonstration runs on synthetic data, so real-world precision is unknown.",
      "SQLite is a single-node store; concurrency and scale beyond a demonstration are unaddressed.",
      "The repository explicitly defers production identity, cloud resources and real-data approval to the deploying company.",
    ],
    futureWork: [
      "Define a production deployment profile with proper identity, tenancy and a managed database.",
      "Publish an evaluation of detection precision and recall against a labelled exception set.",
      "Add ingestion connectors for real payment provider feeds.",
      "Extend the explainability layer so routing rules can be tuned without a code change.",
    ],
    caveat:
      "This is a safe demonstration and integration foundation for financial operations. It performs no payment action, holds no funds, and does not declare fraud. It is not a compliance or fraud-detection product.",
    links: [
      {
        label: "Source repository",
        href: "https://github.com/vickyPotheesh2004/Causa-AI-Financial-Exception-Resolution-Risk-Management",
        kind: "repo",
      },
      {
        label: "Live demonstration",
        href: "https://causa-ai-financial-exception.vercel.app",
        kind: "live",
      },
    ],
    video: {
      src: "/videos/causa.mp4",
      poster: "/videos/posters/causa.jpg",
      caption: "Investigating a payment exception from normalised evidence through to routed resolution.",
      confidence: "confirmed",
    },
    related: ["finbench", "fina-suite"],
  },

  /* ------------------------------------------------------------------ 03 */
  {
    slug: "researchhelp",
    title: "AI Document Q&A — ResearchHelp",
    tagline:
      "Multi-modal document analysis that keeps confidential files on your own machine and can draft an IEEE-format paper from them.",
    category: "Retrieval · Document intelligence",
    year: "2026",
    status: "shipped",
    statusNote:
      "Built during the Tata Consultancy Services internship and published as a working multi-modal system.",
    featured: true,
    order: 3,
    role: "Solo — pipeline architecture, retrieval design, intent routing, deployment",
    summary: [
      "ResearchHelp ingests PDFs, DOCX files, images, spreadsheets and code, and turns them into a queryable knowledge base. It combines ChromaDB semantic search with BM25 keyword indexing so that an exact identifier and a conceptual question are both retrievable.",
      "Its distinguishing feature is what it does with your data: inference runs locally through Ollama across three specialist models, so nothing leaves the machine and there is no per-query cost. A routing layer inspects each query first and decides which of six workflows — and which of the three models — should handle it.",
    ],
    problem:
      "General-purpose document chat loses precision in two directions. Embedding-only retrieval misses exact figures, part numbers and identifiers; keyword-only retrieval misses paraphrase. Meanwhile cloud inference is a poor fit for confidential patents, internal code and unpublished research.",
    audience:
      "Researchers, analysts and engineering teams who need to interrogate private documents without sending them to a third-party API.",
    constraints: [
      "Zero data egress — inference must be local.",
      "No per-query cost, so cloud APIs are out of scope.",
      "Must handle ten or more file types, including scanned images and spreadsheets.",
      "Different question types need genuinely different prompts and models.",
    ],
    approach: [
      "Ingest through OCR (Tesseract) and document parsing (PyMuPDF) into a normalised text layer.",
      "Chunk semantically rather than by fixed size, so a section stays coherent.",
      "Index twice: embeddings via all-mpnet-base-v2 into ChromaDB, and a BM25 keyword index over the same chunks.",
      "Classify intent before retrieval so the query reaches the right workflow with the right template.",
      "Route to the appropriate local model — Llama 3.1 8B for factual work, Gemma 3 4B for reasoning, Qwen 2.5 3B for code and diagram structure.",
      "Detect the research domain dynamically across 44 domains and inject the matching analytical framework.",
      "Stream the answer, and surface a local model health card so the user can see when Ollama is unavailable.",
    ],
    stack: [
      "Python",
      "Streamlit",
      "ChromaDB",
      "BM25",
      "all-mpnet-base-v2 embeddings",
      "Ollama (Llama 3.1 8B, Qwen 2.5 3B, Gemma 3 4B)",
      "PyMuPDF",
      "Tesseract OCR",
      "FastAPI",
      "Mermaid",
    ],
    pipeline: [
      {
        id: "01",
        name: "Multi-modal ingestion",
        detail: "PDF, DOCX, images, CSV, Excel and code files are accepted and normalised.",
        role: "input",
      },
      {
        id: "02",
        name: "OCR and parsing",
        detail: "Tesseract handles scanned pages; PyMuPDF and document parsers extract structured text.",
        role: "process",
      },
      {
        id: "03",
        name: "Semantic chunking",
        detail: "Text is split on meaning rather than a fixed character count to keep sections coherent.",
        role: "process",
      },
      {
        id: "04",
        name: "Dual indexing",
        detail: "Chunks are embedded into ChromaDB and simultaneously indexed for BM25 keyword search.",
        role: "process",
      },
      {
        id: "05",
        name: "Intent classification",
        detail: "The query is categorised across six intents, including off-topic redirection.",
        role: "reasoning",
      },
      {
        id: "06",
        name: "Model routing",
        detail: "The intent selects a specialist local model; code and diagram requests always go to Qwen 2.5 3B.",
        role: "reasoning",
      },
      {
        id: "07",
        name: "Hybrid retrieval",
        detail: "Semantic and keyword results are combined so both identifiers and paraphrase are found.",
        role: "process",
      },
      {
        id: "08",
        name: "Grounded generation",
        detail: "The answer is streamed with the retrieved context it was built from.",
        role: "reasoning",
      },
      {
        id: "09",
        name: "Artefact generation",
        detail: "Optional outputs include a formatted IEEE manuscript, generated imagery and Mermaid flowcharts.",
        role: "output",
      },
      {
        id: "10",
        name: "Local model health",
        detail: "A sidebar card reports Ollama connection state so failures are visible rather than silent.",
        role: "validation",
      },
    ],
    dataFlow: [
      {
        from: "Uploaded files",
        to: "Ingestion module",
        payload: "PDF, DOCX, image, CSV, Excel, source code",
      },
      {
        from: "Ingestion",
        to: "Chunk store",
        payload: "Normalised text with page and section offsets",
      },
      {
        from: "Chunk store",
        to: "ChromaDB + BM25",
        payload: "Embedding vectors and tokenised keyword index over the same chunks",
      },
      {
        from: "User question",
        to: "Intent classifier",
        payload: "Raw query plus recent conversation context",
      },
      {
        from: "Intent classifier",
        to: "Router",
        payload: "Intent label, e.g. document_qa or ieee_paper_gen",
      },
      {
        from: "Router",
        to: "Retriever + chosen local model",
        payload: "Prompt template and the model best suited to that intent",
      },
      {
        from: "Retriever",
        to: "Generation",
        payload: "Top passages from both semantic and keyword search",
      },
      {
        from: "Generation",
        to: "Streamlit UI",
        payload: "Streamed answer, optionally with a DOCX manuscript or Mermaid diagram",
      },
    ],
    techniques: [
      "Hybrid retrieval: dense vectors plus BM25 keyword index",
      "OCR for scanned documents",
      "Semantic chunking",
      "Intent classification with off-topic rejection",
      "Multi-model routing by task type",
      "Dynamic domain adaptation across 44 domains",
      "Local inference with a model health check",
      "Automated document generation (DOCX, Mermaid, imagery)",
    ],
    implementation: [
      {
        title: "Routing is decided before generation",
        detail:
          "Classifying intent first means the correct model and prompt template are chosen up front, instead of one general prompt attempting every task.",
      },
      {
        title: "Code and diagram requests have a fixed destination",
        detail:
          "Anything requiring structural correctness is routed to Qwen 2.5 3B regardless of other signals, because structural correctness is the failure mode that matters there.",
      },
      {
        title: "Visual status for model availability",
        detail:
          "Because inference is local, the backend can vanish. A sidebar health card tells the user immediately instead of letting requests time out.",
      },
      {
        title: "Off-topic handling is explicit",
        detail:
          "The system has a dedicated intent for questions unrelated to the uploaded material and redirects politely rather than answering from general knowledge.",
      },
    ],
    verification: [
      {
        title: "Local-only inference",
        detail:
          "All generation runs through local Ollama endpoints, which makes the zero-egress and zero-cost claims structural rather than policy-based.",
      },
      {
        title: "Ingestion breadth",
        detail:
          "The advertised support for ten or more file types is visible in the ingestion module of the public repository.",
      },
      {
        title: "Documented intent table",
        detail:
          "The README documents each intent category with an example trigger and the model assigned to it.",
      },
    ],
    results: [
      {
        label: "Local models routed",
        value: "3",
        evidence: "reported",
        source: "README — Llama 3.1 8B, Qwen 2.5 3B, Gemma 3 4B",
      },
      {
        label: "File types supported",
        value: "10+",
        evidence: "reported",
        source: "README and résumé project summary",
      },
      {
        label: "Response quality improvement",
        value: "40%",
        evidence: "reported",
        source: "Résumé, attributed to multi-LLM orchestration via OpenRouter — self-reported, not independently benchmarked",
      },
      {
        label: "Research domains adapted",
        value: "44",
        evidence: "reported",
        source: "README — dynamic domain detection",
      },
    ],
    limitations: [
      "The 40% response-quality improvement is a self-reported résumé figure with no published measurement method or baseline.",
      "Local inference on consumer hardware is slower than a hosted API, and answer quality is bounded by the 3B–8B model class.",
      "Chunking quality determines retrieval quality; poorly structured scans degrade results with no signal to the user.",
      "Automatically generated IEEE-style manuscripts require substantial human review before submission.",
      "It has a Streamlit front end, so it is a working internal tool rather than a polished multi-user product.",
    ],
    futureWork: [
      "Publish a retrieval evaluation using a labelled question set so quality can be tracked across changes.",
      "Replace the Streamlit shell with a multi-user interface including authentication and per-user document isolation.",
      "Add incremental re-indexing so a large collection does not need a full rebuild when one document changes.",
      "Expose the pipeline as a documented REST API for integration into existing research workflows.",
    ],
    caveat:
      "Built during his internship at Tata Consultancy Services. The repository is his own public implementation of that work.",
    links: [
      {
        label: "Source repository",
        href: "https://github.com/vickyPotheesh2004/AI-Document-Q-A-System",
        kind: "repo",
      },
    ],
    video: {
      src: "/videos/researchhelp.mp4",
      poster: "/videos/posters/researchhelp.jpg",
      caption: "Uploading documents, asking a question, and inspecting the grounded response.",
      confidence: "confirmed",
    },
    related: ["finbench", "fina-suite", "lexara"],
  },

  /* ------------------------------------------------------------------ 04 */
  {
    slug: "varsha",
    title: "VarshaAI — Monsoon Safety Companion",
    tagline:
      "Turns weather telemetry and crowdsourced hazard reports into a personalised, explainable safety plan.",
    category: "Applied AI · Decision support",
    year: "2026",
    status: "shipped",
    statusNote:
      "Built for the PromptWars hackathon (Google for Developers × Hack2skill) and deployed publicly.",
    featured: true,
    order: 4,
    role: "Solo — product design, full-stack implementation, security hardening",
    summary: [
      "VarshaAI answers a practical question during a monsoon: given your location, your situation and the current forecast, what should you actually do today? It combines live weather telemetry from Open-Meteo with route checks from OSRM and crowdsourced incident reports to produce a prioritised checklist.",
      "The design decision worth noting is that risk is computed deterministically, not asked of a model. Rainfall intensity, wind speed and temperature are evaluated by a rule engine into LOW, MEDIUM, HIGH or CRITICAL, and only then does the language model turn that state into grounded advice — with each recommendation linked back to the telemetry reading that produced it.",
    ],
    problem:
      "Weather warnings are broadcast to everyone and therefore useful to no one in particular. A farmer, a commuter with a flooded route home, and a caregiver managing a medical dependency need different actions from the same forecast. Meanwhile the local knowledge that matters most — which road is under water right now — sits in people's heads.",
    audience:
      "People in monsoon-affected regions, segmented by persona: commuters, families and caregivers, farmers, senior citizens, and individuals with specific dependencies.",
    constraints: [
      "Must work without account creation — onboarding cannot be a barrier during an emergency.",
      "Must degrade gracefully when connectivity drops, which is exactly when it is needed most.",
      "Must not depend on a paid weather API.",
      "Safety advice has to be traceable to a reading, not generated confidently from nothing.",
    ],
    approach: [
      "Guided no-auth onboarding captures location, persona and dependencies, stored locally.",
      "Pull current and hourly forecasts from Open-Meteo and evaluate them with a deterministic risk rule engine.",
      "Check commute routes through OSRM and flag where weather affects the path.",
      "Assemble weather, location, route, shelter and incident context into a structured prompt for grounded action planning.",
      "Generate tasks grouped as Immediate, Today and Upcoming, plus an explicit list of things to avoid.",
      "Link every recommendation back to the telemetry evidence — reading, timestamp and confidence.",
      "Layer crowdsourced hazard reporting on a Leaflet map with a crowdsourced incident feed.",
      "Cache telemetry and plans so an offline emergency mode can serve the last known good state.",
    ],
    stack: [
      "Next.js 15 (App Router)",
      "React 19",
      "TypeScript",
      "Tailwind CSS v4",
      "Leaflet / React Leaflet",
      "Open-Meteo API",
      "OSRM routing",
      "Supabase Storage",
      "Vercel",
    ],
    pipeline: [
      {
        id: "01",
        name: "Guided onboarding",
        detail: "Location, persona and custom dependencies captured without an account.",
        role: "input",
      },
      {
        id: "02",
        name: "Telemetry fetch",
        detail: "Open-Meteo supplies current conditions and hourly forecast for the area.",
        role: "input",
      },
      {
        id: "03",
        name: "Deterministic risk engine",
        detail: "Rainfall intensity, wind speed and temperature resolve to LOW, MEDIUM, HIGH or CRITICAL.",
        role: "validation",
      },
      {
        id: "04",
        name: "Route impact check",
        detail: "OSRM evaluates the commute path and flags weather-affected segments.",
        role: "process",
      },
      {
        id: "05",
        name: "Context assembly",
        detail: "Weather, location, route, nearby shelters and incident reports are combined into a structured prompt.",
        role: "process",
      },
      {
        id: "06",
        name: "Grounded action planning",
        detail: "The model produces prioritised tasks and items to avoid, each tied to a telemetry source.",
        role: "reasoning",
      },
      {
        id: "07",
        name: "Evidence linking",
        detail: "Every recommendation carries the reading, timestamp and confidence behind it.",
        role: "validation",
      },
      {
        id: "08",
        name: "Crowdsourced reporting",
        detail: "Users place flooding, road-block and outage reports on a Leaflet map with optional images.",
        role: "input",
      },
      {
        id: "09",
        name: "Offline cache",
        detail: "Telemetry and plans are cached so an emergency mode can serve the last known good state.",
        role: "output",
      },
      {
        id: "10",
        name: "Grounded chatbot",
        detail: "A suggested-prompt assistant answers safety questions strictly from active telemetry.",
        role: "output",
      },
    ],
    dataFlow: [
      {
        from: "User onboarding",
        to: "Local configuration store",
        payload: "Location, persona, dependencies, custom options",
      },
      {
        from: "Open-Meteo",
        to: "Risk engine",
        payload: "Current and hourly rainfall, wind speed, temperature",
      },
      {
        from: "Risk engine",
        to: "Prompt assembly",
        payload: "Risk level plus the readings that determined it",
      },
      {
        from: "OSRM",
        to: "Prompt assembly",
        payload: "Route geometry with weather-affected segments flagged",
      },
      {
        from: "Crowdsourced reports",
        to: "Incident layer",
        payload: "Coordinates, hazard type, timestamp, optional image URL",
      },
      {
        from: "Prompt assembly",
        to: "Action planner",
        payload: "Structured context with telemetry evidence attached",
      },
      {
        from: "Action planner",
        to: "User",
        payload: "Prioritised checklist, items to avoid, evidence links, confidence",
      },
      {
        from: "Telemetry and plans",
        to: "Offline cache",
        payload: "Last known good state for disconnected use",
      },
    ],
    techniques: [
      "Deterministic rule-based risk scoring",
      "Grounded prompt construction with evidence attachment",
      "Explainability by default — every recommendation cites its input",
      "Crowdsourced data ingestion with MIME and size validation",
      "Offline-first caching with graceful degradation",
      "Stateless cryptographic rate limiting",
      "CSRF and origin verification",
      "Focus trapped, keyboard-accessible modals",
    ],
    implementation: [
      {
        title: "Risk is computed, not asked",
        detail:
          "The model never decides whether conditions are dangerous. A rule engine does that, and the model's task is limited to translating a known state into actionable steps.",
      },
      {
        title: "Rate limiting that survives serverless",
        detail:
          "Because the deployment is serverless, in-memory counters would reset per instance. The limiter uses signed HMAC-SHA256 cookie tokens to implement a sliding window that container bypass cannot defeat.",
      },
      {
        title: "Emergency mode is a real mode",
        detail:
          "Telemetry and generated plans are cached so that when the connection drops — the exact moment of highest need — the application still shows the last known good state with a clear warning banner.",
      },
      {
        title: "Deliberate security hardening",
        detail:
          "Origin and referer verification on POST routes, strict coordinate bounds checking, secure HTTP headers and image upload MIME validation are all documented as gap closures rather than defaults.",
      },
    ],
    verification: [
      {
        title: "Deployed and reachable",
        detail: "varsha-ai.vercel.app returns HTTP 200 and is publicly accessible.",
      },
      {
        title: "Accessibility work",
        detail:
          "Modals trap Tab and Shift+Tab focus cycles and close on Escape — behaviour that only matters if it was actually tested.",
      },
      {
        title: "Documented threat model",
        detail:
          "The repository lists the specific OWASP and WCAG gaps closed, which makes the security claims checkable against the code.",
      },
    ],
    results: [
      {
        label: "Live deployment",
        value: "HTTP 200",
        evidence: "verified",
        source: "varsha-ai.vercel.app checked during build",
      },
      {
        label: "Personas supported",
        value: "5",
        evidence: "reported",
        source: "README — commuter, family/caregiver, farmer, senior citizen, individual",
      },
      {
        label: "Hazard types reportable",
        value: "3",
        evidence: "reported",
        source: "README — flooding, road blocks, power outages",
      },
      {
        label: "Build context",
        value: "PromptWars hackathon",
        evidence: "reported",
        source: "README — Google for Developers × Hack2skill",
      },
    ],
    limitations: [
      "It was built within a hackathon timeframe, so breadth of features is ahead of depth of validation.",
      "Risk thresholds are hand-tuned rules, not a model calibrated against recorded outcomes.",
      "Crowdsourced hazard reports inherit their reporters' reliability; there is no reputation or cross-verification system.",
      "Dependence on third-party free services (Open-Meteo, OSRM) means availability is outside his control.",
      "The offline mode serves cached data, which during a fast-moving event can be stale by the time it is read.",
    ],
    futureWork: [
      "Calibrate the risk thresholds against historical weather and reported incident data.",
      "Add reputation weighting so repeat-report quality affects how much a contribution is trusted.",
      "Integrate official emergency advisories as an additional evidence source.",
      "Add SMS or push delivery so a safety plan reaches people who are not looking at a browser.",
    ],
    caveat:
      "This is a decision-support tool, not an official emergency warning service. It should be used alongside, never instead of, official advisories.",
    links: [
      {
        label: "Live application",
        href: "https://varsha-ai.vercel.app",
        kind: "live",
      },
      {
        label: "Source repository",
        href: "https://github.com/vickyPotheesh2004/Varsha-AI",
        kind: "repo",
      },
    ],
    video: {
      src: "/videos/varsha.mp4",
      poster: "/videos/posters/varsha.jpg",
      caption: "Risk assessment, route impact and a generated safety plan in a live session.",
      confidence: "confirmed",
    },
    related: ["antigravity", "arome", "researchhelp"],
  },

  /* ------------------------------------------------------------------ 05 */
  {
    slug: "antigravity",
    title: "Project AntiGravity — Crowdflow Simulator",
    tagline:
      "A digital twin and operational dashboard for routing stadium crowds, modelled under both normal physics and simulated gravity inversion.",
    category: "Simulation · TypeScript",
    year: "2026",
    status: "prototype",
    statusNote:
      "A hackathon prototype for the FIFA World Cup 2026 virtual prompt competition. The architecture and simulation logic are real; the operational figures are the submission's own claims.",
    featured: false,
    order: 5,
    role: "Solo — simulation design, dashboard implementation, prompt strategy",
    summary: [
      "Project AntiGravity models how crowds move through a stadium concourse, then routes them using pre-computed vector grids so pathfinding is constant-time rather than recalculated per fan. It validates incoming telemetry through a zero-trust shield before any of it reaches the model layer.",
      "It presents two operating states — a nominal concourse state and an active gravity-inversion state with levitated corridors — and includes a failsafe controller that reroutes transit and egress when an outage is detected. It is deliberately theatrical in premise while being serious about the systems underneath: spatial hashing, schema-validated structured output, and constrained input handling.",
    ],
    problem:
      "Large-event egress is a routing problem under a hard time budget. If every fan's path is computed individually at the moment of movement, the system is slowest exactly when it is most needed. At the same time, an operational dashboard is only trustworthy if the telemetry feeding it has been validated rather than accepted.",
    audience:
      "Event operations and stadium management teams, and as a demonstration of structured-output LLM orchestration under adversarial input.",
    constraints: [
      "Routing decisions must be constant-time per agent, not recomputed from scratch.",
      "All incoming telemetry must be validated before it influences any decision.",
      "The model must return strict structured JSON, with schema checks and retries.",
      "The system needs a defined degradation path when a subsystem fails.",
    ],
    approach: [
      "Pre-compute a spatial hash vector table so any position resolves to its routing neighbourhood in O(1).",
      "Run a security shield across incoming ticketing concourse telemetry before it reaches the simulator, with an auditing console alongside it.",
      "Model two states — nominal concourse physics and an active gravity-inversion state with levitated 3D corridors.",
      "Configure the model as a concourse operations coordinator with constrained boundaries and strict JSON output.",
      "Reject instruction overrides and malicious input before model ingestion.",
      "Drive a failsafe degradation controller that, on outage, shifts gate assignments and reroutes transit.",
    ],
    stack: [
      "TypeScript",
      "Vite",
      "Gemini API",
      "Spatial hash vector tables",
      "Structured JSON output with schema validation",
      "Python verification test runner",
    ],
    pipeline: [
      {
        id: "01",
        name: "Telemetry ingress",
        detail: "Ticketing concourse telemetry arrives for validation.",
        role: "input",
      },
      {
        id: "02",
        name: "Zero-trust shield",
        detail: "Inputs are screened for instruction overrides and malformed payloads before anything else sees them.",
        role: "validation",
      },
      {
        id: "03",
        name: "Security audit console",
        detail: "Rejected and accepted telemetry is surfaced so the screening is observable, not silent.",
        role: "output",
      },
      {
        id: "04",
        name: "Spatial hash table",
        detail: "A pre-computed O(1) vector table maps any position to its routing neighbourhood.",
        role: "process",
      },
      {
        id: "05",
        name: "Nominal state",
        detail: "Normal grid-friction pathways and step-free perimeter ramps are simulated.",
        role: "process",
      },
      {
        id: "06",
        name: "Inversion state",
        detail: "The alternative physics model routes crowds through levitated 3D corridors.",
        role: "process",
      },
      {
        id: "07",
        name: "Coordinator model",
        detail: "The LLM acts as a constrained operations coordinator returning schema-validated JSON.",
        role: "reasoning",
      },
      {
        id: "08",
        name: "Schema validation",
        detail: "Output is checked against the expected schema with retry loops on failure.",
        role: "validation",
      },
      {
        id: "09",
        name: "Failsafe controller",
        detail: "An outage trigger evaluates degradation options rather than failing open.",
        role: "validation",
      },
      {
        id: "10",
        name: "Egress rerouting",
        detail: "Gate assignments shift and transit shuttles are delayed or rerouted.",
        role: "output",
      },
    ],
    dataFlow: [
      {
        from: "Concourse telemetry",
        to: "Zero-trust shield",
        payload: "Raw sensor and ticketing readings",
      },
      {
        from: "Zero-trust shield",
        to: "Spatial hash table",
        payload: "Screened, well-formed telemetry only",
      },
      {
        from: "Spatial hash table",
        to: "Simulation state",
        payload: "Constant-time neighbourhood lookup for each agent position",
      },
      {
        from: "Simulation state",
        to: "Coordinator prompt",
        payload: "Current occupancy, physics mode and constraints",
      },
      {
        from: "Coordinator",
        to: "Schema validator",
        payload: "Structured JSON routing instruction",
      },
      {
        from: "Schema validator",
        to: "Dashboard",
        payload: "Validated routing decisions, or retry on malformed output",
      },
      {
        from: "Outage signal",
        to: "Failsafe controller",
        payload: "Subsystem failure event",
      },
      {
        from: "Failsafe controller",
        to: "Transit and egress",
        payload: "Gate reassignment and shuttle reroute directives",
      },
    ],
    techniques: [
      "Constant-time spatial hashing for routing lookups",
      "Zero-trust input shielding against prompt injection",
      "Structured output with schema validation and retry",
      "Chain-of-thought and structured few-shot prompting",
      "Digital twin modelling with two physics states",
      "Failsafe degradation design",
    ],
    implementation: [
      {
        title: "Routing is precomputed, not recomputed",
        detail:
          "The O(1) vector table is the core performance idea: position-to-neighbourhood resolution is a lookup, which keeps the simulation responsive as agent count grows.",
      },
      {
        title: "Adversarial input is assumed",
        detail:
          "The shield explicitly rejects instruction overrides and out-of-scope requests before model ingestion, and the audit console makes every rejection visible.",
      },
      {
        title: "Malformed model output is expected",
        detail:
          "Schema checks with retry loops are built in rather than assumed unnecessary, which is the correct posture for structured-output LLM orchestration.",
      },
      {
        title: "Degradation is designed, not improvised",
        detail:
          "The failsafe controller has a defined behaviour for an outage instead of letting the system fail in an undefined state.",
      },
    ],
    verification: [
      {
        title: "Python verification test runner",
        detail:
          "The repository documents a test runner invoked before starting the web application, covering the simulation checks.",
      },
      {
        title: "Documented architecture",
        detail:
          "The README includes an explicit ASCII architecture diagram showing ingress, shield, spatial table, both states, failsafe and rerouting.",
      },
      {
        title: "Declared prompt strategy",
        detail:
          "The prompt technique and system instruction boundaries are documented, making the injection defence checkable.",
      },
    ],
    results: [
      {
        label: "Bottleneck latency reduction",
        value: "92%",
        evidence: "reported",
        source: "Repository architecture diagram, gravity-inversion state — a hackathon claim with no published measurement method",
      },
      {
        label: "Telemetry screening",
        value: "Zero-trust, pre-ingestion",
        evidence: "reported",
        source: "README prompt engineering strategy section",
      },
      {
        label: "Operating states modelled",
        value: "2",
        evidence: "reported",
        source: "README — nominal and active gravity inversion",
      },
    ],
    limitations: [
      "The 92% latency reduction figure is asserted by the project itself with no described measurement, baseline or experiment design.",
      "The gravity-inversion mode is a conceptual demonstration, not a physical model.",
      "Crowd behaviour is simulated from a routing model, not calibrated against recorded stadium movement data.",
      "It depends on an external Gemini API, so it is neither local nor free to operate.",
      "Hackathon scope means the failsafe paths are designed and demonstrated, not stress-tested.",
    ],
    futureWork: [
      "Replace the single headline figure with a described experiment, baseline and measurement procedure.",
      "Calibrate the movement model against recorded crowd-flow data from a real venue.",
      "Move routing inference locally so the simulator has no external API dependency.",
      "Publish the simulation's assumptions and failure modes as an operational runbook.",
    ],
    caveat:
      "Built as a hackathon submission for the FIFA World Cup 2026 virtual prompt competition. The premise is speculative and deliberately theatrical, including the gravity-inversion mode; the systems engineering beneath it is real.",
    links: [
      {
        label: "Source repository",
        href: "https://github.com/vickyPotheesh2004/stadium-manager-ai",
        kind: "repo",
      },
    ],
    video: {
      src: "/videos/antigravity.mp4",
      poster: "/videos/posters/antigravity.jpg",
      caption: "Crowdflow simulation running across nominal and inversion states.",
      confidence: "confirmed",
    },
    related: ["varsha", "data-analyst"],
  },

  /* ------------------------------------------------------------------ 06 */
  {
    slug: "lexara",
    title: "LEXARA — Podcast Transcription & Insights",
    tagline:
      "Whisper transcription with topic segmentation, semantic titles and a 3D visual layer over the result.",
    category: "Speech AI · NLP",
    year: "2026",
    status: "shipped",
    statusNote:
      "Published and functional, with a Streamlit interface. Built and documented as a complete pipeline.",
    featured: false,
    order: 6,
    role: "Solo — pipeline design, segmentation method, visualisation layer",
    summary: [
      "LEXARA converts raw audio into a structured, navigable document. It transcribes with Whisper Small, segments the transcript into coherent topics, generates a short semantic title for each segment, and renders the whole structure as an interactive timeline plus a 3D visual layer.",
      "Two decisions stand out. It transcribes in the audio's original language rather than translating to English — which preserves the actual content for Telugu, Hindi and Tamil material — and when segment boundaries are genuinely ambiguous it labels them UNKNOWN instead of forcing a confident guess, a choice the project frames explicitly as enterprise-safety behaviour.",
    ],
    problem:
      "A two-hour podcast is effectively unsearchable. Segmenting it into topics is where most pipelines fail: naive time-slicing cuts mid-thought, and speaker-change detection alone confuses a change of voice with a change of subject.",
    audience:
      "Content teams, researchers and archivists working with long-form audio, particularly in Indian languages where translation-first pipelines discard meaning.",
    constraints: [
      "Must not force English — the original language is the deliverable.",
      "Topic boundaries must be derivable, not guessed.",
      "Long audio has to remain navigable, which requires a real interface rather than a wall of text.",
      "Ambiguity must be labelled rather than hidden.",
    ],
    approach: [
      "Transcribe with Whisper Small (244M parameters) using word-level timestamps.",
      "Default to native-language transcription, with manual language override for music-heavy audio where auto-detection misfires.",
      "Detect topic shifts by combining semantic analysis with speaker-change signals.",
      "Generate a semantic title of eight to ten words for each segment.",
      "Keep segments in chronological order by start time regardless of processing order.",
      "Mark genuinely ambiguous boundaries as UNKNOWN rather than asserting a split.",
      "Render a proportional, colour-coded horizontal timeline in Matplotlib with click-to-navigate topic buttons.",
      "Add a 3D animation layer where each segment becomes a distinct node representing the podcast's structure.",
    ],
    stack: [
      "Python",
      "OpenAI Whisper Small (244M)",
      "SBERT embeddings",
      "TF-IDF",
      "Matplotlib",
      "Streamlit",
    ],
    pipeline: [
      {
        id: "01",
        name: "Audio ingest",
        detail: "Accepts varied audio conditions, including music and multiple accents.",
        role: "input",
      },
      {
        id: "02",
        name: "Language detection",
        detail: "Detects the spoken language, with manual override available.",
        role: "process",
      },
      {
        id: "03",
        name: "Transcription",
        detail: "Whisper Small produces text with word-level timestamps in the original language.",
        role: "process",
      },
      {
        id: "04",
        name: "Semantic drift analysis",
        detail: "SBERT embeddings track how meaning moves across the transcript.",
        role: "reasoning",
      },
      {
        id: "05",
        name: "Lexical divergence",
        detail: "TF-IDF measures vocabulary change alongside the semantic signal.",
        role: "process",
      },
      {
        id: "06",
        name: "Boundary decision",
        detail: "Topic shifts and speaker changes are combined into candidate segment boundaries.",
        role: "reasoning",
      },
      {
        id: "07",
        name: "Ambiguity labelling",
        detail: "Unclear boundaries are marked UNKNOWN rather than forced.",
        role: "validation",
      },
      {
        id: "08",
        name: "Title generation",
        detail: "Each segment receives a semantic title of eight to ten words.",
        role: "reasoning",
      },
      {
        id: "09",
        name: "Timeline visualisation",
        detail: "A colour-coded proportional bar chart with click-to-navigate segment buttons.",
        role: "output",
      },
      {
        id: "10",
        name: "3D structure view",
        detail: "Segments become animated 3D nodes showing the episode's shape.",
        role: "output",
      },
    ],
    dataFlow: [
      {
        from: "Audio file",
        to: "Language detection",
        payload: "Raw waveform",
      },
      {
        from: "Language detection",
        to: "Whisper Small",
        payload: "Detected language, or the manually selected one",
      },
      {
        from: "Whisper Small",
        to: "Analysis layer",
        payload: "Transcript with word-level timestamps",
      },
      {
        from: "Transcript",
        to: "SBERT + TF-IDF",
        payload: "Sentence embeddings and term-frequency vectors",
      },
      {
        from: "SBERT + TF-IDF",
        to: "Boundary detector",
        payload: "Semantic drift scores and lexical divergence scores",
      },
      {
        from: "Boundary detector",
        to: "Segment store",
        payload: "Segments with start and end times, or an UNKNOWN label",
      },
      {
        from: "Segment store",
        to: "Title generator",
        payload: "Segment text used to derive a short semantic title",
      },
      {
        from: "Segment store",
        to: "Timeline and 3D views",
        payload: "Ordered segments with colours, durations and topic metadata",
      },
    ],
    techniques: [
      "Whisper ASR with word-level timestamp alignment",
      "Hybrid topic segmentation (semantic drift + lexical divergence)",
      "Speaker-change detection as a secondary boundary signal",
      "Native-language transcription over translation",
      "Explicit ambiguity labelling for enterprise safety",
      "Proportional timeline visualisation with click-to-navigate",
      "3D node-based structure rendering",
    ],
    implementation: [
      {
        title: "Two segmentation signals, not one",
        detail:
          "Semantic drift alone over-segments when a speaker paraphrases; lexical divergence alone misses gradual topic change. Combining them reduces both failure modes.",
      },
      {
        title: "Native language is preserved",
        detail:
          "Translating first would discard the actual content of Telugu, Hindi and Tamil material. LEXARA transcribes in the source language and treats translation as a separate optional step.",
      },
      {
        title: "UNKNOWN is a valid answer",
        detail:
          "Forcing a segment boundary where the signal is weak produces confident nonsense. Labelling it UNKNOWN keeps the output trustworthy for downstream use.",
      },
      {
        title: "Structure made visible",
        detail:
          "The timeline and 3D layer exist because a segmented transcript is still unusable if you cannot see its shape or jump into it.",
      },
    ],
    verification: [
      {
        title: "Documented feature behaviour",
        detail:
          "Each capability — native-language transcription, manual override, UNKNOWN labelling, chronological ordering — is specified in the repository documentation.",
      },
      {
        title: "Stated model size",
        detail:
          "Whisper Small is identified as a 244M-parameter model, so the accuracy/speed trade-off is explicit rather than vague.",
      },
    ],
    results: [
      {
        label: "ASR model",
        value: "Whisper Small (244M)",
        evidence: "reported",
        source: "Repository README",
      },
      {
        label: "Segmentation signals",
        value: "2 — semantic + lexical",
        evidence: "reported",
        source: "README feature description",
      },
      {
        label: "Languages handled",
        value: "4+",
        evidence: "reported",
        source: "Résumé project summary — English, Hindi, Tamil, Telugu",
      },
      {
        label: "Review time reduction",
        value: "60%",
        evidence: "reported",
        source: "Résumé figure for the podcast pipeline — self-reported, no published measurement method",
      },
    ],
    limitations: [
      "The 60% review-time reduction is a self-reported résumé figure with no stated baseline.",
      "Whisper Small trades accuracy for speed; heavily accented or music-layered audio degrades.",
      "Segmentation quality on fast, multi-topic conversation is unmeasured — no labelled benchmark is published.",
      "Speaker diarisation is used only as a boundary signal, not as full speaker attribution.",
      "The interface is a Streamlit application, suitable for internal or individual use rather than multi-user production.",
    ],
    futureWork: [
      "Build a labelled segmentation benchmark so boundary accuracy can be reported numerically.",
      "Add full speaker diarisation with per-speaker attribution rather than boundary hints only.",
      "Move from Streamlit to a deployed web application with saved sessions.",
      "Add a retrieval index over transcripts so past episodes become searchable across a library.",
    ],
    links: [
      {
        label: "Source repository",
        href: "https://github.com/vickyPotheesh2004/LEXARA-AI",
        kind: "repo",
      },
    ],
    video: {
      src: "/videos/lexara.mp4",
      poster: "/videos/posters/lexara.jpg",
      caption: "Transcription, topic segmentation and the interactive timeline in use.",
      confidence: "confirmed",
    },
    related: ["podcast", "researchhelp", "fina-suite"],
  },

  /* ------------------------------------------------------------------ 07 */
  {
    slug: "podcast",
    title: "AI Automated Podcast Transcription",
    tagline:
      "The Infosys Springboard internship pipeline: multilingual transcription, segmentation and search.",
    category: "Speech AI · Internship work",
    year: "2025–2026",
    status: "shipped",
    statusNote:
      "Built during the Infosys Springboard AI/ML internship. This repository holds the internship implementation.",
    featured: false,
    order: 7,
    role: "AI/ML Intern — end-to-end pipeline and interface",
    summary: [
      "This is the internship implementation that the LEXARA work later built on: a pipeline taking podcast audio to timestamped, topic-segmented transcripts, with multilingual detection, translation and Roman transliteration layered on top.",
      "It pairs a Flask backend with a Streamlit interface offering keyword search, keyword highlighting, per-segment translation and auto-jump navigation — the practical features that make a long transcript usable by someone who is not an engineer.",
    ],
    problem:
      "Reviewing podcast content manually does not scale, and Indian-language audio is poorly served by English-first tooling. A useful pipeline has to preserve the original language while still producing something a non-specialist can search and navigate.",
    audience:
      "Content and editorial teams reviewing long-form audio, and the internship's internal evaluation.",
    constraints: [
      "Must handle multiple Indian languages, not just English.",
      "Output has to be navigable by someone who did not build the pipeline.",
      "Segment boundaries must be derived from the content rather than fixed intervals.",
    ],
    approach: [
      "Transcribe with Whisper ASR using word-level timestamp alignment.",
      "Detect language automatically and support translation and Roman transliteration.",
      "Segment topics by combining semantic embeddings with keyword divergence.",
      "Serve the interface through Flask with a Streamlit front end.",
      "Provide keyword search with highlighting and auto-jump to the matching timestamp.",
      "Offer per-segment translation so a reader can check the original against a translation.",
    ],
    stack: ["Python", "Whisper ASR", "SBERT", "TF-IDF", "Flask", "Streamlit"],
    pipeline: [
      {
        id: "01",
        name: "Audio input",
        detail: "Podcast audio is ingested for processing.",
        role: "input",
      },
      {
        id: "02",
        name: "Transcription",
        detail: "Whisper ASR produces text with word-level timestamp alignment.",
        role: "process",
      },
      {
        id: "03",
        name: "Language detection",
        detail: "The spoken language is identified to route further processing.",
        role: "process",
      },
      {
        id: "04",
        name: "Segmentation",
        detail: "Semantic embeddings and keyword divergence together locate topic boundaries.",
        role: "reasoning",
      },
      {
        id: "05",
        name: "Translation layer",
        detail: "Segments can be translated, with Roman transliteration available.",
        role: "process",
      },
      {
        id: "06",
        name: "Search index",
        detail: "Transcript content is indexed so keywords resolve to timestamps.",
        role: "process",
      },
      {
        id: "07",
        name: "Interface",
        detail: "Flask serves a Streamlit UI with highlighting, auto-jump and per-segment translation.",
        role: "output",
      },
    ],
    dataFlow: [
      {
        from: "Podcast audio",
        to: "Whisper ASR",
        payload: "Audio track",
      },
      {
        from: "Whisper ASR",
        to: "Segmenter",
        payload: "Transcript with word-level timestamps",
      },
      {
        from: "Segmenter",
        to: "Translation and transliteration",
        payload: "Topic segments with start and end times",
      },
      {
        from: "Segments",
        to: "Search index",
        payload: "Indexed segment text with timestamps",
      },
      {
        from: "Search index and translations",
        to: "Viewer interface",
        payload: "Highlighted matches, jump targets, translated segments",
      },
    ],
    techniques: [
      "Whisper ASR with word-level alignment",
      "Hybrid segmentation using embeddings and lexical divergence",
      "Multilingual detection, translation and transliteration",
      "Keyword search with in-context highlighting",
      "Auto-jump navigation to timestamps",
    ],
    implementation: [
      {
        title: "Search that lands where the audio actually is",
        detail:
          "Keyword highlighting combined with auto-jump turns search results into playable positions, which is the difference between a transcript and a usable archive.",
      },
      {
        title: "Built for non-English content first",
        detail:
          "Language detection, translation and transliteration were included from the start rather than added later, reflecting the actual content being processed.",
      },
    ],
    verification: [
      {
        title: "Committed under the internship repository",
        detail:
          "The implementation is published in the AI_Automated_Podcast_Transcription repository associated with Infosys Springboard.",
      },
    ],
    results: [
      {
        label: "Languages supported",
        value: "4+",
        evidence: "reported",
        source: "Résumé — English, Hindi, Tamil, Telugu",
      },
      {
        label: "Review workload reduction",
        value: "60%",
        evidence: "reported",
        source: "Résumé internship bullet — self-reported, no published measurement method",
      },
      {
        label: "Interface",
        value: "Flask + Streamlit",
        evidence: "reported",
        source: "Résumé and repository",
      },
    ],
    limitations: [
      "The 60% reduction is self-reported with no published baseline or measurement method.",
      "The repository documentation is minimal — the implementation is present but the README does not describe the architecture in detail.",
      "Flask plus Streamlit is a prototyping stack, not a production deployment target.",
      "Segment-level translation can drift from the original in idiomatic speech.",
    ],
    futureWork: [
      "Write up the architecture and evaluation methodology in the repository documentation.",
      "Benchmark segmentation accuracy against a manually segmented reference set.",
      "Consolidate with the LEXARA work into a single maintained pipeline rather than two parallel implementations.",
    ],
    links: [
      {
        label: "Source repository",
        href: "https://github.com/vickyPotheesh2004/AI_Automated_Podcast_Transcription",
        kind: "repo",
      },
    ],
    related: ["lexara", "researchhelp"],
  },

  /* ------------------------------------------------------------------ 08 */
  {
    slug: "fina-suite",
    title: "FinBench Deterministic Library Suite",
    tagline:
      "Eight published Python packages that move extraction, arithmetic, verification and formatting out of the model and into tested code.",
    category: "Python libraries · Publishing",
    year: "2026",
    status: "shipped",
    statusNote:
      "Seven of the eight packages are independently installable from PyPI, with version numbers verified during this build. The eighth is published as source only.",
    featured: true,
    order: 8,
    role: "Solo — library design, API surface, tests, packaging, publishing",
    summary: [
      "This suite is the load-bearing part of FinBench separated into independently installable packages. Each library owns one responsibility and can be tested, versioned and reused without pulling in the rest of the system.",
      "The reason it exists is a specific failure mode: language models are competent orchestrators and unreliable calculators. Moving formula execution into a library of individually implemented, registry-backed functions means an agent calls tested code instead of estimating arithmetic in prompt space — and the result is auditable.",
    ],
    problem:
      "A multi-step financial calculation performed in prompt space is unreproducible and silently wrong at the edges. At the same time, a single monolithic codebase makes it impossible to test one concern or reuse it elsewhere.",
    audience:
      "Python developers building financial or document-analysis agents, and anyone who needs the arithmetic to be verifiable rather than plausible.",
    constraints: [
      "Each concern must be independently installable and testable.",
      "Formula execution must be deterministic and traceable to a named function.",
      "Public APIs must remain stable enough to publish with version numbers.",
      "Verification must be able to refuse an answer, not just check it.",
    ],
    approach: [
      "Split the system by responsibility: extraction, maths, algorithms, logic, patterns, verification, formatting, question handling.",
      "Implement one explicit function per formula, organised by financial domain, with a registry for lookup and metadata.",
      "Back the maths library with a formula catalogue and uniqueness checks in the test suite.",
      "Give the verification library the explicit ability to abstain.",
      "Provide a registry-driven formatter so rendered answers stay consistent across callers.",
      "Package, version and publish each library independently so they can be adopted separately.",
    ],
    stack: [
      "Python (src layout)",
      "pytest",
      "ruff",
      "PyPI packaging (build + twine)",
      "Registry-based function lookup",
      "CLI entry points",
    ],
    pipeline: [
      {
        id: "01",
        name: "fina-extractor-lib v0.1.5",
        detail: "Deterministic financial document extraction across PDF, XLSX, HTML, DOCX, iXBRL and OCR sources, built to reject footnote and near-duplicate traps.",
        role: "input",
      },
      {
        id: "02",
        name: "fina-pattern-lib v0.1.2",
        detail: "Deterministic question and document pattern library that helps the agent recognise what is actually being asked.",
        role: "process",
      },
      {
        id: "03",
        name: "fina-maths-lib v0.1.1",
        detail: "1500 financial formulas, one tested function each, registry-backed — removing arithmetic from prompt space entirely.",
        role: "validation",
      },
      {
        id: "04",
        name: "fina-algo-lib v0.2.0",
        detail: "Retrieval (BM25, RRF, cosine, overlap rerank), statistics, valuation (NPV, DCF, WACC), fixed income, risk (Sharpe, Sortino, VaR, CVaR, drawdown), time series and optimisation routines.",
        role: "process",
      },
      {
        id: "05",
        name: "fina-logic-lib v0.1.1",
        detail: "195 deterministic rules across six layers, giving the pipeline explicit reasoning constraints instead of implicit ones.",
        role: "reasoning",
      },
      {
        id: "06",
        name: "fina-verify-lib v0.1.1",
        detail: "Answer verification and abstention — the component with authority to reject an upstream result.",
        role: "validation",
      },
      {
        id: "07",
        name: "fina-format-lib v0.1.0",
        detail: "Registry-driven deterministic rendering so the same answer looks the same regardless of which caller requested it.",
        role: "output",
      },
      {
        id: "08",
        name: "fina_question_lib",
        detail: "Question handling library published as source on GitHub; not released to PyPI.",
        role: "process",
      },
    ],
    dataFlow: [
      {
        from: "Financial document",
        to: "fina-extractor-lib",
        payload: "Raw bytes and format metadata",
      },
      {
        from: "fina-extractor-lib",
        to: "Caller / agent",
        payload: "Structured facts with source context and confidence",
      },
      {
        from: "Question text",
        to: "fina-pattern-lib + fina-logic-lib",
        payload: "Recognised question shape and applicable rule layers",
      },
      {
        from: "Recognised intent",
        to: "fina-maths-lib / fina-algo-lib",
        payload: "Named formula or algorithm invoked by registry key",
      },
      {
        from: "Computed result",
        to: "fina-verify-lib",
        payload: "Candidate answer plus the evidence it must be checked against",
      },
      {
        from: "fina-verify-lib",
        to: "Caller",
        payload: "Verified answer, or an explicit abstention",
      },
      {
        from: "Verified answer",
        to: "fina-format-lib",
        payload: "Answer rendered with confidence and citation fields",
      },
    ],
    techniques: [
      "Deterministic function-per-formula implementation",
      "Registry-backed lookup with metadata",
      "Documented formula catalogue with uniqueness enforcement",
      "Explicit abstention as a first-class return value",
      "src-layout package structure with exhaustive tests",
      "Independent semantic versioning and PyPI publication",
      "CLI entry points alongside the library API",
    ],
    implementation: [
      {
        title: "One function per formula, by domain",
        detail:
          "1500 formulas implemented individually and organised by financial domain makes each one testable in isolation and traceable when a number is questioned.",
      },
      {
        title: "A registry instead of imports scattered everywhere",
        detail:
          "Algorithms and formulas are looked up through a central registry with metadata, so callers request a capability by name and the implementation can change without breaking callers.",
      },
      {
        title: "Abstention is an API decision",
        detail:
          "fina-verify-lib returning 'unverified' is a designed outcome, not an exception — which is what allows the pipeline above it to escalate to a human honestly.",
      },
      {
        title: "Publishing as a forcing function",
        detail:
          "Releasing seven packages to PyPI with real version numbers forces a stable public API and a working install path, which is a stronger correctness check than tests alone.",
      },
    ],
    verification: [
      {
        title: "PyPI publication verified",
        detail:
          "Seven packages confirmed live with versions checked against the PyPI JSON API during this build: fina-extractor-lib 0.1.5, fina-pattern-lib 0.1.2, fina-maths-lib 0.1.1, fina-algo-lib 0.2.0, fina-logic-lib 0.1.1, fina-verify-lib 0.1.1, fina-format-lib 0.1.0.",
      },
      {
        title: "Exhaustive and uniqueness tests",
        detail:
          "The maths library runs deterministic tests plus uniqueness checks to confirm the formula catalogue has no duplicate or conflicting entries.",
      },
      {
        title: "Quality gates in the documented workflow",
        detail:
          "The development workflow includes ruff linting, pytest and a build plus smoke-install step before publishing.",
      },
    ],
    results: [
      {
        label: "Published packages",
        value: "7 on PyPI",
        evidence: "verified",
        source: "Queried via the PyPI JSON API during this build; versions listed under verification",
      },
      {
        label: "Formulas implemented",
        value: "1500",
        evidence: "reported",
        source: "fina-maths-lib README highlight",
      },
      {
        label: "Logic rules",
        value: "195 across 6 layers",
        evidence: "verified",
        source: "fina-logic-lib PyPI package summary",
      },
      {
        label: "Algorithm coverage",
        value: "Retrieval, valuation, fixed income, risk, time series, optimisation",
        evidence: "reported",
        source: "fina-algo-lib README",
      },
    ],
    limitations: [
      "Independent packages with no single meta-package means a consumer must install and version-manage several dependencies.",
      "Formula correctness is verified against its own catalogue — there is no published comparison against an external reference implementation.",
      "fina_question_lib is not on PyPI, so installation is from source only.",
      "Documentation quality varies across the eight repositories; some have substantial READMEs and others are minimal.",
      "The suite is built for the FinBench pipeline's needs and is not a general-purpose quantitative finance library.",
    ],
    futureWork: [
      "Publish a meta-package that pins compatible versions of all eight libraries.",
      "Validate the formula implementations against an independent financial reference library.",
      "Publish fina_question_lib to PyPI for install parity with the rest.",
      "Bring documentation across all eight repositories to the same standard as fina-extractor-lib.",
      "Add cross-library integration tests to catch version skew between packages.",
    ],
    links: [
      {
        label: "fina-extractor-lib",
        href: "https://github.com/vickyPotheesh2004/Fina_extractor_lib",
        kind: "repo",
      },
      {
        label: "fina-maths-lib",
        href: "https://github.com/vickyPotheesh2004/Fina_Maths_lib",
        kind: "repo",
      },
      {
        label: "fina-algo-lib",
        href: "https://github.com/vickyPotheesh2004/Fina_algo_lib",
        kind: "repo",
      },
      {
        label: "fina-verify-lib",
        href: "https://github.com/vickyPotheesh2004/Fina_verify_lib",
        kind: "repo",
      },
      {
        label: "fina-logic-lib",
        href: "https://github.com/vickyPotheesh2004/Fina_logic_lib",
        kind: "repo",
      },
      {
        label: "fina-pattern-lib",
        href: "https://github.com/vickyPotheesh2004/Fina_pattern_lib",
        kind: "repo",
      },
      {
        label: "fina-format-lib",
        href: "https://github.com/vickyPotheesh2004/Fina_format_lib",
        kind: "repo",
      },
      {
        label: "fina_question_lib",
        href: "https://github.com/vickyPotheesh2004/fina_question_lib",
        kind: "repo",
      },
      {
        label: "PyPI — fina-maths-lib",
        href: "https://pypi.org/project/fina-maths-lib/",
        kind: "package",
      },
      {
        label: "PyPI — fina-algo-lib",
        href: "https://pypi.org/project/fina-algo-lib/",
        kind: "package",
      },
    ],
    video: {
      src: "/videos/fina-suite.mp4",
      poster: "/videos/posters/fina-suite.jpg",
      caption: "Deterministic formatting and registry-driven rendering from the library suite.",
      confidence: "inferred",
    },
    related: ["finbench", "researchhelp", "causa"],
  },

  /* ------------------------------------------------------------------ 09 */
  {
    slug: "myprint",
    title: "Instant USB Print Hub",
    tagline:
      "Scan a QR code on a printer, upload from your phone, print. No app, no account, no internet.",
    category: "Local tooling · Security",
    year: "2026",
    status: "shipped",
    statusNote:
      "A complete, tested local application with an automated test suite covering its validation and cleanup paths.",
    featured: false,
    order: 9,
    role: "Solo — architecture, security model, implementation, test suite",
    summary: [
      "Print shops and shared offices have a recurring problem: getting a file from someone's phone to a printer that is plugged into a different computer. This tool solves it with the least possible ceremony — the server prints a QR code in the terminal, the customer scans it, and a local web page opens with no signup and no installation.",
      "What makes it interesting is the security posture for something so small. Uploaded filenames are discarded and replaced with UUIDs, file types are validated by inspecting raw magic-number bytes rather than trusting the extension, system calls pass arguments as lists so shell injection is impossible, and temporary files are deleted in a guaranteed finally block immediately after the spooler takes them.",
    ],
    problem:
      "Moving a file from a phone to a USB-attached printer usually means an email, a USB stick, a chat app, or a cloud service — all of which require internet access, an account, or both, and several of which retain the document afterwards.",
    audience:
      "Print shops, shared offices and any environment where a printer is attached to one machine but the people printing are on their phones.",
    constraints: [
      "Must work entirely on the local network with no internet and no cloud database.",
      "No signup and no app installation for the end user.",
      "Uploaded files must not be retained after printing.",
      "Untrusted file uploads must not be able to execute anything.",
    ],
    approach: [
      "Run a local server that prints a Unicode QR code in the terminal alongside the LAN address.",
      "Serve a mobile-first upload page reachable by scanning that code.",
      "Validate every upload by inspecting raw file signature bytes, rejecting renamed executables.",
      "Replace incoming filenames with secure UUIDv4 strings so a malicious name cannot influence the filesystem.",
      "Spool through the OS print subsystem — win32print on Windows, CUPS elsewhere — with arguments passed as lists.",
      "Support page ranges, grayscale or colour, one to ten copies, and long-edge duplexing at session level.",
      "Delete temporary files inside a guaranteed finally block straight after handoff.",
      "Fall back to plain-text A4 rendering for DOCX files when MS Word is not installed, rather than failing the job.",
    ],
    stack: [
      "Python 3.10+",
      "Local HTTP server",
      "win32print / CUPS",
      "MS Word COM dispatch (optional)",
      "QR code terminal rendering",
      "Custom test suite",
    ],
    pipeline: [
      {
        id: "01",
        name: "Server launch",
        detail: "The launcher starts the local server and prints a QR code with the LAN address.",
        role: "input",
      },
      {
        id: "02",
        name: "QR scan",
        detail: "The user scans the terminal QR code with a phone on the same subnet.",
        role: "input",
      },
      {
        id: "03",
        name: "Upload",
        detail: "A file is uploaded from the phone to the local server — never leaving the LAN.",
        role: "process",
      },
      {
        id: "04",
        name: "MIME validation",
        detail: "Raw magic-number bytes are inspected to confirm the real file type.",
        role: "validation",
      },
      {
        id: "05",
        name: "Filename neutralisation",
        detail: "The supplied name is discarded and replaced with a UUIDv4 string.",
        role: "validation",
      },
      {
        id: "06",
        name: "Option mapping",
        detail: "Page range, colour mode, copy count and duplexing are applied to the job.",
        role: "process",
      },
      {
        id: "07",
        name: "Spool handoff",
        detail: "The file is passed to the OS print subsystem with list-form arguments.",
        role: "output",
      },
      {
        id: "08",
        name: "Guaranteed cleanup",
        detail: "Temporary files are unlinked in a finally block immediately after handoff.",
        role: "validation",
      },
    ],
    dataFlow: [
      {
        from: "Terminal launcher",
        to: "Phone browser",
        payload: "QR code encoding the local LAN URL",
      },
      {
        from: "Phone",
        to: "Local server",
        payload: "Uploaded file bytes over the local subnet only",
      },
      {
        from: "Upload",
        to: "Validator",
        payload: "File bytes inspected for magic-number signatures",
      },
      {
        from: "Validator",
        to: "Spooler",
        payload: "Accepted file renamed to a UUIDv4 with options attached",
      },
      {
        from: "Spooler",
        to: "USB printer",
        payload: "Print job via win32print or CUPS",
      },
      {
        from: "Spooler handoff",
        to: "Cleanup",
        payload: "Temporary path scheduled for unconditional deletion",
      },
    ],
    techniques: [
      "Magic-number file signature validation",
      "Filename neutralisation with UUIDv4 substitution",
      "Argument-list system calls to eliminate shell injection",
      "Guaranteed cleanup via finally blocks",
      "Local-only operation with no external dependency",
      "Graceful format fallback rather than job failure",
    ],
    implementation: [
      {
        title: "Extension checking is not validation",
        detail:
          "A renamed executable passes an extension check. Inspecting the raw signature bytes at the start of the file is what actually distinguishes a PDF from something else.",
      },
      {
        title: "The filename never touches the filesystem",
        detail:
          "Discarding the supplied name and substituting a UUIDv4 removes a whole class of overwrite and path-traversal problems before they can be exploited.",
      },
      {
        title: "Deletion in a finally block",
        detail:
          "Cleanup is unconditional rather than dependent on the success path, which is what makes the zero-retention claim hold even when printing fails.",
      },
      {
        title: "Degrade instead of failing",
        detail:
          "If Microsoft Word is absent, DOCX jobs are rendered as plain text on A4 rather than erroring — the operator gets a usable printout instead of a support ticket.",
      },
    ],
    verification: [
      {
        title: "Automated test suite",
        detail:
          "The repository documents a test suite covering MIME validation, page-range bounds, corrupt file handling and safe storage cleanup.",
      },
      {
        title: "Explicit threat model",
        detail:
          "The README states the specific attack classes eliminated — shell execution and disk overwrite — and the mechanism used for each.",
      },
    ],
    results: [
      {
        label: "External dependencies",
        value: "None at runtime",
        evidence: "reported",
        source: "README — no cloud database, no internet, no payment gateway",
      },
      {
        label: "File retention",
        value: "Zero after handoff",
        evidence: "reported",
        source: "README — os.unlink() in a guaranteed finally block",
      },
      {
        label: "Print options",
        value: "Page range, colour, copies, duplex",
        evidence: "reported",
        source: "README feature list",
      },
    ],
    limitations: [
      "Requires the phone and the host machine to be on the same local subnet.",
      "Windows is the primary target; CUPS support exists but is less exercised.",
      "There is no authentication — anyone on the subnet can reach the upload page, which is a deliberate trade-off for zero-friction use in a controlled location.",
      "Concurrent print jobs from many devices are not queued or prioritised.",
      "Best-effort text rendering for DOCX without Word will not preserve complex layout.",
    ],
    futureWork: [
      "Add an optional PIN or printed-once token to limit access to people physically present.",
      "Add a job queue with per-device fairness for busier environments.",
      "Package as a single executable so operators do not need a Python install.",
      "Add Linux-focused parity testing for the CUPS path.",
    ],
    caveat:
      "Designed for a trusted local network. There is intentionally no authentication, so it should not be exposed to the public internet.",
    links: [
      {
        label: "Source repository",
        href: "https://github.com/vickyPotheesh2004/myprint",
        kind: "repo",
      },
    ],
    related: ["smartkitchen", "arome"],
  },

  /* ------------------------------------------------------------------ 10 */
  {
    slug: "smartkitchen",
    title: "AI Smart Kitchen Companion",
    tagline:
      "Meal planning that starts from what you actually have — budget, pantry, time, mood and dietary needs.",
    category: "Applied AI · Product design",
    year: "2026",
    status: "documented-design",
    statusNote:
      "IMPORTANT: the repository contains the full specification, architecture and a working demonstration video, but the application source code is not published in it. This entry documents the design and the recorded demo — it is not a claim of published source.",
    featured: false,
    order: 10,
    role: "Design and implementation — source not published",
    summary: [
      "The Smart Kitchen Companion addresses a specific daily friction: deciding what to cook. Instead of presenting hundreds of recipes, it takes the constraints a person actually has — budget, ingredients on hand, available time, dietary preferences, health goals and even current mood — and generates a personalised plan with a grocery list, nutrition summary and cooking timeline.",
      "It is documented as a full-stack design: a Next.js front end, an Express back end, and an AI layer through OpenRouter. Pantry contents can be entered manually or detected from a photograph using a vision model.",
    ],
    problem:
      "Recipe search assumes you have already decided what you want. The real constraint is the opposite: you have specific ingredients, limited time and a budget, and you need to know what can be made from exactly that.",
    audience:
      "Households trying to reduce food waste and cooking decisions fatigue, particularly where budget and pantry contents are the binding constraints.",
    constraints: [
      "Recommendations must respect budget, time and dietary limits simultaneously.",
      "Pantry input has to work without tedious manual entry.",
      "Nutrition and cost information should accompany the recommendation, not be a separate lookup.",
      "API keys must stay server-side.",
    ],
    approach: [
      "Capture the user's situation: budget, pantry contents, cooking time, dietary preferences, health goals, cuisine and mood.",
      "Accept pantry input manually or by detecting ingredients from a photograph through a vision model.",
      "Send the assembled context to a reasoning model via OpenRouter on the server, never from the client.",
      "Generate a personalised meal plan with substitutions for missing or unwanted ingredients.",
      "Derive a smart grocery list from the gap between the plan and current pantry contents.",
      "Produce a nutrition dashboard, a budget analysis and a cooking timeline for the plan.",
      "Suggest uses for leftovers and allow the plan to be exported.",
    ],
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "shadcn/ui",
      "Node.js",
      "Express",
      "OpenRouter API",
      "Google Gemma (reasoning)",
      "Vision model for pantry detection",
    ],
    pipeline: [
      {
        id: "01",
        name: "Situation capture",
        detail: "Budget, time available, dietary preferences, health goals, cuisine and mood are collected.",
        role: "input",
      },
      {
        id: "02",
        name: "Pantry input",
        detail: "Ingredients are entered manually or detected from a pantry photograph by a vision model.",
        role: "input",
      },
      {
        id: "03",
        name: "Server-side AI call",
        detail: "The assembled context is sent to OpenRouter from Express, keeping keys off the client.",
        role: "process",
      },
      {
        id: "04",
        name: "Mood analysis",
        detail: "Current mood influences which category of meal is recommended.",
        role: "reasoning",
      },
      {
        id: "05",
        name: "Meal planning",
        detail: "A meal plan is generated against the stated constraints rather than from a fixed recipe list.",
        role: "reasoning",
      },
      {
        id: "06",
        name: "Substitutions",
        detail: "Missing or unwanted ingredients are replaced with workable alternatives.",
        role: "process",
      },
      {
        id: "07",
        name: "Nutrition and budget",
        detail: "Nutritional summary and budget analysis are derived for the plan.",
        role: "process",
      },
      {
        id: "08",
        name: "Grocery list",
        detail: "The gap between the plan and current pantry contents becomes a shopping list.",
        role: "output",
      },
      {
        id: "09",
        name: "Cooking timeline",
        detail: "Steps are sequenced into a workable cooking order.",
        role: "output",
      },
      {
        id: "10",
        name: "Leftovers and export",
        detail: "Leftover suggestions are generated and the plan can be exported.",
        role: "output",
      },
    ],
    dataFlow: [
      {
        from: "User",
        to: "Client application",
        payload: "Budget, time, dietary preferences, health goals, mood",
      },
      {
        from: "Pantry photo",
        to: "Vision model",
        payload: "Image of pantry contents",
      },
      {
        from: "Vision model",
        to: "Pantry store",
        payload: "Detected ingredient list",
      },
      {
        from: "Client",
        to: "Express backend",
        payload: "Full situation context plus pantry contents",
      },
      {
        from: "Express backend",
        to: "OpenRouter",
        payload: "Reasoning request with server-held API key",
      },
      {
        from: "OpenRouter",
        to: "Backend",
        payload: "Meal plan, substitutions, nutrition and budget analysis",
      },
      {
        from: "Backend",
        to: "Client",
        payload: "Plan, grocery list, timeline, leftover suggestions",
      },
    ],
    techniques: [
      "Constraint-based meal planning from user situation rather than search",
      "Vision-based pantry recognition",
      "Ingredient substitution reasoning",
      "Budget optimisation against the generated plan",
      "Server-side API key handling",
      "Input validation and error handling on all requests",
    ],
    implementation: [
      {
        title: "The situation is the query",
        detail:
          "Rather than searching recipes then filtering, the plan is generated from the constraints simultaneously — which is what allows budget, time and pantry contents to be satisfied together.",
      },
      {
        title: "Server-side AI requests only",
        detail:
          "OpenRouter calls are made from the Express layer so keys never reach the browser, which the repository lists explicitly under security.",
      },
      {
        title: "Pantry recognition removes the friction that kills these apps",
        detail:
          "Manual inventory entry is the step users abandon. Photographing the pantry is what makes the input realistically maintainable.",
      },
    ],
    verification: [
      {
        title: "Working demonstration recorded",
        detail:
          "An 89-second screen recording of the application running accompanies this entry, showing the flow from input through to a generated plan.",
      },
      {
        title: "Architecture documented in the repository",
        detail:
          "The README specifies the front-end, back-end and AI service layers, the AI workflow, the project structure and the environment variables required.",
      },
    ],
    results: [
      {
        label: "Documented features",
        value: "12",
        evidence: "reported",
        source: "Repository README feature list",
      },
      {
        label: "Demonstration video",
        value: "89 seconds, running application",
        evidence: "verified",
        source: "Video file inspected during this build — 720×1280, H.264, 30 fps",
      },
      {
        label: "Application source",
        value: "Not published",
        evidence: "verified",
        source: "Repository contains documentation only; no application source tree",
      },
    ],
    limitations: [
      "The application source code is not published, so none of the implementation claims can be independently inspected. This entry rests on the specification and the demonstration video.",
      "Nutrition estimates derived from a language model are approximate and must not be treated as dietary or medical advice.",
      "Budget analysis accuracy depends on regional ingredient pricing, which the design does not specify a source for.",
      "Vision-based pantry detection accuracy on cluttered shelves is unmeasured.",
      "It requires an external API for its core reasoning, so it is not a local or offline system.",
    ],
    futureWork: [
      "Publish the application source so the implementation can be inspected and reproduced.",
      "Add a regional price data source so budget analysis reflects real local costs.",
      "Measure pantry detection accuracy on a labelled set of pantry photographs.",
      "Add an offline fallback so basic planning works without the AI service.",
    ],
    caveat:
      "The repository documents the design and the demonstration video shows the application working, but the application source code is not publicly available. Nothing here should be read as a claim of published source, and the nutrition output is not dietary advice.",
    links: [
      {
        label: "Design documentation",
        href: "https://github.com/vickyPotheesh2004/food-series-",
        kind: "repo",
      },
    ],
    video: {
      src: "/videos/smartkitchen.mp4",
      poster: "/videos/posters/smartkitchen.jpg",
      caption: "Demonstration of the full flow — situation input, pantry recognition and a generated meal plan.",
      confidence: "confirmed",
    },
    related: ["arome", "myprint"],
  },

  /* ------------------------------------------------------------------ 11 */
  {
    slug: "arome",
    title: "Arome Haven — Coffee Recommendation",
    tagline:
      "A swipe-based coffee recommendation interface, built as the front end for a planned taste-modelling layer.",
    category: "Front end · Product prototype",
    year: "2026",
    status: "prototype",
    statusNote:
      "Honest scope: the repository's own status table marks the AI recommendation engine and the backend as not implemented. What exists is the front-end interaction, the component architecture and the service layer built to receive them.",
    featured: false,
    order: 11,
    role: "Solo — architecture, component design, interaction pattern",
    summary: [
      "Arome Haven attacks a small, well-defined annoyance: coffee menus are long, unpersonalised, and unhelpful to someone who does not already know what they want. The answer is a card-swipe interface that turns menu browsing into a fast series of decisions.",
      "It is included here as an example of honest scoping. The interface, state management and service layer are real and TypeScript-typed; the recommendation model and backend are not built yet, and the repository says so explicitly rather than implying otherwise.",
    ],
    problem:
      "Menu choice is a decision problem, not a display problem. A list of forty drinks with descriptions helps the person who already knows what they want and actively obstructs everyone else.",
    audience:
      "Café customers deciding quickly, and cafés wanting a menu interface that requires no staff explanation.",
    constraints: [
      "Selection has to be faster than reading a menu.",
      "Must work well on the phone, which is where the decision is actually made.",
      "The recommendation surface must be defined now so the model can be added without rework.",
    ],
    approach: [
      "Model the recommendation as a sequence of binary preference signals rather than a form.",
      "Build the interaction as swipeable cards so each decision is one gesture.",
      "Structure the application so data access sits behind a service layer, ready for a real backend.",
      "Hold preference state in a context provider so a future model can consume it directly.",
      "Keep the component layer reusable so new card types do not require new patterns.",
    ],
    stack: [
      "React",
      "TypeScript",
      "Vite",
      "Context-based state management",
      "Layered service abstraction",
    ],
    pipeline: [
      {
        id: "01",
        name: "Card presented",
        detail: "A drink is presented as a swipeable card with visual detail rather than a list row.",
        role: "input",
      },
      {
        id: "02",
        name: "Preference gesture",
        detail: "The user swipes to signal interest or disinterest — one gesture per decision.",
        role: "input",
      },
      {
        id: "03",
        name: "State capture",
        detail: "Preferences accumulate in a context provider as structured signals.",
        role: "process",
      },
      {
        id: "04",
        name: "Service layer",
        detail: "Data access is isolated behind a service boundary so a backend can be introduced without touching components.",
        role: "process",
      },
      {
        id: "05",
        name: "Ranking",
        detail: "PLANNED — a recommendation model would rank menu items from the captured signals. Not implemented.",
        role: "reasoning",
      },
      {
        id: "06",
        name: "Result",
        detail: "The best-matching drinks are presented visually.",
        role: "output",
      },
    ],
    dataFlow: [
      {
        from: "Menu catalogue",
        to: "Card component",
        payload: "Drink metadata rendered as a swipeable card",
      },
      {
        from: "User gesture",
        to: "Preference context",
        payload: "Structured like/dislike signal per drink",
      },
      {
        from: "Preference context",
        to: "Service layer",
        payload: "Accumulated preference state",
      },
      {
        from: "Service layer",
        to: "Ranking model",
        payload: "PLANNED — preferences sent for scoring. Not implemented.",
      },
      {
        from: "Ranked results",
        to: "Results view",
        payload: "Best matches displayed to the user",
      },
    ],
    techniques: [
      "Gesture-driven preference capture in place of a form",
      "Context provider for cross-component state",
      "Service-layer abstraction to decouple UI from data access",
      "Typed component architecture with TypeScript",
    ],
    implementation: [
      {
        title: "Preference elicitation without a questionnaire",
        detail:
          "Swipe gestures collect the same signal a preference form would, without the form — which is the entire reason the interaction is worth building.",
      },
      {
        title: "The seams are already in place",
        detail:
          "A service layer and a preference context mean the planned model can be dropped in behind an existing interface rather than forcing a rewrite.",
      },
      {
        title: "Scope stated in the repository itself",
        detail:
          "The project's own status table marks swipe logic as in progress and both AI recommendation and backend as not implemented.",
      },
    ],
    verification: [
      {
        title: "Explicit status table",
        detail:
          "The README contains a feature-by-feature status table, which makes the boundary between built and planned checkable rather than implied.",
      },
      {
        title: "Repository language",
        detail:
          "The project describes itself as an AI-inspired frontend-focused prototype built with scalability in mind for future AI and backend integration.",
      },
    ],
    results: [
      {
        label: "Front end",
        value: "Built",
        evidence: "reported",
        source: "README status table — frontend setup and UI components complete",
      },
      {
        label: "Swipe interaction",
        value: "In progress",
        evidence: "reported",
        source: "README status table",
      },
      {
        label: "AI recommendation",
        value: "Not implemented",
        evidence: "reported",
        source: "README status table",
      },
      {
        label: "Backend",
        value: "Not implemented",
        evidence: "reported",
        source: "README status table",
      },
    ],
    limitations: [
      "There is no recommendation model. Despite the project's framing, no AI ranking is implemented — the repository says so plainly.",
      "There is no backend, so menu data is not served from a real source.",
      "Swipe behaviour is marked as still in progress, so the interaction is not finished.",
      "Preference signals are captured but never used for anything, because nothing consumes them yet.",
      "It is a prototype, not a deployed product.",
    ],
    futureWork: [
      "Implement the taste-preference model that consumes the captured signals.",
      "Add a backend service and a real café menu data source.",
      "Add feedback-based learning so recommendations improve from outcomes.",
      "Add user profiles and order history.",
      "Ship as a PWA so it works from a phone home screen.",
    ],
    caveat:
      "This is a front-end prototype. The AI recommendation engine and backend are explicitly not implemented in the repository's own status table, and are listed here under future work rather than as delivered features.",
    links: [
      {
        label: "Source repository",
        href: "https://github.com/vickyPotheesh2004/Arome-haven-",
        kind: "repo",
      },
    ],
    video: {
      src: "/videos/arome.mp4",
      poster: "/videos/posters/arome.jpg",
      caption: "Swipe-based menu interaction in the prototype interface.",
      confidence: "confirmed",
    },
    related: ["smartkitchen", "myprint", "varsha"],
  },

  /* ------------------------------------------------------------------ 12 */
  {
    slug: "data-analyst",
    title: "Data-Analyst — Data to Graph Generator",
    tagline: "A small web application that turns raw tabular data into visualisations.",
    category: "Data tooling · Web application",
    year: "2025",
    status: "prototype",
    statusNote:
      "A small, self-contained tool. It is listed for completeness rather than presented as a major system — the repository's own description is one sentence long.",
    featured: false,
    order: 12,
    role: "Solo — build",
    summary: [
      "A focused utility: take raw data, produce graphs from it, in the browser, without a data-science environment. It was built quickly as a proof that the round trip from pasted data to a rendered chart can be made immediate.",
      "It is included because a portfolio should show range and honesty rather than only flagship work. It is a small tool, and it is described here as one.",
    ],
    problem:
      "Producing a quick chart from a small dataset usually means opening a notebook, installing libraries and writing plotting code. For a one-off visual check of some numbers, that is disproportionate.",
    audience: "Anyone who needs a fast visual read of a small dataset without a notebook environment.",
    constraints: [
      "Must run in the browser with no local setup.",
      "Must accept raw pasted data rather than requiring a specific file format.",
      "Small enough to stay fast and dependency-light.",
    ],
    approach: [
      "Provide a browser interface for pasting or loading data.",
      "Transform the input into a chart configuration automatically.",
      "Render the result in the browser using a client-side charting approach.",
      "Keep the app a single-purpose utility with a small dependency surface.",
    ],
    stack: ["TypeScript", "React", "Vite", "Tailwind CSS"],
    pipeline: [
      {
        id: "01",
        name: "Data input",
        detail: "Raw tabular data is pasted into the interface.",
        role: "input",
      },
      {
        id: "02",
        name: "Parsing",
        detail: "The input is interpreted into a structured series suitable for charting.",
        role: "process",
      },
      {
        id: "03",
        name: "Chart mapping",
        detail: "Data columns are mapped to chart axes and series.",
        role: "process",
      },
      {
        id: "04",
        name: "Render",
        detail: "The graph is rendered in the browser for immediate inspection.",
        role: "output",
      },
    ],
    dataFlow: [
      {
        from: "User",
        to: "Input surface",
        payload: "Pasted or uploaded raw data",
      },
      {
        from: "Input surface",
        to: "Parser",
        payload: "Unstructured tabular text",
      },
      {
        from: "Parser",
        to: "Chart component",
        payload: "Structured series with labels and values",
      },
    ],
    techniques: [
      "Client-side data parsing",
      "Automatic chart configuration from data shape",
      "Lightweight SPA build with Vite",
    ],
    implementation: [
      {
        title: "Built for speed of insight, not analytical depth",
        detail:
          "The design target is the two-minute check — get numbers in, see a shape, move on. It is not intended to replace a notebook for real analysis.",
      },
    ],
    verification: [
      {
        title: "Repository is public",
        detail: "The source is available in the Data-Analyst repository.",
      },
      {
        title: "Honest scope in the repository description",
        detail:
          "The project describes itself as a small automation built quickly with AI tooling rather than as a research system.",
      },
    ],
    results: [
      {
        label: "Language",
        value: "TypeScript",
        evidence: "verified",
        source: "Repository language detected as TypeScript",
      },
      {
        label: "Build tooling",
        value: "Vite-based SPA",
        evidence: "verified",
        source: "Repository contents checked during this build",
      },
    ],
    limitations: [
      "No test suite is published, so correctness of the parsing and mapping is unverified.",
      "There is no deployment URL, so it must be run locally.",
      "Data handling and error cases for malformed input are not documented.",
      "It has no backend, so it cannot persist or share a chart.",
    ],
    futureWork: [
      "Add input validation and clear error messages for malformed data.",
      "Add chart type selection rather than relying on automatic inference.",
      "Add export so a generated chart can be shared.",
      "Deploy it so the tool is reachable without a local build.",
    ],
    caveat:
      "A small utility, listed for completeness. The repository description is a single sentence and there is no published test suite.",
    links: [
      {
        label: "Source repository",
        href: "https://github.com/vickyPotheesh2004/Data-Analyst",
        kind: "repo",
      },
    ],
    video: {
      src: "/videos/data-analyst.mp4",
      poster: "/videos/posters/data-analyst.jpg",
      caption: "Raw data entered and rendered as a graph in the browser.",
      confidence: "confirmed",
    },
    related: ["antigravity", "fina-suite"],
  },
];

/* ------------------------------------------------------------------ helpers */

export const PROJECTS_BY_SLUG = new Map(PROJECTS.map((p) => [p.slug, p]));

export function getProject(slug: string): Project | undefined {
  return PROJECTS_BY_SLUG.get(slug);
}

export const FEATURED_PROJECTS = PROJECTS.filter((p) => p.featured).sort(
  (a, b) => a.order - b.order,
);

export const SORTED_PROJECTS = [...PROJECTS].sort((a, b) => a.order - b.order);

export function getRelated(slugs: string[]): Project[] {
  return slugs
    .map((s) => PROJECTS_BY_SLUG.get(s))
    .filter((p): p is Project => Boolean(p));
}

/**
 * Honest aggregate counters used on the home page and projects index.
 * `verified` counts only things checked first-hand during the build.
 */
export const PROJECT_STATS = {
  total: PROJECTS.length,
  shipped: PROJECTS.filter((p) => p.status === "shipped").length,
  withLiveDemo: PROJECTS.filter((p) => p.links.some((l) => l.kind === "live")).length,
  publishedPackages: 7,
  videos: PROJECTS.filter((p) => p.video).length,
  /** Videos matched by filename/subject only and still awaiting visual confirmation. */
  inferredVideos: PROJECTS.filter((p) => p.video?.confidence === "inferred").length,
} as const;

/** Finder used by the media pipeline and by link-checking. */
export function videoSourceProjects(): { slug: string; src: string }[] {
  return PROJECTS.filter((p) => p.video).map((p) => ({
    slug: p.slug,
    src: p.video!.src,
  }));
}
