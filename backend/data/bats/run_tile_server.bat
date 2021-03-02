@echo off
rem -----------------------------------------------------------------------------
rem Startup Script for TileServer
rem -----------------------------------------------------------------------------

cls
echo Welcome to TileServer!
echo.
set error=0

goto run

:run
    cd C:/Python27/python271/api_wrm/microservices/tile_service
    node --max-old-space-size=4096  node_server.js
goto end

:end
  if %error% == 1 echo Startup of TileServer was unsuccessful. 
  echo.
  pause