# System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          PROTOTYPE ANALYZER SYSTEM                          │
│                      Multi-Agent PRD Extraction System                       │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. USER INPUT                                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  $ run_crew https://github.com/owner/repo                                  │
│                                                                             │
│  OR                                                                         │
│                                                                             │
│  $ crewai run                                                               │
│  Enter GitHub repository URL: https://github.com/owner/repo                │
│                                                                             │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. ENTRY POINT (main.py)                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  • Parse repository URL                                                     │
│  • Initialize PrototypeAnalyzer crew                                        │
│  • Kickoff with inputs: { 'repo_url': url }                                │
│                                                                             │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 3. CREW ORCHESTRATION (crew.py)                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  PrototypeAnalyzer()                                                        │
│    ├─ Initialize GitHub client (PAT authentication)                        │
│    ├─ Load 11 agents from agents.yaml                                      │
│    ├─ Load 11 tasks from tasks.yaml                                        │
│    └─ Execute with Process.sequential + async_execution=True               │
│                                                                             │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 4. PARALLEL AGENT EXECUTION (11 agents working simultaneously)             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌─────────────────┐  │
│  │ Agent 1:             │  │ Agent 2:             │  │ Agent 3:        │  │
│  │ Project Metadata     │  │ Brand Foundations    │  │ Target Audience │  │
│  │ Extractor            │  │ Analyst              │  │ Researcher      │  │
│  └──────────────────────┘  └──────────────────────┘  └─────────────────┘  │
│                                                                             │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌─────────────────┐  │
│  │ Agent 4:             │  │ Agent 5:             │  │ Agent 6:        │  │
│  │ Positioning &        │  │ Visual Identity      │  │ Competitive     │  │
│  │ Messaging Expert     │  │ Extractor            │  │ Analyst         │  │
│  └──────────────────────┘  └──────────────────────┘  └─────────────────┘  │
│                                                                             │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌─────────────────┐  │
│  │ Agent 7:             │  │ Agent 8:             │  │ Agent 9:        │  │
│  │ Problem Definition   │  │ Solution Overview    │  │ Customer Profile│  │
│  │ Specialist           │  │ Expert               │  │ Analyst         │  │
│  └──────────────────────┘  └──────────────────────┘  └─────────────────┘  │
│                                                                             │
│  ┌──────────────────────┐  ┌──────────────────────┐                        │
│  │ Agent 10:            │  │ Agent 11:            │                        │
│  │ Lean Canvas          │  │ Technical            │                        │
│  │ Extractor            │  │ Architecture Analyst │                        │
│  └──────────────────────┘  └──────────────────────┘                        │
│                                                                             │
│  Each agent:                                                                │
│    • Receives repo_url from inputs                                          │
│    • Uses GitHub client to search repository                                │
│    • Extracts assigned PRD section                                          │
│    • Returns Pydantic model or "not found"                                  │
│                                                                             │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 5. GITHUB INTEGRATION (github_client.py)                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  GitHubMCPClient(token=GITHUB_PERSONAL_ACCESS_TOKEN)                        │
│    │                                                                         │
│    ├─ search_repository(owner, repo, query, path)                           │
│    │    └─> GitHub Search API with authentication                           │
│    │                                                                         │
│    ├─ get_file_contents(owner, repo, path, ref)                             │
│    │    └─> GitHub Contents API (README, docs, configs)                     │
│    │                                                                         │
│    └─ list_directory(owner, repo, path, ref)                                │
│         └─> GitHub Contents API (directory listings)                        │
│                                                                             │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 6. GITHUB REPOSITORY (Target for Analysis)                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Repository Structure Analyzed:                                             │
│    ├─ README.md                 ← Project metadata, description            │
│    ├─ docs/                     ← Documentation, brand info                │
│    ├─ package.json / pyproject  ← Dependencies, tech stack                 │
│    ├─ .github/                  ← Issue templates, workflows              │
│    ├─ src/ or lib/              ← Code structure, patterns                │
│    ├─ design/ or assets/        ← Visual identity, design tokens          │
│    └─ CONTRIBUTING.md           ← Development guidelines                  │
│                                                                             │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 7. STRUCTURED EXTRACTION (Pydantic Models)                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Each agent output validated against Pydantic model:                        │
│                                                                             │
│  ProjectMetadata          ✓  Type-safe validation                           │
│  BrandFoundations         ✓  Default "not found" values                     │
│  TargetAudienceSegment    ✓  Required fields enforcement                    │
│  PositioningAndMessaging  ✓  Structured output format                       │
│  VisualIdentity           ✓  Nested object validation                       │
│  CompetitiveAnalysis      ✓  List field validation                          │
│  ProblemDefinition        ✓  String/array type checking                     │
│  SolutionOverview         ✓  Consistent schema                              │
│  CustomerProfile          ✓  Profile structure validation                   │
│  LeanCanvas               ✓  Business model fields                          │
│  TechnicalArchitecture    ✓  Tech stack validation                          │
│                                                                             │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 8. OUTPUT AGGREGATION & GENERATION                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Combine all agent outputs into:                                            │
│                                                                             │
│  prd_output.json                                                            │
│  {                                                                          │
│    "project": { ... },              ← From Agent 1                          │
│    "brandFoundations": { ... },     ← From Agent 2                          │
│    "targetAudience": [ ... ],       ← From Agent 3                          │
│    "positioningAndMessaging": {},   ← From Agent 4                          │
│    "visualIdentity": { ... },       ← From Agent 5                          │
│    "competitiveAnalysis": { ... },  ← From Agent 6                          │
│    "problemDefinition": { ... },    ← From Agent 7                          │
│    "solutionOverview": { ... },     ← From Agent 8                          │
│    "customerProfiles": { ... },     ← From Agent 9                          │
│    "leanCanvas": { ... },           ← From Agent 10                         │
│    "technicalArchitecture": { ... } ← From Agent 11                         │
│  }                                                                          │
│                                                                             │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 9. OUTPUT DELIVERED                                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ✅ prd_output.json created                                                 │
│  ✅ Complete PRD structure with all 11 sections                             │
│  ✅ "not found" for missing information (no hallucinations)                 │
│  ✅ Ready for review and manual completion                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════
                              DATA FLOW SUMMARY
═══════════════════════════════════════════════════════════════════════════════

Input:  GitHub Repository URL
         ↓
Process: 11 Agents × GitHub API × Parallel Execution
         ↓
Validate: Pydantic Models × Type Safety × "not found" Defaults
         ↓
Output: Complete PRD JSON (11 sections)


═══════════════════════════════════════════════════════════════════════════════
                           PERFORMANCE METRICS
═══════════════════════════════════════════════════════════════════════════════

Execution Time:
  Sequential:   ~11 minutes (11 agents × 1 min each)
  Parallel:     ~1-2 minutes (all agents simultaneously)
  Speedup:      5-10x improvement

Accuracy:
  Hallucination Prevention:  ✓ Explicit "not found" reporting
  Type Safety:               ✓ Pydantic validation
  Structured Output:         ✓ Consistent JSON schema

Scalability:
  Add new agents:    Trivial (YAML config)
  Add new sections:  Easy (Pydantic model)
  Customize:         Flexible (backstory edits)


═══════════════════════════════════════════════════════════════════════════════
                        AUTHENTICATION & SECURITY
═══════════════════════════════════════════════════════════════════════════════

GitHub PAT (Personal Access Token)
  ├─ Stored in: .env file (not committed to git)
  ├─ Scopes: public_repo OR repo
  ├─ Used by: GitHubMCPClient
  └─ Rate limits: 5,000 requests/hour (authenticated)

OpenAI API Key
  ├─ Stored in: .env file (not committed to git)
  ├─ Used by: All 11 agents (LLM calls)
  └─ Model: gpt-4.1-mini-2025-04-14 (configurable)


═══════════════════════════════════════════════════════════════════════════════
                              KEY FEATURES
═══════════════════════════════════════════════════════════════════════════════

✅ Parallel Execution        → 5-10x faster than sequential
✅ Hallucination Prevention  → Explicit "not found" reporting
✅ Type Safety               → Pydantic model validation
✅ GitHub Integration        → Direct repository access via API
✅ Structured Output         → Consistent JSON schema
✅ Customizable              → Easy to modify agents/tasks
✅ Scalable                  → Add new sections effortlessly
✅ Production Ready          → Error handling, validation, docs
