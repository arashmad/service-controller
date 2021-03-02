@echo off
rem -----------------------------------------------------------------------------
rem Startup Script for Translator
rem -----------------------------------------------------------------------------

cls
echo Welcome to Translator Service!
echo.
set error=0

goto run

:run
    cd C:/Python27/python271/api_wrm/microservices/query_translator/backend
    node --max-old-space-size=4096 server.js
goto end

:end
  if %error% == 1 echo Startup of Translator was unsuccessful. 
  echo.
  pause