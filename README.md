

# 📘 **Sistema de Gestión de Recursos Humanos (RRHH)**

### **Django Backend + Frontend Moderno | Instalación Automática**

Bienvenido al repositorio oficial del **Sistema de Gestión de Recursos Humanos**, desarrollado como un entorno completo para gestionar:

*  Requerimientos de personal
* Postulaciones
*  Evaluaciones
* Contrataciones
*  Administración de datos relacionados
* Dashboard y módulos asociados

El proyecto está dividido en dos partes:

* **Backend (Django + PostgreSQL)**
* **Frontend (HTML / CSS / JS / Vite)**

Incluye scripts de instalación automática para que cualquier persona pueda ejecutar el sistema *sin conocimientos técnicos*.

---

# 🚀 **Características Principales**

### 🖥 **Backend – Django**

* API REST construida sin ORM (queries SQL puras).
* Arquitectura organizada por módulos.
* Autoconexión a PostgreSQL.
* Scripts automáticos de instalación y despliegue.
* Endpoints limpios y estructurados para consumir desde el frontend.

### 🎨 **Frontend**

* Interfaz moderna y modular.
* HTML, CSS y JavaScript.
* Uso de Vite para desarrollo rápido.
* Compatible con cualquier navegador moderno.
* Estilos limpios y optimizados.

### ⚙️ **Scripts Automáticos**

Incluye:

```
backend/setup_backend.bat
frontend/setup_frontend.bat
```

Los cuales realizan:

* Creación de entorno virtual
* Instalación de dependencias
* Migraciones
* Inicio automático del servidor
* Instalación de librerías del frontend
* Ejecución de Vite

Sin necesidad de usar consola.

---

# 📂 **Estructura del Proyecto**

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
│   ├── src/                # Código del frontend
│   ├── index.html
│   ├── package.json
│   └── setup_frontend.bat
│
└── README.md
```

---

# 🧩 **Instalación — Modo Fácil (100% Automática)**

Este proyecto puede levantarse con **2 dobles clics**, sin saber programación.

---

## 1️⃣ **Levantar Backend (Django)**

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

### ✔ El backend quedará ejecutándose en:

👉 **[http://127.0.0.1:8000/](http://127.0.0.1:8000/)**

---

## 2️⃣ **Levantar Frontend**

1. Entrar a:

```
Proyecto-4/frontend
```

2. Ejecutar:

```
setup_frontend.bat
```

Este script:

* Instala Node (si no existe)
* Instala dependencias del proyecto
* Levanta automáticamente Vite

### ✔ El frontend quedará ejecutándose en:

👉 **[http://127.0.0.1:5173/](http://127.0.0.1:5173/)**

---

# 🗃 **Configuración de Base de Datos**

El proyecto usa **PostgreSQL**.

Configuración recomendada:

| Parámetro | Valor     |
| --------- | --------- |
| Usuario   | postgres  |
| Password  | 123  |
| BD        | AplicandoUnido |
| Host      | localhost |
| Puerto    | 5432      |

Si deseas cambiar las credenciales:
Editar:

```
backend/backend/settings.py
```

---

# 🛠 **Modo Manual (Opcional)**

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


# 📄 **Licencia**

Este proyecto es de libre uso académico.
Queda prohibida su comercialización sin autorización.

---



