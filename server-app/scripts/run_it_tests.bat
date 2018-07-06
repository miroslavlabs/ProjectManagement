@echo off
ECHO Execute integration tests against a Neo4j Docker container.
ECHO Downlaoding Neo4j 3.4 docker image.
docker pull neo4j:3.4

SET neo4jBorswerPort=11074
SET neo4jBoltPort=11087
FOR /F "tokens=* USEBACKQ" %%F IN (`docker run -d "--publish=%neo4jBorswerPort%:7474" "--publish=%neo4jBoltPort%:7687" "--env=NEO4J_AUTH=neo4j/Neo4j" neo4j:3.4`) DO (
   SET neo4jContainerId=%%F
   ECHO:
   ECHO Started detached Neo4j container with ID: %neo4jContainerId%.
   ECHO Neo4j browser is on port %neo4jBorswerPort%.
   ECHO Neo4j bolt is on port %neo4jBoltPort%.
)

:: Check if the container was started correctly.
IF NOT DEFINED neo4jContainerId (
   ECHO:
   ECHO The Neo4j container was not started correctly - missing container ID.
   ECHO Exiting program...
   exit /b
)

SET neo4jContainerDeployWaitTimeSeconds=60
ECHO:
ECHO Wait %neo4jContainerDeployWaitTimeSeconds% seconds for Neo4j database to initialize...
timeout /t %neo4jContainerDeployWaitTimeSeconds% > NUL

ECHO:
ECHO Starting server application...
:: The command is defined in package.json
::> server-tests.log
::START /b npm start 

ECHO:
ECHO Executing integration tests against Neo4j docker container.
..\node_modules\.bin\jasmine

ECHO:
ECHO Tests have been executed. Look at the test results for more information.
ECHO Stopping Neo4j container...

docker container stop %neo4jContainerId%

ECHO Neo4j container is stopped.
ECHO Exiting script.
EXIT /b