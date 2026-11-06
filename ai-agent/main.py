"""
FastAPI Service for AI Security Agent
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict
import os
from dotenv import load_dotenv

from agent import SecurityAIAgent
from tools import get_all_tools, get_tool

# Load environment variables
load_dotenv()

app = FastAPI(title="NUMU AI Security Agent", version="1.0.0")

# CORS configuration
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")
allowed_origins = [o.strip() for o in allowed_origins_env.split(",") if o.strip()]
if not allowed_origins:
    allowed_origins = [
        "http://localhost:3100",
        "http://localhost:3000",
        "https://numu-v2.vercel.app",
        "https://numu-proyecto.vercel.app"
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI agent
try:
    openai_key = os.getenv("OPENAI_API_KEY")
    if not openai_key:
        raise ValueError("OPENAI_API_KEY not found in environment")

    agent = SecurityAIAgent(api_key=openai_key)
except ValueError as e:
    print(f"Warning: AI Agent initialization failed: {e}")
    agent = None

# Request/Response Models
class AnalyzeRequest(BaseModel):
    prompt: str
    tool: str
    target: Optional[str] = None

class AnalyzeResultsRequest(BaseModel):
    tool: str
    target: str
    rawOutput: str

class HealthResponse(BaseModel):
    status: str
    ai_enabled: bool

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "ai_enabled": agent is not None
    }

@app.get("/tools")
async def list_tools():
    """List all available security tools"""
    tools = get_all_tools()
    return {
        "success": True,
        "tools": [tool.dict() for tool in tools]
    }

@app.get("/tools/{tool_id}")
async def get_tool_info(tool_id: str):
    """Get information about a specific tool"""
    tool = get_tool(tool_id)
    if not tool:
        raise HTTPException(status_code=404, detail="Tool not found")
    
    return {
        "success": True,
        "tool": tool.dict()
    }

@app.post("/analyze")
async def analyze_prompt(request: AnalyzeRequest):
    """
    Analyze user prompt and generate scan configuration
    """
    if not agent:
        raise HTTPException(
            status_code=503,
            detail="AI agent is not available. Please configure OPENAI_API_KEY."
        )
    
    try:
        result = agent.analyze_prompt(
            user_prompt=request.prompt,
            tool=request.tool,
            target=request.target
        )
        
        if not result.get("success"):
            raise HTTPException(status_code=400, detail=result.get("error", "Analysis failed"))
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-results")
async def analyze_results(request: AnalyzeResultsRequest):
    """
    Analyze scan results and provide insights
    """
    if not agent:
        # Return basic analysis without AI
        return {
            "success": True,
            "summary": f"Scan completed for {request.target} using {request.tool}",
            "severity": "info",
            "findings": ["AI analysis not available"],
            "recommendations": ["Configure OpenAI API key for detailed analysis"]
        }
    
    try:
        result = agent.analyze_results(
            tool=request.tool,
            target=request.target,
            raw_output=request.rawOutput
        )
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
