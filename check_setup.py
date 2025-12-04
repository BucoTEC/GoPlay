"""
Quick setup validation script
Run this to check if your environment is configured correctly
"""
import os
import sys

def check_environment():
    """Validate environment configuration"""
    print("🔍 Checking Prototype Analyzer Setup...\n")
    
    issues = []
    warnings = []
    
    # Check OpenAI API Key
    openai_key = os.getenv("OPENAI_API_KEY")
    if not openai_key:
        issues.append("❌ OPENAI_API_KEY not set in .env file")
    elif openai_key == "your_openai_key_here":
        issues.append("❌ OPENAI_API_KEY still has placeholder value")
    else:
        print("✅ OpenAI API Key configured")
    
    # Check GitHub PAT
    github_token = os.getenv("GITHUB_PERSONAL_ACCESS_TOKEN")
    if not github_token:
        issues.append("❌ GITHUB_PERSONAL_ACCESS_TOKEN not set in .env file")
    elif github_token == "your_github_token_here":
        issues.append("❌ GITHUB_PERSONAL_ACCESS_TOKEN still has placeholder value")
    else:
        print("✅ GitHub Personal Access Token configured")
    
    # Check Python version
    python_version = sys.version_info
    if python_version.major == 3 and 10 <= python_version.minor <= 13:
        print(f"✅ Python version {python_version.major}.{python_version.minor} is compatible")
    else:
        warnings.append(f"⚠️  Python version {python_version.major}.{python_version.minor} - recommended: 3.10-3.13")
    
    # Try importing key dependencies
    try:
        import crewai
        print("✅ CrewAI installed")
    except ImportError:
        issues.append("❌ CrewAI not installed - run 'crewai install'")
    
    try:
        import requests
        print("✅ Requests library installed")
    except ImportError:
        issues.append("❌ Requests not installed - run 'crewai install'")
    
    try:
        from prototype_analyzer.models.prd_models import PRDOutput
        print("✅ PRD models available")
    except ImportError as e:
        issues.append(f"❌ Cannot import PRD models: {e}")
    
    # Summary
    print("\n" + "="*60)
    if not issues and not warnings:
        print("🎉 All checks passed! You're ready to run the analyzer.")
        print("\nNext step:")
        print("  run_crew https://github.com/owner/repo")
        return True
    else:
        if warnings:
            print("\n⚠️  Warnings:")
            for warning in warnings:
                print(f"  {warning}")
        
        if issues:
            print("\n❌ Issues found:")
            for issue in issues:
                print(f"  {issue}")
            print("\nPlease fix the issues above before running the analyzer.")
            print("\nSetup guide:")
            print("  1. Edit .env file and add your API keys")
            print("  2. Get GitHub token: https://github.com/settings/tokens")
            print("  3. Run: crewai install")
            return False
    
    return len(issues) == 0


if __name__ == "__main__":
    # Load .env file
    try:
        from dotenv import load_dotenv
        load_dotenv()
    except ImportError:
        print("⚠️  python-dotenv not installed, trying without it...")
    
    success = check_environment()
    sys.exit(0 if success else 1)
