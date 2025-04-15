## Ejercicio 5: Creación de Índices

Vamos a diseñar consultas que filtren por múltiples campos y probar diferentes estrategias de indexación.

### Diseño de consulta con múltiples condiciones

```sql
-- Consulta que filtra por múltiples campos
SELECT * 
FROM ventas 
WHERE producto_id = 500 
  AND fecha_venta BETWEEN '2023-06-01' AND '2023-06-30' 
  AND cantidad > 5;
```

### Probar diferentes estrategias de índices

#### Estrategia 1: Índices individuales

```sql
-- Crear índices individuales
CREATE INDEX idx_producto_id ON ventas(producto_id);
CREATE INDEX idx_fecha_venta ON ventas(fecha_venta);
CREATE INDEX idx_cantidad ON ventas(cantidad);

-- Ejecutar la consulta y medir
EXPLAIN SELECT * 
FROM ventas 
WHERE producto_id = 500 
  AND fecha_venta BETWEEN '2023-06-01' AND '2023-06-30' 
  AND cantidad > 5;
```

#### Estrategia 2: Índice compuesto (producto_id, fecha_venta)

```sql
-- Eliminar índices anteriores
DROP INDEX idx_producto_id ON ventas;
DROP INDEX idx_fecha_venta ON ventas;
DROP INDEX idx_cantidad ON ventas;

-- Crear índice compuesto
CREATE INDEX idx_prod_fecha ON ventas(producto_id, fecha_venta);

-- Ejecutar la consulta y medir
EXPLAIN SELECT * 
FROM ventas 
WHERE producto_id = 500 
  AND fecha_venta BETWEEN '2023-06-01' AND '2023-06-30' 
  AND cantidad > 5;
```

#### Estrategia 3: Índice compuesto (producto_id, fecha_venta, cantidad)

```sql
-- Eliminar índice anterior
DROP INDEX idx_prod_fecha ON ventas;

-- Crear índice compuesto con los tres campos
CREATE INDEX idx_prod_fecha_cant ON ventas(producto_id, fecha_venta, cantidad);

-- Ejecutar la consulta y medir
EXPLAIN SELECT * 
FROM ventas 
WHERE producto_id = 500 
  AND fecha_venta BETWEEN '2023-06-01' AND '2023-06-30' 
  AND cantidad > 5;
```

### Comparación de rendimiento de los índices

Para cada estrategia, ejecutamos:

```sql
SET profiling = 1;
SELECT * 
FROM ventas 
WHERE producto_id = 500 
  AND fecha_venta BETWEEN '2023-06-01' AND '2023-06-30' 
  AND cantidad > 5;
SHOW PROFILES;
```

Resultados esperados:
1. Índices individuales: El optimizador usará probablemente idx_producto_id
2. Índice compuesto (producto_id, fecha_venta): Mejor rendimiento que los índices individuales
3. Índice compuesto completo: Mejor rendimiento para esta consulta específica

El mejor índice probablemente será:
```sql
CREATE INDEX idx_prod_fecha_cant ON ventas(producto_id, fecha_venta, cantidad);
```

Esto se debe a que:
- El campo más selectivo (producto_id) está primero
- Los tres campos de la cláusula WHERE están incluidos
- Sigue el orden adecuado para las condiciones (igualdad, rango, rango)