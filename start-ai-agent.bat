@echo off
echo Starting NUMU AI Agent Service...
cd ai-agent

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt

REM Check for .env file
if not exist ".env" (
    echo WARNING: .env file not found!
    echo Please copy .env.example to .env and configure your OPENAI_API_KEY
    pause
    exit /b 1
)

REM Start the service
echo Starting FastAPI service on port 8000...
python main.py
