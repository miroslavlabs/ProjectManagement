@echo off
@REM The function below reads a parameter value from an INI file.

:readParamValue
FOR /f "tokens=2 delims==" %%a IN ('find "%~2=" %~3') DO (
    @set %~2=%%a
)
@GOTO:eof