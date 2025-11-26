# CycleMetal - Manual de Implementación 

**ATENCIÓN:** Todos los integrantes del equipo de CycleMetal deben leer este documento completo antes de realizar cualquier modificación al código.

---

## Requisitos Previos Obligatorios

###  Software Mínimo
| Componente       | Versión  | Verificación en terminal           |
|------------------|----------|------------------------------------|
| Node.js          | v22.14.0.x+   | `node --version`                   |
| Python           | 3.10.10.x+  | `python --version`                 |
| npm              | 10.9.2.x+     | `npm --version`                    |
| Git              | 2.46.0.windows.1.x+  | `git --version`                    |
> se recomienda usar la version de python 3.10 ya que esta fue con la que se desarrollo este software
---

##  Instalación Paso a Paso

### 1. Clonación Segura
```bash
git clone https://github.com/amjavip/CycleMetal.git
cd CycleMetal
```
### 2. Crear y activar entorno virtual
```bash
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
.venv\Scripts\activate     # Windows
```
### 3. Instalar dependencias CRÍTICAS 
Backend
```bash
pip install --upgrade pip
pip install -r requirements.txt 
```
### 4.- Instalar dependencias CRÍTICAS
Frontend
```bash
cd client
npm install
```
---
##  Protocolos de Seguridad
### Archivos PROHIBIDOS para commit
```bash
.venv/
# Node modules
node_modules/
client/node_modules/

# Output build
dist/
build/

# Vite cache
.vite/

# System files
.DS_Store
Thumbs.db

# Log files
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Env files
.env
.env.local
.env.*.local

# Editor settings
.vscode/
.idea/
*.sublime-project
*.sublime-workspace

# Optional: Mac users
*.DS_Store

# Optional: Windows users
*.log
*.tgz

# TypeScript cache
*.tsbuildinfo
```
> Para cualquier duda de archivo ejecutar el siguiente comando de verificacion: git check-ignore -v archivo_sospechoso
---
## Formato para hacer un commit
```bash
feat:     Nueva funcionalidad
fix:      Corrección de bug
docs:     Cambios documentación
style:    Formato (sin afectar código)
refactor: Reestructuración
test:     Pruebas
chore:    Mantenimiento
````
> Cada integrante tendra su propia rama
---
## Configuracion de puertos y redes
| Servicio      | Puerto  | Comando    |
|------------------|----------|------------------------------------|
| Frontend          | 5173  | `npm run dev`                   |
| Backend      | 8000  | `python manage.py runserver`                 |

Despliegue local en red LAN

Para permitir que otros dispositivos dentro de la misma red local accedan al proyecto, es necesario ejecutar tanto el backend como el frontend escuchando en la dirección de red correcta.

Backend (Django):
Ejecutar el servidor con:
```bash
python manage.py runserver 0.0.0.0:8000
```

La dirección 0.0.0.0 indica que Django debe aceptar conexiones desde cualquier interfaz de red de la máquina.
Los demás dispositivos deberán acceder mediante la dirección IPv4 local de la computadora

Frontend (Vite):
Ejecutar el entorno de desarrollo con:
```bash
npm run dev -- --host
```
El parámetro --host hace que el servidor de desarrollo exponga la aplicación mediante la dirección IPv4 local de la computadora, lo que permite que otros dispositivos dentro de la misma red puedan acceder

Para que las solicitudes del frontend al backend funcionen correctamente, las URLs usadas en fetch o Axios deben apuntar a la dirección IP real, no a localhost, por lo en desarrollo se podra cambiar la IP del URL en el .env.
> Para la consulta de datos sensibles como .env y contraseñas consultar por mensaje en el grupo privado de trabajo, donde igual se les informara de su respectiva implementacion en el proyecto.

