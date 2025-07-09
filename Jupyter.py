# Segura Lozano Javier Amado 4IV7
import json
import os

# Nombre dentro del código
print("Javier Amado Segura Lozano - 4IV7 - Boleta: 2024090798")

# Obtener ruta del archivo JSON
carpeta_actual = os.getcwd()
ruta = os.path.join(carpeta_actual, "datos.json")

# Leer JSON si existe
try:
    with open(ruta, "r", encoding="utf-8") as f:
        datos = json.load(f)
except FileNotFoundError:
    datos = []

# Nuevo registro con tu información
nuevo_alumno = {
    "nombre": "Javier Amado",
    "apellidos": "Segura Lozano",
    "edad": 17,
    "gustos": ["Basketball", "Tocar la guitarra"],
    "escuela": {"boleta": 2024090798, "nivel": "Cuarto semestre", "grupo": "4IV7"},
}

# Agregar al JSON
datos.append(nuevo_alumno)

# Guardar cambios en el archivo JSON
with open(ruta, "w", encoding="utf-8") as f:
    json.dump(datos, f, ensure_ascii=False, indent=4)

print("Alumno agregado correctamente.")

# Segura Lozano Javier Amado 4IV7
