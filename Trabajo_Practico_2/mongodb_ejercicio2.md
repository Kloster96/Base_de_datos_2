# Ejercicio 2: Búsquedas con operadores

Consultar todos los empleados cuya edad esté entre 25 y 40 años usando operadores relacionales y lógicos:

1. En la colección "empleados", usar el siguiente filtro:

```json
{
  "edad": { 
    "$gte": 25, 
    "$lte": 40 
  }
}
```

2. Clic en "Find" para ejecutar la consulta

## Explicación
- `$gte: 25`: Greater than or equal - Mayor o igual que 25
- `$lte: 40`: Less than or equal - Menor o igual que 40
- Los dos operadores combinados crean un AND lógico implícito

Este filtro mostrará todos los empleados que tengan 25 años o más, y 40 años o menos.
