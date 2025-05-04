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

