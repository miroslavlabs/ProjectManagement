@ECHO off
@ECHO Starting server application.

@SET executionType=%~1
@SET configurationFilePath=
IF %executionType% == --local (
    @SET configurationFilePath="%~dp0config\local\application.ini"
)

IF %executionType% == --remote (
    @SET configurationFilePath="%~dp0config\remote\application.ini"
)

@ECHO Using configurations from file: %configurationFilePath%
@CALL "%~dp0helper\read_ini.bat" readParamValue neo4jConnectionProtocol %configurationFilePath%
@CALL "%~dp0helper\read_ini.bat" readParamValue neo4jUri %configurationFilePath%
@CALL "%~dp0helper\read_ini.bat" readParamValue neo4jBoltPort %configurationFilePath%
@CALL "%~dp0helper\read_ini.bat" readParamValue neo4jUsername %configurationFilePath%
@CALL "%~dp0helper\read_ini.bat" readParamValue neo4jPassword %configurationFilePath%

@ECHO Start server application.
node %~dp0\..\dist\server-app.js neo4jProtocol=%neo4jConnectionProtocol% neo4jUri=%neo4jUri% neo4jPort=%neo4jBoltPort% neo4jUsername=%neo4jUsername% neo4jPassword=%neo4jPassword%