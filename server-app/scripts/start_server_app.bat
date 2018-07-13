@ECHO off
@ECHO Starting server application.

@SET executionType=%~1
@SET configurationFilePath=
IF %executionType% == --local (
    @SET configurationFilePath="%~dp0..\resources\config\local\application.ini"
)

IF %executionType% == --remote (
    @SET configurationFilePath="%~dp0..\resources\config\remote\application.ini"
)

@ECHO Start server application.
node %~dp0\..\dist\server-app.js configPath=%configurationFilePath%