@echo off
@REM The function below reads a parameter value from an INI file. It takes the following arguments:
@REM The name of the property.
@REM The name of the variable to be created which will hold the value of the property.
@REM The path to the INI file.

:readPropertyValue
FOR /f "tokens=2 delims==" %%a IN ('find "%~2=" %~4') DO (
    @set %~3=%%a
)
@GOTO:eof