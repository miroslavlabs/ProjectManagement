:: TODO download APOC lib from remove server.
@ECHO off

@SET configurationFilePath="%~dp0..\resources\config\remote\application.ini"
@CALL "%~dp0helper\read_ini.bat" readPropertyValue "neo4j.version" neo4jVersion %configurationFilePath%

@ECHO Execute integration tests against a Neo4j Docker container.
@ECHO Downlaoding Neo4j %neo4jVersion% docker image.
:: TODO create a configuration property for the Neo4j image version
docker pull neo4j:%neo4jVersion%

:: Read the container configuration data.
@CALL "%~dp0helper\read_ini.bat" readPropertyValue "neo4j.conn.borwser.port" neo4jBrowserPort %configurationFilePath%
@CALL "%~dp0helper\read_ini.bat" readPropertyValue "neo4j.conn.bolt.port" neo4jBoltPort %configurationFilePath%
@CALL "%~dp0helper\read_ini.bat" readPropertyValue "neo4j.container.deploy.wait.seconds" neo4jContainerDeployWaitTimeSeconds %configurationFilePath%
@CALL "%~dp0helper\read_ini.bat" readPropertyValue "neo4j.conn.username" neo4jUsername %configurationFilePath%
@CALL "%~dp0helper\read_ini.bat" readPropertyValue "neo4j.conn.password" neo4jPassword %configurationFilePath%

@SET baseDir=%~dp0..
@SET baseDirLinuxStyle=%baseDir:\=/%
@SET mappedContainerDir=//FDRIVE%baseDirLinuxStyle:~2%

:: Clear the neo4j-container folders for data and logs.
RMDIR %~dp0..\neo4j-container\data /Q /S
RMDIR %~dp0..\neo4j-container\logs /Q /S

:: The data folder is mapped locally to allow the possibility of putting large sets inside the DB.
FOR /F "tokens=* USEBACKQ" %%F IN (`docker run -d "--publish=%neo4jBrowserPort%:7474" "--publish=%neo4jBoltPort%:7687" "--volume=%mappedContainerDir%/neo4j-container/logs:/logs" "--volume=%mappedContainerDir%/neo4j-container/plugins:/plugins"
"--volume=%mappedContainerDir%/neo4j-container/data:/data" "--env=NEO4J_AUTH=%neo4jUsername%/%neo4jPassword%" "--env=NEO4J_dbms_security_procedures_unrestricted=algo.*,apoc.*" "--env=NEO4J_dbms_security_procedures_whitelist=algo.*,apoc.*" "--env=NEO4J_dbms_logs_query_enabled=true" "--env=NEO4J_dbms_logs_query_parameter__logging__enabled=true" neo4j:3.4`) DO (
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