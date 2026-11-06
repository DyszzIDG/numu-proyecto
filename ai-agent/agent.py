"""
AI Agent for Security Scanning
Uses OpenAI to interpret natural language and generate scan configurations
"""

import os
import json
from typing import Dict, Optional
from openai import OpenAI
from tools import SECURITY_TOOLS, get_tool, build_command

class SecurityAIAgent:
    def __init__(self, api_key: str):
        self.client = OpenAI(api_key=api_key)
        self.model = "gpt-4o"  # Using latest GPT-4o model
    
    def analyze_prompt(self, user_prompt: str, tool: str, target: Optional[str] = None) -> Dict:
        """
        Analyze user prompt and generate scan configuration
        """
        tool_config = get_tool(tool)
        if not tool_config:
            return {
                "error": f"Unknown tool: {tool}",
                "success": False
            }
        
        # Build system prompt
        system_prompt = f"""You are a cybersecurity expert assistant. Your job is to interpret user requests for security scans and generate appropriate tool configurations.

Tool: {tool_config.name}
Description: {tool_config.description}
Category: {tool_config.category}

Available parameters:
{json.dumps([p.dict() for p in tool_config.parameters], indent=2)}

Your task:
1. Extract the target from the user prompt (if not provided separately)
2. Determine which parameters should be enabled based on the user's intent
3. Return a JSON object with the configuration

Response format:
{{
    "target": "extracted or provided target",
    "parameters": {{
        "param_name": value,
        ...
    }},
    "reasoning": "brief explanation of your choices"
}}

Examples:
- "Scan numu.group for open ports and services" -> enable service_detection
- "Quick scan of 192.168.1.1" -> use default fast scan
- "Deep scan with OS detection" -> enable os_detection, service_detection, scripts
"""

        user_message = f"User request: {user_prompt}"
        if target:
            user_message += f"\nTarget: {target}"
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                temperature=0.3,
                response_format={"type": "json_object"}
            )
            
            result = json.loads(response.choices[0].message.content)
            
            # Build the command
            final_target = result.get("target", target)
            params = result.get("parameters", {})
            
            command = build_command(tool, final_target, params)
            
            return {
                "success": True,
                "tool": tool,
                "target": final_target,
                "parameters": params,
                "command": command,
                "reasoning": result.get("reasoning", ""),
                "customParams": self._params_to_flags(tool, params)
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def _params_to_flags(self, tool: str, params: Dict) -> str:
        """Convert parameters dict to command-line flags"""
        if tool == "nmap":
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
            return " ".join(flags)
        
        return ""
    
    def analyze_results(self, tool: str, target: str, raw_output: str) -> Dict:
        """
        Analyze scan results and provide insights
        """
        system_prompt = f"""You are a cybersecurity analyst. Analyze the following security scan results and provide:
1. A brief summary of findings
2. Severity assessment (critical, high, medium, low, info)
3. Key vulnerabilities or issues found
4. Recommended actions

Be concise but thorough. Focus on actionable insights."""

        user_message = f"""Tool: {tool}
Target: {target}

Scan Output:
{raw_output[:4000]}  # Limit to avoid token limits

Provide your analysis in JSON format:
{{
    "summary": "brief overview",
    "severity": "critical|high|medium|low|info",
    "findings": ["finding 1", "finding 2", ...],
    "recommendations": ["action 1", "action 2", ...]
}}"""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                temperature=0.3,
                response_format={"type": "json_object"}
            )
            
            analysis = json.loads(response.choices[0].message.content)
            return {
                "success": True,
                **analysis
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "summary": "Failed to analyze results",
                "severity": "info",
                "findings": [],
                "recommendations": []
            }
