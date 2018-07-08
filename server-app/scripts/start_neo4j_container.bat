@ECHO off
@ECHO Execute integration tests against a Neo4j Docker container.
@ECHO Downlaoding Neo4j 3.4 docker image.
docker pull neo4j:3.4

@SET configurationFilePath="%~dp0config\remote\application.ini"

@CALL "%~dp0helper\read_ini.bat" readParamValue neo4jBrowserPort %configurationFilePath%
@CALL "%~dp0helper\read_ini.bat" readParamValue neo4jBoltPort %configurationFilePath%
@CALL "%~dp0helper\read_ini.bat" readParamValue neo4jContainerDeployWaitTimeSeconds %configurationFilePath%

FOR /F "tokens=* USEBACKQ" %%F IN (`docker run -d "--publish=%neo4jBrowserPort%:7474" "--publish=%neo4jBoltPort%:7687" "--env=NEO4J_AUTH=neo4j/Neo4j" neo4j:3.4`) DO (
   @SET neo4jContainerId=%%F
   @ECHO:
   @ECHO Started detached Neo4j container with ID: %%F.
   @ECHO Neo4j browser is on port %neo4jBrowserPort%.
   @ECHO Neo4j bolt is on port %neo4jBoltPort%.
)

:: Check if the container was started correctly.
IF NOT DEFINED neo4jContainerId (
   @ECHO:
   @ECHO The Neo4j container was not started correctly - missing container ID.
   @ECHO Exiting program...
   exit /b
)

@ECHO:
@ECHO Wait %neo4jContainerDeployWaitTimeSeconds% seconds for Neo4j database to initialize...
timeout /t %neo4jContainerDeployWaitTimeSeconds% > NUL