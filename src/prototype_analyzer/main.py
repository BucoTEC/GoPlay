#!/usr/bin/env python
import sys
import os
import warnings
import json

# Add src directory to path to ensure module can be found
src_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if src_path not in sys.path:
    sys.path.insert(0, src_path)

from datetime import datetime
from prototype_analyzer.crew import PrototypeAnalyzer
from prototype_analyzer.models.prd_models import PRDOutput

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

def run():
    """
    Run the PRD extraction crew.
    Usage: run_crew <repo_url>
    Example: run_crew https://github.com/owner/repo
    """
    # Get repo URL from command line or use default
    if len(sys.argv) > 1:
        repo_url = sys.argv[1]
    else:
        repo_url = input("Enter GitHub repository URL (e.g., https://github.com/owner/repo): ")
    
    inputs = {
        'repo_url': repo_url
    }
    
    try:
        print(f"\n🔍 Analyzing repository: {repo_url}")
        print("=" * 80)
        
        result = PrototypeAnalyzer().crew().kickoff(inputs=inputs)
        
        # Aggregate results into PRD JSON
        print("\n📝 Generating PRD JSON output...")
        
        # Save output
        output_file = "prd_output.json"
        with open(output_file, "w") as f:
            # Convert result to JSON (assuming result has json representation)
            f.write(str(result))
        
        print(f"\n✅ PRD extraction complete! Output saved to: {output_file}")
        
        return result
        
    except Exception as e:
        raise Exception(f"An error occurred while running the crew: {e}")


def train():
    """
    Train the crew for a given number of iterations.
    """
    inputs = {
        "topic": "AI LLMs",
        'current_year': str(datetime.now().year)
    }
    try:
        Proto().crew().train(n_iterations=int(sys.argv[1]), filename=sys.argv[2], inputs=inputs)

    except Exception as e:
        raise Exception(f"An error occurred while training the crew: {e}")

def replay():
    """
    Replay the crew execution from a specific task.
    """
    try:
        Proto().crew().replay(task_id=sys.argv[1])

    except Exception as e:
        raise Exception(f"An error occurred while replaying the crew: {e}")

def test():
    """
    Test the crew execution and returns the results.
    """
    inputs = {
        "topic": "AI LLMs",
        "current_year": str(datetime.now().year)
    }
    
    try:
        Proto().crew().test(n_iterations=int(sys.argv[1]), eval_llm=sys.argv[2], inputs=inputs)

    except Exception as e:
        raise Exception(f"An error occurred while testing the crew: {e}")


if __name__ == "__main__":
    run()
