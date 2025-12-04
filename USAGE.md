# Prototype Analyzer - PRD Extraction from GitHub Repositories

An intelligent multi-agent system powered by [crewAI](https://crewai.com) that extracts Product Requirements Document (PRD) information from GitHub repositories. The system uses 11 specialized AI agents working in parallel to analyze repositories and extract structured PRD data.

## Features

- 🤖 **11 Specialized Agents**: Each agent focuses on extracting specific PRD sections
- ⚡ **Parallel Execution**: All agents run concurrently for fast analysis  
- 🔍 **GitHub Integration**: Direct repository analysis via GitHub API with PAT authentication
- 📊 **Structured Output**: Generates comprehensive PRD in JSON format
- 🚫 **Hallucination Prevention**: Agents explicitly report "not found" instead of inventing information
- 📝 **Pydantic Models**: Type-safe output with validation

## What Gets Extracted

The system extracts 11 major PRD sections:

1. **Project Metadata** - Name, client, date, description
2. **Brand Foundations** - Mission, vision, values, brand identity
3. **Target Audience** - User personas, pain points, demographics
4. **Positioning & Messaging** - Tagline, value proposition, messaging
5. **Visual Identity** - Colors, typography, design system
6. **Competitive Analysis** - Market positioning, competitors
7. **Problem Definition** - Problem statements, constraints, context
8. **Solution Overview** - Features, value proposition, differentiators
9. **Customer Profiles** - ICP, buyer personas, segments
10. **Lean Canvas** - Business model, channels, revenue streams
11. **Technical Architecture** - Tech stack, dependencies, APIs

## Setup

### Prerequisites

- Python 3.10-3.13
- GitHub Personal Access Token
- OpenAI API Key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/prototype-analyzer.git
cd prototype-analyzer
```

2. Install dependencies:
```bash
crewai install
```

3. Configure environment variables in `.env`:
```bash
# OpenAI API Key (required)
OPENAI_API_KEY=your_openai_key_here

# GitHub Personal Access Token (required)
# Create at: https://github.com/settings/tokens
# Scopes needed: repo (for private) or public_repo (for public repos)
GITHUB_PERSONAL_ACCESS_TOKEN=your_github_token_here

# Model configuration
MODEL=gpt-4.1-mini-2025-04-14
```

### Getting Your GitHub Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes:
   - `public_repo` - for public repositories only
   - `repo` - for private repositories access
4. Copy the token to your `.env` file

## Usage

### Run PRD Extraction

```bash
# Interactive mode (prompts for repo URL)
crewai run

# With repository URL as argument
run_crew https://github.com/owner/repo-name
```

### Output

The system generates `prd_output.json` containing the extracted PRD structure:

```json
{
  "project": {
    "name": "Project Name",
    "client": "Client Org"
  },
  "brandFoundations": {
    "mission": "...",
    "vision": "..."
  }
}
```

Fields that couldn't be found in the repository will contain `"not found"`.

## Architecture

### Agent Specializations

Each agent is an expert in extracting specific information:

- **Project Metadata Extractor** - Analyzes README, package files
- **Brand Foundations Analyst** - Searches brand docs, about pages
- **Target Audience Researcher** - Finds persona docs, user research
- **Positioning Messaging Expert** - Extracts marketing copy, taglines
- **Visual Identity Extractor** - Analyzes design systems, CSS
- **Competitive Analyst** - Reviews competitive analysis docs
- **Problem Definition Specialist** - Identifies problem statements
- **Solution Overview Expert** - Extracts features, value props
- **Customer Profile Analyst** - Finds ICP, buyer personas
- **Lean Canvas Extractor** - Analyzes business model docs
- **Technical Architecture Analyst** - Reviews tech stack, dependencies

### Parallel Processing

All tasks execute asynchronously (`async_execution: true`) for maximum performance. The crew coordinates agent outputs into the final PRD JSON.

## Development

### Project Structure

```
prototype-analyzer/
├── src/prototype_analyzer/
│   ├── models/
│   │   └── prd_models.py        # Pydantic models for PRD sections
│   ├── tools/
│   │   ├── github_client.py     # GitHub API integration
│   │   └── github_mcp_tool.py   # CrewAI tool wrapper
│   ├── config/
│   │   ├── agents.yaml          # Agent definitions
│   │   └── tasks.yaml           # Task definitions
│   ├── crew.py                  # Crew orchestration
│   └── main.py                  # Entry point
├── pyproject.toml
└── README.md
```

### Customization

**Add New Extraction Sections:**

1. Add Pydantic model in `models/prd_models.py`
2. Define agent in `config/agents.yaml`
3. Define task in `config/tasks.yaml`
4. Wire in `crew.py`

**Modify Agent Behavior:**

Edit agent backstories in `config/agents.yaml` to change extraction focus or add specific instructions.

**Change Models:**

Update `MODEL` in `.env` to use different OpenAI models (gpt-4, gpt-3.5-turbo, etc.)

## How It Works

1. **Input**: User provides GitHub repository URL
2. **Parallel Analysis**: 11 agents simultaneously search repository for their assigned information
3. **GitHub Integration**: Agents use GitHub API to read files, search code, list directories
4. **Structured Extraction**: Each agent returns typed Pydantic model output
5. **Aggregation**: Crew combines all agent outputs into final PRD JSON
6. **Output**: Complete PRD saved to `prd_output.json`

## Hallucination Prevention

Agents are explicitly instructed to:
- Only report information actually found in repository
- Use "not found" for missing data
- Never speculate or invent information
- Quote exact content when possible

## Next Steps

1. **Set your GitHub PAT** in `.env`
2. **Test with a sample repo**: `run_crew https://github.com/your-test-repo`
3. **Review the output** in `prd_output.json`
4. **Customize agents** for your specific needs

## Support

For issues and questions, please open an issue on GitHub.
