# Ejercicio 7: Gestión de Permisos

## Objetivo
Crear un usuario analista que solo pueda hacer SELECT en ciertas tablas. Intentar insertar desde ese usuario y explicar el resultado.

## Creación de las tablas de ejemplo

Primero crearemos algunas tablas para nuestro ejercicio:

```sql
-- Crear una base de datos de ejemplo
CREATE DATABASE empresa;

-- Usar la base de datos
\c empresa

-- Crear tablas para el ejercicio
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    fecha_registro DATE DEFAULT CURRENT_DATE
);

CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    stock INTEGER DEFAULT 0
);

CREATE TABLE ventas (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER REFERENCES clientes(id),
    fecha_venta DATE DEFAULT CURRENT_DATE,
    total DECIMAL(12, 2) NOT NULL
);

CREATE TABLE detalle_ventas (
    id SERIAL PRIMARY KEY,
    venta_id INTEGER REFERENCES ventas(id),
    producto_id INTEGER REFERENCES productos(id),
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL
);

-- Insertar algunos datos de ejemplo
INSERT INTO clientes (nombre, email)
VALUES ('Juan Pérez', 'juan@ejemplo.com'),
       ('María López', 'maria@ejemplo.com'),
       ('Carlos Ruiz', 'carlos@ejemplo.com');

INSERT INTO productos (nombre, precio, stock)
VALUES ('Laptop', 1200.00, 10),
       ('Smartphone', 800.00, 15),
       ('Tablet', 300.00, 20);

INSERT INTO ventas (cliente_id, total)
VALUES (1, 1200.00),
       (2, 800.00),
       (3, 600.00);

INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario)
VALUES (1, 1, 1, 1200.00),
       (2, 2, 1, 800.00),
       (3, 3, 2, 300.00);
```

## Creación del usuario analista

A continuación, crearemos un usuario con permisos limitados:

```sql
-- Crear el usuario analista (PostgreSQL)
CREATE USER analista WITH PASSWORD 'password123';

-- Dar permisos de conexión a la base de datos
GRANT CONNECT ON DATABASE empresa TO analista;

-- Dar permiso de uso del esquema public
GRANT USAGE ON SCHEMA public TO analista;

-- Dar permisos de SELECT solo a las tablas clientes y ventas
GRANT SELECT ON clientes, ventas TO analista;

-- Dar permisos de SELECT a una columna específica de productos
GRANT SELECT (id, nombre) ON productos TO analista;

-- No dar ningún permiso sobre detalle_ventas
```

## Acceso con el usuario analista

Para conectarse como el usuario analista:

```sql
-- Desconectarse del usuario actual (PostgreSQL)
\q

-- Conectarse como el usuario analista
psql -U analista -d empresa -h localhost
-- Ingresar la contraseña: password123
```

## Prueba de permisos SELECT

Probemos los permisos de SELECT:

```sql
-- Consultas que deberían funcionar
SELECT * FROM clientes;
SELECT * FROM ventas;
SELECT id, nombre FROM productos;

-- Consulta que debería fallar porque no tiene acceso a todas las columnas
SELECT * FROM productos;

-- Consulta que debería fallar porque no tiene acceso a esta tabla
SELECT * FROM detalle_ventas;
```

Resultado de las consultas con éxito:
```
-- Para la consulta: SELECT * FROM clientes;
 id |   nombre    |      email       | fecha_registro 
----+-------------+------------------+---------------
  1 | Juan Pérez  | juan@ejemplo.com | 2025-04-15
  2 | María López | maria@ejemplo.com| 2025-04-15
  3 | Carlos Ruiz | carlos@ejemplo.com| 2025-04-15
(3 rows)

-- Para la consulta: SELECT id, nombre FROM productos;
 id |   nombre    
----+-------------
  1 | Laptop
  2 | Smartphone
  3 | Tablet
(3 rows)
```

Resultado de las consultas fallidas:
```
-- Para la consulta: SELECT * FROM productos;
ERROR:  permission denied for table productos

-- Para la consulta: SELECT * FROM detalle_ventas;
ERROR:  permission denied for table detalle_ventas
```

## Prueba de operaciones de escritura

Ahora intentaremos realizar operaciones de inserción, actualización y eliminación con el usuario analista:

```sql
-- Intentar insertar un nuevo cliente
INSERT INTO clientes (nombre, email)
VALUES ('Ana García', 'ana@ejemplo.com');

-- Intentar actualizar un cliente existente
UPDATE clientes
SET email = 'juan.nuevo@ejemplo.com'
WHERE id = 1;

-- Intentar eliminar un cliente
DELETE FROM clientes
WHERE id = 3;
```

Resultado de las operaciones de escritura:
```
-- Para todas las operaciones de escritura:
ERROR:  permission denied for table clientes
```

## Explicación de los resultados

1. **Permisos de SELECT**:
   - El usuario analista puede hacer SELECT en las tablas clientes y ventas sin restricciones.
   - En la tabla productos, solo puede ver las columnas id y nombre, pero no precio ni stock.
   - No tiene acceso a la tabla detalle_ventas.

2. **Operaciones de escritura**:
   - El usuario analista no puede realizar operaciones INSERT, UPDATE o DELETE en ninguna tabla, incluso en aquellas donde tiene permiso de SELECT.
   - Esto demuestra que los permisos de lectura y escritura son independientes.

## Modificación de permisos

Si quisiéramos darle permiso para insertar clientes, pero no para modificarlos ni eliminarlos:

```sql
-- Como administrador (no como analista)
GRANT INSERT ON clientes TO analista;
```

Ahora el usuario analista podría insertar nuevos clientes, pero seguiría sin poder actualizarlos ni eliminarlos.

## Revocación de permisos

Para revocar un permiso específico:

```sql
-- Como administrador
REVOKE INSERT ON clientes FROM analista;
```

## Eliminación del usuario (cuando ya no se necesite)

```sql
-- Como administrador
DROP USER IF EXISTS analista;
```

## Conclusión

La gestión adecuada de permisos es fundamental para la seguridad de una base de datos:

1. Siguiendo el principio de privilegio mínimo, se deben otorgar solo los permisos estrictamente necesarios.
2. Es posible restringir el acceso a nivel de tabla, columna y operación.
3. Los permisos de lectura (SELECT) son independientes de los permisos de escritura (INSERT, UPDATE, DELETE).
4. Este enfoque permite crear roles específicos como "analista" que pueden consultar datos sin riesgo de modificarlos accidentalmente.