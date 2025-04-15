## Ejercicio 6: Vistas

### Crear una vista para resumir ventas mensuales por producto

```sql
-- Crear vista de ventas mensuales por producto
CREATE VIEW ventas_mensuales_producto AS
SELECT 
    producto_id,
    YEAR(fecha_venta) AS año,
    MONTH(fecha_venta) AS mes,
    SUM(cantidad) AS unidades_vendidas,
    SUM(cantidad * precio_unitario) AS total_ventas
FROM 
    ventas
GROUP BY 
    producto_id, 
    YEAR(fecha_venta), 
    MONTH(fecha_venta);
```

### Consulta para obtener los 5 productos más vendidos

```sql
-- Consulta para obtener los 5 productos más vendidos (por unidades totales)
SELECT 
    producto_id,
    SUM(unidades_vendidas) AS total_unidades
FROM 
    ventas_mensuales_producto
GROUP BY 
    producto_id
ORDER BY 
    total_unidades DESC
LIMIT 5;

-- Consulta para obtener los 5 productos más vendidos (por valor total)
SELECT 
    producto_id,
    SUM(total_ventas) AS valor_total_ventas
FROM 
    ventas_mensuales_producto
GROUP BY 
    producto_id
ORDER BY 
    valor_total_ventas DESC
LIMIT 5;
```

### Ventajas de usar esta vista

1. **Simplificación de consultas complejas**: La vista precomputa los agregados mensuales
2. **Rendimiento mejorado**: Los cálculos se realizan una vez en la vista
3. **Consistencia de datos**: Proporciona una única fuente de verdad para reportes de ventas
4. **Seguridad**: Podemos otorgar acceso a la vista sin dar acceso directo a la tabla de ventas
5. **Abstracción**: Los usuarios no necesitan conocer la estructura interna de las tablas

Para optimizar aún más el rendimiento al consultar frecuentemente esta vista, podríamos considerar:

```sql
-- Indexar la tabla subyacente correctamente
CREATE INDEX idx_ventas_fecha_prod ON ventas(fecha_venta, producto_id);

-- O incluso crear una vista materializada (aunque en MySQL no existe nativamente,
-- se puede simular con una tabla que se actualiza periódicamente)
CREATE TABLE ventas_mensuales_materializada AS
SELECT * FROM ventas_mensuales_producto;

-- Crear índices en la tabla materializada
CREATE INDEX idx_prod_id_mat ON ventas_mensuales_materializada(producto_id);
```