# Ejercicio 1: CRUD básico

## 1. Crear una base de datos llamada "empresa"
1. En MongoDB Compass, hacer clic en "+" junto a "Databases"
2. Nombre de base de datos: `empresa`
3. Nombre de colección: `empleados`
4. Clic en "Create Database"

## 2. Agregar una colección "empleados" con 3 documentos
1. Seleccionar colección "empleados"
2. Clic en "Add Data" > "Insert Document"
3. Insertar los siguientes documentos:

```json
{
  "nombre": "Juan Pérez", 
  "edad": 30, 
  "puesto": "Desarrollador"
}
```

```json
{
  "nombre": "Ana López", 
  "edad": 25, 
  "puesto": "Diseñadora"
}
```

```json
{
  "nombre": "Carlos Gómez", 
  "edad": 22, 
  "puesto": "pasante"
}
```

## 3. Actualizar la edad de uno de los empleados
1. Seleccionar el documento de Juan Pérez
2. Clic en editar (icono de lápiz)
3. Cambiar edad de 30 a 31
4. Clic en "Update"

## 4. Eliminar al empleado que tenga el puesto de "pasante"
1. Usar filtro: `{puesto: "pasante"}`
2. Seleccionar el documento resultante
3. Clic en eliminar (icono de papelera)
4. Confirmar eliminación
