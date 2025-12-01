@echo off
title PROYECTO 4 - Instalación Completa (DB + Backend + Frontend)

echo ================================================
echo      INICIANDO INSTALACION PROYECTO 4
echo ================================================
echo.

REM -------------------------------------------------
REM RUTA BASE
REM -------------------------------------------------
SET "BASE_DIR=%~dp0"
echo Proyecto ubicado en: %BASE_DIR%
echo.

REM =================================================
REM ========== 1. IMPORTAR BASE DE DATOS ============
REM =================================================

echo --------- IMPORTANDO BASE DE DATOS -------------
SET "SQL_FILE=%BASE_DIR%database\AplicandoUnido.sql"

IF NOT EXIST "%SQL_FILE%" (
    echo ERROR: No se encontró el archivo SQL:
    echo %SQL_FILE%
    pause
    exit /b
)

REM Pedir contraseña del usuario
echo Ingrese la contraseña del usuario postgres:
set /p POSTGRES_PWD=Contraseña Postgres: 

set PGPASSWORD=%POSTGRES_PWD%

echo Buscando psql.exe...
SET "PSQL_PATH="

REM Buscar en PATH
where psql >nul 2>&1
IF %ERRORLEVEL% EQU 0 (
    FOR /F "tokens=*" %%i IN ('where psql') DO SET "PSQL_PATH=%%i"
)

REM Buscar en rutas comunes
IF NOT DEFINED PSQL_PATH (
    FOR /D %%d IN ("C:\Program Files\PostgreSQL\*") DO (
        IF EXIST "%%d\bin\psql.exe" SET "PSQL_PATH=%%d\bin\psql.exe"
    )
)

IF NOT DEFINED PSQL_PATH (
    echo ERROR: No se encontró psql.exe
    pause
    exit /b
)

echo PostgreSQL encontrado en: %PSQL_PATH%
echo Importando base de datos...

echo Ejecutando: "%PSQL_PATH%" -U postgres -v CLIENT_ENCODING=WIN1252 -f "%SQL_FILE%"
"%PSQL_PATH%" -U postgres -f "%SQL_FILE%"
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR IMPORTANDO BD.
    pause
    exit /b
)


echo Base de datos importada correctamente.
echo.

REM =================================================
REM ========== 2. INSTALAR BACKEND ==================
REM =================================================

echo --------- INSTALANDO BACKEND -------------------
cd "%BASE_DIR%backend"

IF NOT EXIST "env" (
    echo Creando entorno virtual...
    python -m venv env
)

echo Activando entorno virtual...
call env\Scripts\activate

echo Instalando dependencias...
pip install -r requirements.txt

echo Aplicando migraciones Django...
python manage.py migrate

echo Backend configurado.
echo.

REM =================================================
REM ========== 3. INSTALAR FRONTEND =================
REM =================================================

echo --------- INSTALANDO FRONTEND ------------------
cd "%BASE_DIR%frontend"

node -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js no está instalado.
    pause
    exit /b
)

IF EXIST "package.json" (
    echo Instalando dependencias frontend...
    npm install
)

IF EXIST "tailwind.config.js" (
    echo Compilando TailwindCSS...
    npx tailwindcss -i ./src/input.css -o ./src/output.css --minify
)

echo Abriendo interfaz...
start "" "%BASE_DIR%frontend\index1.html"

echo Frontend listo.
echo.

REM =================================================
REM ========== 4. LEVANTAR SERVIDOR BACKEND =========
REM =================================================

echo Levantando servidor Django...
cd "%BASE_DIR%backend"
call env\Scripts\activate

start cmd /c "python manage.py runserver"

echo Backend levantado en: http://127.0.0.1:8000/
echo.

pause
