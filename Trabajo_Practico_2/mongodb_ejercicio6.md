# Ejercicio 6: Índices

## 1. Crear colección "clientes"
1. En MongoDB Compass, dentro de la base de datos "empresa"
2. Clic en "Create Collection"
3. Nombre: `clientes`
4. Clic en "Create"

## 2. Insertar documentos de clientes
Insertar los siguientes documentos:

```json
{
  "nombre": "Pedro", 
  "apellido": "García", 
  "email": "pedro@example.com"
}
```

```json
{
  "nombre": "Laura", 
  "apellido": "Martínez", 
  "email": "laura@example.com"
}
```

```json
{
  "nombre": "Miguel", 
  "apellido": "Sánchez", 
  "email": "miguel@example.com"
}
```

## 3. Crear un índice compuesto
1. En la colección "clientes", seleccionar la pestaña "Indexes"
2. Clic en "Create Index"
3. En la definición del índice, especificar:

```json
{
  "apellido": 1,
  "nombre": 1
}
```

4. Clic en "Create"

## Verificación
1. En la pestaña "Indexes", verificar que aparece el nuevo índice compuesto
2. El índice debería mostrar los campos "apellido" y "nombre" en orden ascendente (1)

## Beneficios del índice compuesto
- Mejora el rendimiento de consultas que filtran por apellido, o por apellido y nombre
- Optimiza consultas de ordenación que utilizan estos campos
- Permite búsquedas eficientes de clientes por sus datos personales
- El orden de los campos en el índice es importante: primero se indexa por apellido y luego por nombre
