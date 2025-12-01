@echo off
echo ===========================================
echo   Instalando Backend Django (Proyecto 4)
echo ===========================================

REM Crear entorno virtual
echo Creando entorno virtual...
python -m venv env

REM Activar entorno virtual
echo Activando entorno virtual...
call env\Scripts\activate

REM Instalar dependencias
echo Instalando dependencias...
pip install -r requirements.txt

REM Aplicar migraciones
echo Aplicando migraciones...
python manage.py migrate

REM Ejecutar servidor
echo Levantando servidor Django...
python manage.py runserver

pause
