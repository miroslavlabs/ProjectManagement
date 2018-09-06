@echo off
ECHO Executing integration tests against server application.
@SET executionType=%~1
@SET configurationFilePath=
IF %executionType% == --local (
    @SET configurationFilePath="%~dp0..\resources\config\local\application.ini"
)

IF %executionType% == --remote (
    @SET configurationFilePath="%~dp0..\resources\config\remote\application.ini"
)

%~dp0..\node_modules\.bin\jasmine JASMINE_CONFIG_PATH=%~dp0..\spec\support\jasmine.json configPath=%configurationFilePath%