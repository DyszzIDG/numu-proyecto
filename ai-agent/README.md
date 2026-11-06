# NUMU AI Agent Service

Python-based AI agent service for intelligent security scanning.

## Setup

1. **Install Python 3.9+**

2. **Configure Environment**
   ```bash
   cd ai-agent
   copy .env.example .env
   ```
   
   Edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```

3. **Start the Service**
   
   **Windows:**
   ```bash
   ..\start-ai-agent.bat
   ```
   
   **Linux/Mac:**
   ```bash
   cd ai-agent
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   python main.py
   ```

4. **Update Next.js Environment**
   
   Add to `.env.local`:
   ```
   AI_AGENT_URL=http://localhost:8000
   ```

## API Endpoints

- `GET /health` - Health check
- `GET /tools` - List available tools
- `POST /analyze` - Analyze user prompt and generate scan config
- `POST /analyze-results` - Analyze scan results with AI

## How It Works

1. User enters natural language prompt (e.g., "Scan numu.group for open ports")
2. AI agent interprets the prompt using GPT-4
3. Generates appropriate tool configuration and command
4. Executes the scan via Docker
5. Analyzes results and provides insights

## Example Request

```json
POST /analyze
{
  "prompt": "Quick vulnerability scan of example.com",
  "tool": "nmap",
  "target": "example.com"
}
```

## Response

```json
{
  "success": true,
  "tool": "nmap",
  "target": "example.com",
  "command": "nmap -F -T4 -sV example.com",
  "parameters": {
    "service_detection": true,
    "timing": "T4"
  },
  "reasoning": "Enabled service detection for vulnerability assessment",
  "customParams": "-F -T4 -sV"
}
```
