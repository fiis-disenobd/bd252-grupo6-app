@echo off
echo ===========================================
echo      Instalando y Ejecutando Frontend
echo ===========================================

REM -------------------------------------------
REM 1. Verificar Node.js
REM -------------------------------------------
echo Verificando instalacion de Node.js...
node -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js no esta instalado.
    echo Descargalo desde: https://nodejs.org/
    pause
    exit /b
)

REM -------------------------------------------
REM 2. Instalar dependencias (si existen)
REM -------------------------------------------
IF EXIST "package.json" (
    echo Instalando dependencias del proyecto...
    npm install
) ELSE (
    echo No existe package.json — se omitira instalacion de dependencias.
)

REM -------------------------------------------
REM 3. Compilar Tailwind si corresponde
REM -------------------------------------------
IF EXIST "tailwind.config.js" (
    echo Compilando estilos Tailwind...
    npx tailwindcss -i ./src/input.css -o ./src/output.css --minify
)

REM -------------------------------------------
REM 4. Abrir automáticamente el index1.html
REM -------------------------------------------
echo Abriendo interfaz del sistema...

REM Cambia esta ruta si tu index esta en otra carpeta
set FRONT_PATH=%CD%\index1.html

IF EXIST "%FRONT_PATH%" (
    start "" "%FRONT_PATH%"
) ELSE (
    echo ERROR: No se encontro "%FRONT_PATH%"
    echo Verifica que index1.html exista.
    pause
    exit /b
)

echo ===========================================
echo     Frontend iniciado correctamente
echo ===========================================
echo La pagina se abrio en tu navegador.
pause

