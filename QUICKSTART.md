# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Get Your GitHub Token (2 minutes)

1. Go to: **https://github.com/settings/tokens**
2. Click: **"Generate new token (classic)"**
3. Give it a name: `Prototype Analyzer`
4. Select scope: 
   - ✅ `public_repo` (for public repositories)
   - OR ✅ `repo` (for private repositories)
5. Click: **"Generate token"**
6. **Copy the token** (you won't see it again!)

### Step 2: Configure Environment (1 minute)

Edit `.env` file in project root:

```bash
# Replace with your actual GitHub token
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_YourActualTokenHere1234567890

# OpenAI key already configured
OPENAI_API_KEY=sk-proj-...
MODEL=gpt-4.1-mini-2025-04-14
```

### Step 3: Run Your First Extraction (2 minutes)

```bash
# Method 1: Interactive (prompts for URL)
crewai run

# Method 2: Direct command
run_crew https://github.com/username/repository-name
```

## Example Run

```bash
# Analyze a sample repository
run_crew https://github.com/vercel/next.js

# The system will:
# 1. Deploy 11 AI agents in parallel
# 2. Search the repository for PRD information
# 3. Extract structured data
# 4. Save to prd_output.json
```

## What Happens Next?

1. **Analysis starts** - You'll see agents activating
2. **Parallel extraction** - 11 agents work simultaneously
3. **Progress updates** - Watch agents search the repository
4. **Output generated** - `prd_output.json` contains results

## Expected Output

The system creates `prd_output.json` with this structure:

```json
{
  "project": {
    "name": "Next.js",
    "description": "The React Framework for Production"
  },
  "technicalArchitecture": {
    "techStack": ["React", "Node.js", "TypeScript"],
    "dependencies": ["react", "webpack", "babel"]
  },
  "brandFoundations": {
    "mission": "not found",
    "vision": "not found"
  }
}
```

Fields the agents couldn't find show `"not found"`.

## Verify Setup

Before running, check your configuration:

```bash
python check_setup.py
```

Should show:
```
✅ OpenAI API Key configured
✅ GitHub Personal Access Token configured
✅ Python version 3.13 is compatible
✅ CrewAI installed
✅ Requests library installed
✅ PRD models available

🎉 All checks passed! You're ready to run the analyzer.
```

## Troubleshooting

### "GITHUB_PERSONAL_ACCESS_TOKEN not set"
- Make sure you edited `.env` file
- Replace `your_github_token_here` with actual token
- No quotes needed around the token

### "CrewAI not installed"
```bash
crewai install
```

### "Rate limit exceeded"
- Your GitHub token might be invalid
- Check token hasn't expired
- Ensure correct scopes selected

## Advanced Usage

### Analyze Private Repository
```bash
# Make sure your GitHub token has 'repo' scope (not just 'public_repo')
run_crew https://github.com/your-org/private-repo
```

### Analyze Specific Branch
```bash
# Edit github_client.py and set ref parameter:
# ref="develop" instead of ref="main"
```

### Custom Model
Edit `.env`:
```bash
MODEL=gpt-4  # More powerful but more expensive
# or
MODEL=gpt-3.5-turbo  # Faster and cheaper
```

## What Gets Analyzed?

The agents search for:

✅ **README files** - Project description, features  
✅ **Package files** - Dependencies, tech stack  
✅ **Documentation** - Brand info, user guides  
✅ **Code structure** - Architecture patterns  
✅ **Configuration** - Design tokens, settings  
✅ **Issue templates** - Problem statements  
✅ **Contributing guides** - Development process  

## Tips for Best Results

1. **Well-documented repos work best** - More docs = better extraction
2. **Public repos easier** - No authentication issues
3. **Review output** - Check "not found" fields manually
4. **Iterate** - Try different repos to see patterns

## Next Steps

After your first successful run:

1. **Review the output** in `prd_output.json`
2. **Try different repositories** to compare results
3. **Customize agents** in `config/agents.yaml` for your needs
4. **Add new sections** following the customization guide

## Support

- **Check errors**: Review terminal output for specific issues
- **Validate setup**: Run `python check_setup.py`
- **Read docs**: See `USAGE.md` for detailed information

---

**Ready?** Add your GitHub token to `.env` and run:

```bash
crewai run
```

🎉 Enjoy your automated PRD extraction!
