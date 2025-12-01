@echo off
echo =============================================
echo     INICIANDO BACKEND - PROYECTO 4
echo =============================================

REM ==============================================
REM OBTENER LA RUTA REAL DEL SCRIPT
REM ==============================================
SET SCRIPT_DIR=%~dp0
echo Script ejecutado desde: %SCRIPT_DIR%

REM Ruta correcta del archivo SQL (en la MISMA carpeta del script)
SET SQL_FILE="%SCRIPT_DIR%AplicandoUnido.sql"

IF NOT EXIST %SQL_FILE% (
    echo ERROR: No se encontro el archivo SQL en:
    echo %SQL_FILE%
    pause
    exit /b
)

REM =============================
REM 1. BUSCAR PSQL AUTOMÁTICAMENTE
REM =============================

SET PSQL_PATH=""

where psql >nul 2>&1
IF %ERRORLEVEL% EQU 0 (
    FOR /F "tokens=*" %%i IN ('where psql') DO SET PSQL_PATH="%%i"
)

IF %PSQL_PATH%=="" (
    echo Buscando PostgreSQL en rutas comunes...
    
    FOR /D %%d IN ("C:\Program Files\PostgreSQL\*") DO (
        IF EXIST "%%d\bin\psql.exe" (
            SET PSQL_PATH="%%d\bin\psql.exe"
        )
    )
)

IF %PSQL_PATH%=="" (
    echo ERROR: No se encontro psql.exe
    echo Instala PostgreSQL desde:
    echo https://www.postgresql.org/download/
    pause
    exit /b
)

echo PostgreSQL encontrado en: %PSQL_PATH%
echo.

REM ==========================================
REM 2. IMPORTAR BASE DE DATOS
REM ==========================================

echo Importando base de datos...
%PSQL_PATH% -U postgres -f %SQL_FILE%
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR IMPORTANDO LA BASE DE DATOS.
    pause
    exit /b
)

echo Base de datos importada correctamente.
echo.

REM ==============================
REM 3. ACTIVAR ENTORNO
REM ==============================
echo Activando entorno virtual...
call "%SCRIPT_DIR%..\env\Scripts\activate"

REM ==============================
REM 4. INSTALAR DEPENDENCIAS
REM ==============================
echo Instalando dependencias...
pip install -r "%SCRIPT_DIR%..\backend\requirements.txt"

REM ==============================
REM 5. LEVANTAR BACKEND
REM ==============================
echo Iniciando servidor Django...
cd "%SCRIPT_DIR%..\backend"
python manage.py runserver

pause
