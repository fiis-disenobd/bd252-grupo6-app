

# **Sistema de Gestión de Recursos Humanos (RRHH)**

### **Django Backend y Frontend**

**Sistema de Gestión de VISIONA**, hemos desarrollado una aplciacion con un entorno completo para gestionar:

* Gestion de Contratacion de Personal 
* Gestion de Proyecto
* Gestion de Servicios
* CRM

El proyecto está dividido en dos partes:

* **Backend : Este se realizo en Django y Postgre SQL**
* **Frontend HTML , CSS , JS y Vite**

Incluye archivos bat para  instalación automática para que cualquier persona pueda ejecutar el sistema .

---

#  **Características Principales**

###  **Backend – Django**

* API REST construida sin ORM es decir SQL puro.
* La arquitectura esa organizada por módulos.
* Conexión a PostgreSQL.
* Scripts automáticos de instalación y despliegue.
* Endpoints limpios y estructurados para consumir desde el frontend.

###  **Frontend**

* Interfaz moderna y modular.
* HTML, CSS y JavaScript.
* Uso de Vite para desarrollo rápido.
* Compatible con cualquier navegador moderno.
* Estilos limpios y optimizados.

###  **Scripts Automáticos**

Incluye:

```
setup_proyecto.bat
```

Realiza:

* Creación de entorno virtual
* Instalación de dependencias
* Migraciones
* Inicio automático del servidor
* Instalación de librerías del frontend
* Ejecución de Vite

Sin necesidad de usar consola.

---

#  **Estructura del Proyecto**

```
Proyecto-4/
│
├── backend/
│   ├── api/                # Aplicación principal
│   ├── backend/            # Configuración Django
│   ├── manage.py
│   ├── requirements.txt
│   └── setup_backend.bat
│
├── frontend/
│          
│   ├── index.html
│   ├── package.json
│   └── setup_frontend.bat
│
└── README.md
└──setup_proyecto.bat
```

---

#  **Instalación**

El proyecto se levante solo ,solo haciendo click en setup_proyecto
ante de eso implementar el archivo sql que se encuentra en database 
para que tenga toda la informacion necesaria.

---

## **Levantar Aplicativo**

1. Descargar el proyecto (`Code → Download ZIP`)
2. Descomprimir
3. Entrar a:

```
Proyecto-4/backend
```

4. Ejecutar con doble clic:

```
setup_backend.bat
```

Este script:

* Crea un entorno virtual
* Instala dependencias
* Aplica migraciones
* Levanta el servidor

###  El backend quedará ejecutándose en:

 **[http://127.0.0.1:8000/](http://127.0.0.1:8000/)**

---

##  **Levantar Frontend**

1. Entrar a:

```
Proyecto-4/frontend
```

2. Ejecutar:

```
setup_frontend.bat
```

Este script:

* Instala Node 
* Instala dependencias del proyecto
* Levanta automáticamente Vite

###  El frontend quedará ejecutándose en:

 **[http://127.0.0.1:5173/](http://127.0.0.1:5173/)**

---

#  **Configuración de Base de Datos**

El proyecto usa **PostgreSQL**.

Configuración recomendada:

| Parámetro | Valor     |
| --------- | --------- |
| Usuario   | postgres  |
| Password  | 123  |  *Poner contraseña adecuada*
| BD        | AplicandoUnido |
| Host      | localhost |
| Puerto    | 5432      |

Si deseas cambiar las credenciales:
Editar:

```
backend/backend/settings.py
```

---

#  **En modo manual**

### Backend

```bash
cd backend
python -m venv env
env\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---


#  **Licencia**

Este proyecto es de libre uso académico.
Queda prohibida su comercialización sin autorización.

---



