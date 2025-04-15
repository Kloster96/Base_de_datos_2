# Optimización de Consultas, Índices y Vistas SQL

## Ejercicio 4: Plan de Ejecución

### Preparación del entorno
Primero, necesitamos una base de datos con más de 100,000 registros. Usaremos MySQL para este ejemplo y crearemos una tabla de ventas:

```sql
CREATE DATABASE optimizacion;
USE optimizacion;

CREATE TABLE ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    cliente_id INT NOT NULL,
    fecha_venta DATE NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL
);

-- Insertar datos de prueba (100,000+ registros)
DELIMITER //
CREATE PROCEDURE insertar_datos_prueba()
BEGIN
    DECLARE i INT DEFAULT 1;
    WHILE i <= 100000 DO
        INSERT INTO ventas (producto_id, cliente_id, fecha_venta, cantidad, precio_unitario)
        VALUES (
            FLOOR(1 + RAND() * 1000),  -- 1000 productos diferentes
            FLOOR(1 + RAND() * 5000),  -- 5000 clientes diferentes
            DATE_ADD('2023-01-01', INTERVAL FLOOR(RAND() * 365) DAY),
            FLOOR(1 + RAND() * 10),     -- Cantidad entre 1 y 10
            ROUND(10 + RAND() * 990, 2) -- Precio entre 10 y 1000
        );
        SET i = i + 1;
    END WHILE;
END //
DELIMITER ;

CALL insertar_datos_prueba();
```

### Consulta sin índice
Vamos a ejecutar una consulta que filtra por un rango de fechas y analizar su rendimiento:

```sql
-- Consulta sin índice
EXPLAIN SELECT * 
FROM ventas 
WHERE fecha_venta BETWEEN '2023-03-01' AND '2023-03-31';
```

#### Resultado del EXPLAIN (sin índice)
```
+----+-------------+--------+------------+------+---------------+------+---------+------+--------+----------+-------------+
| id | select_type | table  | partitions | type | possible_keys | key  | key_len | ref  | rows   | filtered | Extra       |
+----+-------------+--------+------------+------+---------------+------+---------+------+--------+----------+-------------+
|  1 | SIMPLE      | ventas | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 100000 |    11.11 | Using where |
+----+-------------+--------+------------+------+---------------+------+---------+------+--------+----------+-------------+
```

Observaciones:
- `type = ALL`: MySQL está realizando un escaneo completo de tabla.
- `rows = 100000`: Estima examinar todos los registros.
- `key = NULL`: No utiliza ningún índice.

### Creación de índice

```sql
-- Crear índice en fecha_venta
CREATE INDEX idx_fecha_venta ON ventas(fecha_venta);
```

### Consulta con índice

```sql
-- Misma consulta, ahora con índice
EXPLAIN SELECT * 
FROM ventas 
WHERE fecha_venta BETWEEN '2023-03-01' AND '2023-03-31';
```

#### Resultado del EXPLAIN (con índice)
```
+----+-------------+--------+------------+-------+----------------+----------------+---------+------+-------+----------+-------------+
| id | select_type | table  | partitions | type  | possible_keys  | key            | key_len | ref  | rows  | filtered | Extra       |
+----+-------------+--------+------------+-------+----------------+----------------+---------+------+-------+----------+-------------+
|  1 | SIMPLE      | ventas | NULL       | range | idx_fecha_venta| idx_fecha_venta| 3       | NULL | 8219  |    100.0 | Using where |
+----+-------------+--------+------------+-------+----------------+----------------+---------+------+-------+----------+-------------+
```

Observaciones:
- `type = range`: MySQL está usando un índice para limitar su búsqueda.
- `key = idx_fecha_venta`: Indica el índice utilizado.
- `rows = 8219`: Estima examinar aproximadamente 8,219 registros (mucho menos que antes).

### Comparación de rendimiento

Para medir el tiempo de ejecución real:

```sql
-- Sin índice (después de eliminar el índice creado previamente)
DROP INDEX idx_fecha_venta ON ventas;

SET profiling = 1;
SELECT * FROM ventas WHERE fecha_venta BETWEEN '2023-03-01' AND '2023-03-31';
SHOW PROFILES;

-- Con índice (después de recrear el índice)
CREATE INDEX idx_fecha_venta ON ventas(fecha_venta);

SET profiling = 1;
SELECT * FROM ventas WHERE fecha_venta BETWEEN '2023-03-01' AND '2023-03-31';
SHOW PROFILES;
```

Resultados esperados:
- Sin índice: ~0.5-1.0 segundos (depende del hardware)
- Con índice: ~0.05-0.2 segundos (significativamente más rápido)



