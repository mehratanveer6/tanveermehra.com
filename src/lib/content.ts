/**
 * Single source of truth for every fact rendered in /work.
 *
 * Everything in this file traces back to either:
 *  - resume_the_resume.pdf (the canonical source), or
 *  - this project's own pre-existing files (e.g. the "AI Product Engineer"
 *    line already used in the root layout's metadata).
 *
 * Nothing here is invented. If a fact needs to change, change it here —
 * every component reads from this file rather than hardcoding copy.
 */

export const profile = {
  name: "Tanveer Mehra",
  firstName: "Tanveer",
  lastName: "Mehra",
  role: "AI Product Engineer",
  location: "Chandigarh, India",
  email: "tanveermehracs@gmail.com",
  github: "https://github.com/mehratanveer6",
  githubHandle: "mehratanveer6",
  linkedin: "https://linkedin.com/in/mehratanveer/",
  twitter: "https://x.com/mehratanveer6",
} as const;

export const education = {
  school: "Chandigarh University",
  degree: "B.E., Computer Science Engineering",
  specialization: "IBM specialization in AI & ML",
  graduation: "Expected 2028",
  coursework: [
    "Data Structures",
    "Algorithms",
    "Databases",
    "Machine Learning",
    "Computer Networks",
    "Computer Architecture",
  ],
  certification: {
    name: "AWS Certified Machine Learning Engineer – Associate",
    status: "In progress",
  },
} as const;

export type SkillGroup = {
  label: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    label: "Languages",
    items: ["Python", "JavaScript", "C", "C++", "SQL (MySQL, PostgreSQL)"],
  },
  {
    label: "AI / ML",
    items: [
      "OpenAI API",
      "LangChain",
      "Librosa",
      "Prompt Engineering",
      "RAG",
      "Embeddings",
      "pgvector",
    ],
  },
  {
    label: "Backend / Frontend",
    items: [
      "FastAPI",
      "Node.js",
      "Express.js",
      "React",
      "REST APIs",
      "SQLAlchemy",
      "Chrome Extensions API",
    ],
  },
  {
    label: "Tools",
    items: ["Git", "GitHub", "VS Code", "Linux", "Railway", "Render"],
  },
];

export type ExperienceEntry = {
  company: string;
  role: string;
  period: string;
  summary: string;
  highlights: string[];
};

export const experience: ExperienceEntry = {
  company: "Taper Labs",
  role: "AI/ML Engineering Intern",
  period: "April 2026 — June 2026",
  summary:
    "Designed and trained classification models in PyTorch, and worked across the full pipeline from raw data to evaluated model.",
  highlights: [
    "Designed and trained a feedforward neural network for classification tasks in PyTorch, iterating on architecture depth and activation functions to improve validation accuracy.",
    "Contributed to neural network architecture design and training-pipeline development alongside the team.",
    "Preprocessed and cleaned training datasets, built data-augmentation pipelines, and evaluated model performance across precision, recall, and F1.",
  ],
};

export type Project = {
  slug: string;
  index: string;
  title: string;
  year: string;
  stack: string[];
  summary: string;
  problem: string;
  highlights: string[];
};

export const projects: Project[] = [
  {
    slug: "mcp-server-generator",
    index: "01",
    title: "MCP Server Generator",
    year: "2026",
    stack: ["Python", "TypeScript", "OpenAI API", "AST Parsing", "CLI"],
    summary:
      "A code-generation tool that turns a plain-language description or API spec into a working MCP server — built for a gap where LLMs like Codex tend to produce broken MCP boilerplate.",
    problem:
      "Coding models are good at writing plausible MCP servers and bad at writing correct ones — the boilerplate (tool definitions, schema declarations, handler bindings) is exactly the part that's tedious to hand-verify and easy to get subtly wrong.",
    highlights: [
      "AST-level validation of generated server code catches structural errors before output, so tool definitions, schema declarations, and handler bindings are well-formed without a manual review pass.",
      "Cut MCP server scaffolding from hours of manual correction down to under 60 seconds, tested across 10+ tool-definition patterns spanning file I/O, API wrappers, and database connectors.",
    ],
  },
  {
    slug: "mixmentor",
    index: "02",
    title: "MixMentor",
    year: "2026",
    stack: ["Python", "FastAPI", "Librosa", "OpenAI API", "React", "PostgreSQL"],
    summary:
      "A web app that listens to a mix the way an engineer would — extracting real acoustic features and turning them into genre-aware, timestamped feedback instead of generic notes.",
    problem:
      "Most AI mixing feedback is generic because it never actually looks at the audio. MixMentor grounds every note in measured signal data first.",
    highlights: [
      "Extracts acoustic features — spectral centroid, RMS energy, dynamic range, frequency-band distribution — with Librosa, and feeds the structured signal data into GPT-4 for genre-aware mixing feedback.",
      "A prompt schema converts raw signal analysis into timestamped feedback cards, grounding model responses in quantified audio characteristics rather than generic output.",
      "A reference-track comparison mode: upload a professional mix alongside your own and get a delta analysis of the key acoustic differences.",
    ],
  },
  {
    slug: "querymind",
    index: "03",
    title: "QueryMind",
    year: "2026",
    stack: ["Python", "FastAPI", "OpenAI API", "MySQL", "SQLAlchemy", "React"],
    summary:
      "A natural-language-to-SQL interface that reads a live database schema at query time, so it can answer complex multi-table questions instead of guessing at table names.",
    problem:
      "Generic NL-to-SQL tools fall apart on real schemas. QueryMind introspects the actual database first, so the model is grounded in what the tables really look like.",
    highlights: [
      "Introspects live database schemas at runtime and injects table and column context into structured prompts, producing accurate SQL for complex multi-table queries from plain English.",
      "A safety layer parses generated query ASTs before execution and blocks all mutating operations (DROP, DELETE, TRUNCATE) without explicit user confirmation.",
      "Supports multi-turn query refinement, holding schema and conversation context across turns.",
    ],
  },
];

export const getProjectBySlug = (slug: string) =>
  projects.find((project) => project.slug === slug);
