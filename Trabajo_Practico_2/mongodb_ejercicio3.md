# Ejercicio 3: Uso de proyección

Recuperar los nombres y puestos de todos los empleados, sin mostrar el `_id`:

1. En la colección "empleados", hacer clic en "OPTIONS"
2. En la sección "Project", usar:

```json
{
  "nombre": 1, 
  "puesto": 1, 
  "_id": 0
}
```

3. Clic en "Find" para ejecutar la consulta con proyección

## Explicación
- `"nombre": 1`: Incluir el campo nombre en los resultados
- `"puesto": 1`: Incluir el campo puesto en los resultados
- `"_id": 0`: Excluir el campo _id de los resultados

