# Ejercicio 8: Seguridad y Auditoría

## Objetivo
Simular una auditoría simple con triggers que registren toda modificación en una tabla Clientes.

## Creación de las tablas

Primero, vamos a crear la tabla Clientes y una tabla de auditoría para registrar los cambios:

```sql
-- Tabla principal de clientes
CREATE TABLE Clientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    telefono VARCHAR(20),
    direccion VARCHAR(200),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de auditoría para registrar cambios
CREATE TABLE Auditoria_Clientes (
    id SERIAL PRIMARY KEY,
    accion VARCHAR(10) NOT NULL, -- INSERT, UPDATE, DELETE
    usuario VARCHAR(100) NOT NULL,
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cliente_id INTEGER,
    datos_antiguos JSONB, -- Almacena el estado anterior (para UPDATE/DELETE)
    datos_nuevos JSONB -- Almacena el estado nuevo (para INSERT/UPDATE)
);
```

## Creación de los triggers

Ahora vamos a crear tres triggers para auditar las operaciones INSERT, UPDATE y DELETE:

```sql
-- Función que se ejecutará para todos los triggers
CREATE OR REPLACE FUNCTION registrar_auditoria_clientes()
RETURNS TRIGGER AS $$
DECLARE
    datos_old JSONB := NULL;
    datos_new JSONB := NULL;
BEGIN
    -- Obtener el nombre de usuario actual (en PostgreSQL)
    DECLARE
        usuario_actual TEXT;
    BEGIN
        usuario_actual := current_user;
    END;
    
    -- Preparar los datos según el tipo de operación
    IF (TG_OP = 'DELETE') THEN
        datos_old := row_to_json(OLD)::JSONB;
        INSERT INTO Auditoria_Clientes (accion, usuario, cliente_id, datos_antiguos, datos_nuevos)
        VALUES (TG_OP, usuario_actual, OLD.id, datos_old, NULL);
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        datos_old := row_to_json(OLD)::JSONB;
        datos_new := row_to_json(NEW)::JSONB;
        INSERT INTO Auditoria_Clientes (accion, usuario, cliente_id, datos_antiguos, datos_nuevos)
        VALUES (TG_OP, usuario_actual, NEW.id, datos_old, datos_new);
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        datos_new := row_to_json(NEW)::JSONB;
        INSERT INTO Auditoria_Clientes (accion, usuario, cliente_id, datos_antiguos, datos_nuevos)
        VALUES (TG_OP, usuario_actual, NEW.id, NULL, datos_new);
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para INSERT
CREATE TRIGGER tr_auditoria_clientes_insert
AFTER INSERT ON Clientes
FOR EACH ROW
EXECUTE FUNCTION registrar_auditoria_clientes();

-- Trigger para UPDATE
CREATE TRIGGER tr_auditoria_clientes_update
AFTER UPDATE ON Clientes
FOR EACH ROW
EXECUTE FUNCTION registrar_auditoria_clientes();

-- Trigger para DELETE
CREATE TRIGGER tr_auditoria_clientes_delete
AFTER DELETE ON Clientes
FOR EACH ROW
EXECUTE FUNCTION registrar_auditoria_clientes();
```

## Prueba de los triggers

Ahora, vamos a probar nuestros triggers con algunas operaciones sobre la tabla Clientes:

```sql
-- 1. Insertar algunos clientes
INSERT INTO Clientes (nombre, email, telefono, direccion)
VALUES ('Juan Pérez', 'juan@ejemplo.com', '555-1234', 'Calle Principal 123');

INSERT INTO Clientes (nombre, email, telefono, direccion)
VALUES ('María López', 'maria@ejemplo.com', '555-5678', 'Avenida Central 456');

-- 2. Verificar los registros de auditoría para INSERT
SELECT * FROM Auditoria_Clientes WHERE accion = 'INSERT';

-- 3. Actualizar un cliente
UPDATE Clientes
SET telefono = '555-9876', 
    direccion = 'Calle Nueva 789'
WHERE id = 1;

-- 4. Verificar los registros de auditoría para UPDATE
SELECT * FROM Auditoria_Clientes WHERE accion = 'UPDATE';

-- 5. Eliminar un cliente
DELETE FROM Clientes WHERE id = 2;

-- 6. Verificar los registros de auditoría para DELETE
SELECT * FROM Auditoria_Clientes WHERE accion = 'DELETE';

-- 7. Ver todos los registros de auditoría
SELECT 
    id,
    accion,
    usuario,
    to_char(fecha_hora, 'YYYY-MM-DD HH24:MI:SS') as fecha_hora,
    cliente_id,
    datos_antiguos ->> 'nombre' as nombre_antiguo,
    datos_nuevos ->> 'nombre' as nombre_nuevo,
    datos_antiguos ->> 'email' as email_antiguo,
    datos_nuevos ->> 'email' as email_nuevo
FROM Auditoria_Clientes
ORDER BY fecha_hora;
```

## Implementación en MySQL

Si estás utilizando MySQL en lugar de PostgreSQL, aquí está la implementación equivalente:

```sql
-- Tabla principal de clientes (MySQL)
CREATE TABLE Clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    telefono VARCHAR(20),
    direccion VARCHAR(200),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de auditoría para registrar cambios (MySQL)
CREATE TABLE Auditoria_Clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    accion VARCHAR(10) NOT NULL,
    usuario VARCHAR(100) NOT NULL,
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cliente_id INT,
    datos_antiguos JSON,
    datos_nuevos JSON
);

-- Trigger para INSERT (MySQL)
DELIMITER $$
CREATE TRIGGER tr_auditoria_clientes_insert
AFTER INSERT ON Clientes
FOR EACH ROW
BEGIN
    INSERT INTO Auditoria_Clientes (accion, usuario, cliente_id, datos_antiguos, datos_nuevos)
    VALUES ('INSERT', USER(), NEW.id, NULL, 
            JSON_OBJECT(
                'id', NEW.id,
                'nombre', NEW.nombre,
                'email', NEW.email,
                'telefono', NEW.telefono,
                'direccion', NEW.direccion,
                'fecha_registro', NEW.fecha_registro
            ));
END$$
DELIMITER ;

-- Trigger para UPDATE (MySQL)
DELIMITER $$
CREATE TRIGGER tr_auditoria_clientes_update
AFTER UPDATE ON Clientes
FOR EACH ROW
BEGIN
    INSERT INTO Auditoria_Clientes (accion, usuario, cliente_id, datos_antiguos, datos_nuevos)
    VALUES ('UPDATE', USER(), NEW.id, 
            JSON_OBJECT(
                'id', OLD.id,
                'nombre', OLD.nombre,
                'email', OLD.email,
                'telefono', OLD.telefono,
                'direccion', OLD.direccion,
                'fecha_registro', OLD.fecha_registro
            ),
            JSON_OBJECT(
                'id', NEW.id,
                'nombre', NEW.nombre,
                'email', NEW.email,
                'telefono', NEW.telefono,
                'direccion', NEW.direccion,
                'fecha_registro', NEW.fecha_registro
            ));
END$$
DELIMITER ;

-- Trigger para DELETE (MySQL)
DELIMITER $$
CREATE TRIGGER tr_auditoria_clientes_delete
AFTER DELETE ON Clientes
FOR EACH ROW
BEGIN
    INSERT INTO Auditoria_Clientes (accion, usuario, cliente_id, datos_antiguos, datos_nuevos)
    VALUES ('DELETE', USER(), OLD.id, 
            JSON_OBJECT(
                'id', OLD.id,
                'nombre', OLD.nombre,
                'email', OLD.email,
                'telefono', OLD.telefono,
                'direccion', OLD.direccion,
                'fecha_registro', OLD.fecha_registro
            ), NULL);
END$$
DELIMITER ;
```

## Consultas útiles para análisis de auditoría

Una vez que tenemos datos de auditoría, podemos realizar análisis como:

```sql
-- 1. Ver todas las modificaciones realizadas a un cliente específico
SELECT 
    accion,
    to_char(fecha_hora, 'YYYY-MM-DD HH24:MI:SS') as fecha_hora,
    usuario,
    datos_antiguos,
    datos_nuevos
FROM Auditoria_Clientes
WHERE cliente_id = 1
ORDER BY fecha_hora;

-- 2. Ver todas las operaciones realizadas por un usuario específico
SELECT 
    accion,
    to_char(fecha_hora, 'YYYY-MM-DD HH24:MI:SS') as fecha_hora,
    cliente_id,
    datos_antiguos ->> 'nombre' as nombre_antiguo,
    datos_nuevos ->> 'nombre' as nombre_nuevo
FROM Auditoria_Clientes
WHERE usuario = 'postgres'  -- cambia esto por el usuario real
ORDER BY fecha_hora;

-- 3. Ver todos los cambios realizados en un período específico
SELECT 
    accion,
    to_char(fecha_hora, 'YYYY-MM-DD HH24:MI:SS') as fecha_hora,
    usuario,
    cliente_id,
    datos_antiguos ->> 'nombre' as nombre_antiguo,
    datos_nuevos ->> 'nombre' as nombre_nuevo
FROM Auditoria_Clientes
WHERE fecha_hora BETWEEN '2025-04-15 00:00:00' AND '2025-04-15 23:59:59'
ORDER BY fecha_hora;

-- 4. Ver solo los cambios de email (importante para seguridad)
SELECT 
    accion,
    to_char(fecha_hora, 'YYYY-MM-DD HH24:MI:SS') as fecha_hora,
    usuario,
    cliente_id,
    datos_antiguos ->> 'email' as email_antiguo,
    datos_nuevos ->> 'email' as email_nuevo
FROM Auditoria_Clientes
WHERE (datos_antiguos ->> 'email') IS DISTINCT FROM (datos_nuevos ->> 'email')
ORDER BY fecha_hora;
```

## Ventajas del sistema de auditoría implementado

1. **Seguimiento completo**: Registra todas las operaciones (INSERT, UPDATE, DELETE) realizadas en la tabla Clientes.
2. **Captura de estado completo**: Almacena el estado completo antes y después del cambio, lo que permite análisis detallado.
3. **Registro de usuarios**: Identifica qué usuario realizó cada operación.
4. **Marca temporal**: Registra exactamente cuándo ocurrió cada cambio.
5. **Formato flexible**: El uso de JSON/JSONB permite almacenar datos estructurados de forma flexible.
6. **Rendimiento**: Los triggers se ejecutan automáticamente sin necesidad de modificar la lógica de la aplicación.

## Consideraciones adicionales

1. **Tamaño de la tabla de auditoría**: En sistemas con muchas operaciones, la tabla de auditoría puede crecer rápidamente. Considerar estrategias de particionamiento o archivado.
2. **Rendimiento**: Los triggers añaden una pequeña sobrecarga a cada operación. En sistemas de alto rendimiento, evaluar si se necesita auditar todas las operaciones.
3. **Seguridad**: Asegurar que los usuarios no puedan modificar la tabla de auditoría directamente.
4. **Limpieza**: Implementar políticas de retención de datos para mantener el tamaño de la tabla de auditoría bajo control.

## Conclusión

La implementación de un sistema de auditoría mediante triggers es una solución robusta para el seguimiento de cambios en bases de datos. Al registrar quién hizo qué cambio y cuándo, proporciona una herramienta invaluable para la seguridad, el cumplimiento normativo y la resolución de problemas.