@echo off
rem -----------------------------------------------------------------------------
rem Startup Script for Caddy
rem -----------------------------------------------------------------------------

cls
echo Welcome to Caddy!
echo.
set error=0

goto run

:run
    cd C:/caddy
    caddy start	Caddyfile
goto end

:end
  if %error% == 1 echo Startup of Caddy was unsuccessful. 
  echo.
  pause