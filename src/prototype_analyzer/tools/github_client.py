"""GitHub MCP Server integration via subprocess"""
import subprocess
import json
import os
from typing import Dict, Any, Optional


class GitHubMCPClient:
    """Client for interacting with GitHub MCP Server"""
    
    def __init__(self, github_token: Optional[str] = None):
        """
        Initialize GitHub MCP client
        
        Args:
            github_token: GitHub Personal Access Token (falls back to env var)
        """
        self.github_token = github_token or os.getenv("GITHUB_PERSONAL_ACCESS_TOKEN")
        if not self.github_token:
            raise ValueError(
                "GitHub Personal Access Token required. "
                "Set GITHUB_PERSONAL_ACCESS_TOKEN environment variable or pass token to constructor."
            )
    
    def search_repository(
        self, 
        owner: str, 
        repo: str, 
        query: str,
        path: Optional[str] = None
    ) -> str:
        """
        Search within a GitHub repository
        
        Args:
            owner: Repository owner
            repo: Repository name
            query: Search query
            path: Optional path to limit search scope
            
        Returns:
            Search results as string
        """
        try:
            # Using GitHub REST API as interim solution
            # In production, this would use proper MCP protocol
            import requests
            
            headers = {
                "Authorization": f"token {self.github_token}",
                "Accept": "application/vnd.github.v3+json"
            }
            
            # Search code
            search_url = f"https://api.github.com/search/code?q={query}+repo:{owner}/{repo}"
            if path:
                search_url += f"+path:{path}"
            
            response = requests.get(search_url, headers=headers)
            
            if response.status_code == 404:
                return "not found"
            elif response.status_code == 200:
                data = response.json()
                if data.get("total_count", 0) == 0:
                    return "not found"
                return json.dumps(data, indent=2)
            else:
                return f"Error: HTTP {response.status_code}"
                
        except Exception as e:
            return f"Error searching repository: {str(e)}"
    
    def get_file_contents(
        self, 
        owner: str, 
        repo: str, 
        path: str,
        ref: str = "main"
    ) -> str:
        """
        Get contents of a specific file
        
        Args:
            owner: Repository owner
            repo: Repository name
            path: File path in repository
            ref: Branch/tag/commit (default: main)
            
        Returns:
            File contents as string or "not found"
        """
        try:
            import requests
            import base64
            
            headers = {
                "Authorization": f"token {self.github_token}",
                "Accept": "application/vnd.github.v3+json"
            }
            
            url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}?ref={ref}"
            response = requests.get(url, headers=headers)
            
            if response.status_code == 404:
                return "not found"
            elif response.status_code == 200:
                data = response.json()
                if isinstance(data, dict) and "content" in data:
                    content = base64.b64decode(data["content"]).decode("utf-8")
                    return content
                return "not found"
            else:
                return "not found"
                
        except Exception as e:
            return "not found"
    
    def list_directory(
        self,
        owner: str,
        repo: str,
        path: str = "",
        ref: str = "main"
    ) -> str:
        """
        List contents of a directory
        
        Args:
            owner: Repository owner
            repo: Repository name
            path: Directory path (empty for root)
            ref: Branch/tag/commit (default: main)
            
        Returns:
            Directory listing or "not found"
        """
        try:
            import requests
            
            headers = {
                "Authorization": f"token {self.github_token}",
                "Accept": "application/vnd.github.v3+json"
            }
            
            url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}?ref={ref}"
            response = requests.get(url, headers=headers)
            
            if response.status_code == 404:
                return "not found"
            elif response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    items = [item["name"] for item in data]
                    return "\n".join(items)
                return "not found"
            else:
                return "not found"
                
        except Exception as e:
            return "not found"
