# Ejercicio 8: Uso de $lookup

## Agregación con $lookup
1. En la colección "alumnos", clic en "Aggregations"
2. Clic en "+ Add Stage"
3. Seleccionar "$lookup" de la lista
4. Configurar el stage:

```json
{
  "from": "cursos",
  "localField": "id_curso",
  "foreignField": "_id",
  "as": "cursos_inscritos"
}
```

5. Clic en "Add Stage"


## Explicación de parámetros
- `from`: La colección desde la cual buscar documentos (cursos)
- `localField`: El campo en la colección alumnos que contiene la referencia (id_curso)
- `foreignField`: El campo en la colección cursos que coincide con localField (_id)
- `as`: El nombre del nuevo campo que contendrá los resultados de la búsqueda

## Uso adicional
Para ver solo ciertos campos de los resultados combinados, se puede agregar un stage `$project` después del `$lookup`:

```json
{
  "nombre": 1,
  "cursos_inscritos.nombre": 1,
  "cursos_inscritos.duracion": 1,
  "_id": 0
}
```

Esto mostraría solo el nombre del alumno y los nombres y duraciones de sus cursos.

## Ventajas del $lookup
- Permite combinar datos de múltiples colecciones en una sola consulta
- Similar a los JOIN en bases de datos relacionales
- Facilita la recuperación de datos relacionados sin múltiples consultas
- Mantiene la flexibilidad del modelo de datos no relacional de MongoDB
