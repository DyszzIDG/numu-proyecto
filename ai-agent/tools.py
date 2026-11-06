"""
Security Tools Configuration
Defines available security tools and their parameters
"""

from typing import Dict, List, Optional
from pydantic import BaseModel

class ToolParameter(BaseModel):
    name: str
    description: str
    required: bool = False
    default: Optional[str] = None

class SecurityTool(BaseModel):
    id: str
    name: str
    description: str
    category: str
    difficulty: str
    requires_docker: bool = True
    requires_api_key: bool = False
    base_command: str
    parameters: List[ToolParameter]

# Tool Definitions
SECURITY_TOOLS: Dict[str, SecurityTool] = {
    "nmap": SecurityTool(
        id="nmap",
        name="Nmap",
        description="Network scanner for port discovery and service detection",
        category="network",
        difficulty="beginner",
        requires_docker=True,
        requires_api_key=False,
        base_command="nmap",
        parameters=[
            ToolParameter(name="target", description="Target IP or domain", required=True),
            ToolParameter(name="ports", description="Port range (e.g., 80,443 or 1-1000)", required=False),
            ToolParameter(name="service_detection", description="Enable service version detection (-sV)", required=False),
            ToolParameter(name="os_detection", description="Enable OS detection (-O)", required=False),
            ToolParameter(name="scripts", description="Run default NSE scripts (-sC)", required=False),
            ToolParameter(name="timing", description="Timing template (T0-T5)", required=False, default="T4"),
        ]
    ),
    "nikto": SecurityTool(
        id="nikto",
        name="Nikto",
        description="Web server vulnerability scanner",
        category="web",
        difficulty="beginner",
        requires_docker=True,
        requires_api_key=False,
        base_command="nikto",
        parameters=[
            ToolParameter(name="target", description="Target URL", required=True),
            ToolParameter(name="maxtime", description="Maximum scan time", required=False, default="60s"),
        ]
    ),
    "nuclei": SecurityTool(
        id="nuclei",
        name="Nuclei",
        description="Fast vulnerability scanner based on templates",
        category="vuln",
        difficulty="intermediate",
        requires_docker=True,
        requires_api_key=False,
        base_command="nuclei",
        parameters=[
            ToolParameter(name="target", description="Target URL", required=True),
            ToolParameter(name="severity", description="Filter by severity (critical,high,medium,low)", required=False),
        ]
    ),
    "feroxbuster": SecurityTool(
        id="feroxbuster",
        name="Feroxbuster",
        description="Fast directory and file brute-forcer",
        category="web",
        difficulty="intermediate",
        requires_docker=True,
        requires_api_key=False,
        base_command="feroxbuster",
        parameters=[
            ToolParameter(name="target", description="Target URL", required=True),
            ToolParameter(name="wordlist", description="Wordlist path", required=False),
        ]
    ),
    "theharvester": SecurityTool(
        id="theharvester",
        name="TheHarvester",
        description="OSINT tool for gathering emails, subdomains, and more",
        category="osint",
        difficulty="beginner",
        requires_docker=True,
        requires_api_key=False,
        base_command="theharvester",
        parameters=[
            ToolParameter(name="target", description="Target domain", required=True),
            ToolParameter(name="sources", description="Data sources (all, google, bing, etc.)", required=False, default="all"),
        ]
    ),
    "testssl": SecurityTool(
        id="testssl",
        name="TestSSL",
        description="SSL/TLS security scanner",
        category="ssl",
        difficulty="beginner",
        requires_docker=True,
        requires_api_key=False,
        base_command="testssl.sh",
        parameters=[
            ToolParameter(name="target", description="Target hostname:port", required=True),
        ]
    ),
}

def get_tool(tool_id: str) -> Optional[SecurityTool]:
    """Get tool configuration by ID"""
    return SECURITY_TOOLS.get(tool_id)

def get_all_tools() -> List[SecurityTool]:
    """Get all available tools"""
    return list(SECURITY_TOOLS.values())

def build_command(tool_id: str, target: str, params: Dict[str, any]) -> str:
    """Build command string for a tool"""
    tool = get_tool(tool_id)
    if not tool:
        raise ValueError(f"Unknown tool: {tool_id}")
    
    if tool_id == "nmap":
        flags = []
        if params.get("service_detection"):
            flags.append("-sV")
        if params.get("os_detection"):
            flags.append("-O")
        if params.get("scripts"):
            flags.append("-sC")
        if params.get("timing"):
            flags.append(f"-{params['timing']}")
        if params.get("ports"):
            flags.append(f"-p {params['ports']}")
        else:
            flags.append("-F")  # Fast scan by default
        
        return f"{tool.base_command} {' '.join(flags)} {target}"
    
    elif tool_id == "nikto":
        maxtime = params.get("maxtime", "60s")
        return f"{tool.base_command} -h {target} -maxtime {maxtime}"
    
    elif tool_id == "nuclei":
        flags = ["-u", target, "-silent", "-nc"]
        if params.get("severity"):
            flags.extend(["-severity", params["severity"]])
        return f"{tool.base_command} {' '.join(flags)}"
    
    elif tool_id == "feroxbuster":
        return f"{tool.base_command} -u {target} -t 10 --silent --time-limit 30s"
    
    elif tool_id == "theharvester":
        sources = params.get("sources", "all")
        return f"{tool.base_command} -d {target} -b {sources} -l 100"
    
    elif tool_id == "testssl":
        return f"{tool.base_command} --fast {target}"
    
    return f"{tool.base_command} {target}"
