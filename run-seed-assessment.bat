@echo off
echo Ejecutando seed de preguntas de evaluacion...
node -r ts-node/register prisma/seed-assessment.ts
echo.
echo Seed completado!
pause
