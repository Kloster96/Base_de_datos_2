# Ejercicio 3: Concurrencia

## Problema
Simular una situación donde dos usuarios intentan actualizar el mismo saldo de una cuenta bancaria. Analizar cómo afectan las condiciones de aislamiento (READ COMMITTED vs SERIALIZABLE).

## Creación de la estructura de base de datos

Primero, creamos una tabla para representar cuentas bancarias:

```sql
-- Creación de la tabla de cuentas bancarias
CREATE TABLE Cuentas (
    id INTEGER PRIMARY KEY,
    titular VARCHAR(100) NOT NULL,
    saldo DECIMAL(12,2) NOT NULL CHECK (saldo >= 0),
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar una cuenta de ejemplo
INSERT INTO Cuentas (id, titular, saldo) 
VALUES (1, 'Juan Pérez', 1000.00);
```

## Niveles de aislamiento en transacciones

Los niveles de aislamiento determinan cómo las transacciones interactúan entre sí cuando acceden a los mismos datos:

- **READ UNCOMMITTED**: Permite lecturas sucias (datos no confirmados)
- **READ COMMITTED**: Evita lecturas sucias pero permite lecturas no repetibles
- **REPEATABLE READ**: Evita lecturas no repetibles pero permite lecturas fantasma
- **SERIALIZABLE**: El nivel más estricto, evita todos los problemas de concurrencia

## Simulación con nivel READ COMMITTED

### Transacción 1 (Cliente A intenta retirar $200)

```sql
-- Sesión 1: Cliente A
BEGIN;
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

-- Verificar saldo disponible
SELECT id, titular, saldo FROM Cuentas WHERE id = 1;
-- Resultado: id=1, titular='Juan Pérez', saldo=1000.00

-- Simular tiempo de procesamiento (5 segundos)
-- Durante este tiempo, la Sesión 2 realiza su actualización

-- Actualizar el saldo (retirar $200)
UPDATE Cuentas 
SET saldo = saldo - 200, 
    ultima_actualizacion = CURRENT_TIMESTAMP 
WHERE id = 1;

-- Verificar el nuevo saldo
SELECT id, titular, saldo FROM Cuentas WHERE id = 1;
-- Resultado: id=1, titular='Juan Pérez', saldo=800.00

COMMIT;
```

### Transacción 2 (Cliente B intenta retirar $500)

```sql
-- Sesión 2: Cliente B - se ejecuta mientras la Sesión 1 está en "tiempo de procesamiento"
BEGIN;
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

-- Verificar saldo disponible
SELECT id, titular, saldo FROM Cuentas WHERE id = 1;
-- Resultado: id=1, titular='Juan Pérez', saldo=1000.00

-- Actualizar el saldo (retirar $500)
UPDATE Cuentas 
SET saldo = saldo - 500, 
    ultima_actualizacion = CURRENT_TIMESTAMP 
WHERE id = 1;

-- Verificar el nuevo saldo
SELECT id, titular, saldo FROM Cuentas WHERE id = 1;
-- Resultado: id=1, titular='Juan Pérez', saldo=500.00

COMMIT;
```

### Resultado final con READ COMMITTED

```sql
-- Consultar el saldo final después de ambas transacciones
SELECT id, titular, saldo FROM Cuentas WHERE id = 1;
-- Resultado: id=1, titular='Juan Pérez', saldo=800.00
```

**Análisis**:
- La Transacción 1 lee saldo = 1000
- La Transacción 2 lee saldo = 1000, actualiza a 500 y hace COMMIT
- La Transacción 1 actualiza a 1000 - 200 = 800 y hace COMMIT
- **Problema**: La actualización de la Transacción 2 se pierde (perdimos $500)
- Este es un ejemplo clásico del problema de "actualización perdida" (lost update)

## Simulación con nivel SERIALIZABLE

### Transacción 1 (Cliente A intenta retirar $200)

```sql
-- Sesión 1: Cliente A
BEGIN;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

-- Verificar saldo disponible
SELECT id, titular, saldo FROM Cuentas WHERE id = 1;
-- Resultado: id=1, titular='Juan Pérez', saldo=1000.00

-- Simular tiempo de procesamiento (5 segundos)
-- Durante este tiempo, la Sesión 2 realiza su actualización

-- Actualizar el saldo (retirar $200)
UPDATE Cuentas 
SET saldo = saldo - 200, 
    ultima_actualizacion = CURRENT_TIMESTAMP 
WHERE id = 1;

-- Verificar el nuevo saldo
SELECT id, titular, saldo FROM Cuentas WHERE id = 1;
-- Resultado: id=1, titular='Juan Pérez', saldo=800.00

COMMIT;
-- Si la Transacción 2 ya hizo COMMIT, esta operación fallará con un error de serialización
```

### Transacción 2 (Cliente B intenta retirar $500)

```sql
-- Sesión 2: Cliente B - se ejecuta mientras la Sesión 1 está en "tiempo de procesamiento"
BEGIN;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

-- Verificar saldo disponible
SELECT id, titular, saldo FROM Cuentas WHERE id = 1;
-- Resultado: id=1, titular='Juan Pérez', saldo=1000.00

-- Actualizar el saldo (retirar $500)
UPDATE Cuentas 
SET saldo = saldo - 500, 
    ultima_actualizacion = CURRENT_TIMESTAMP 
WHERE id = 1;

-- Verificar el nuevo saldo
SELECT id, titular, saldo FROM Cuentas WHERE id = 1;
-- Resultado: id=1, titular='Juan Pérez', saldo=500.00

COMMIT;
```

### Resultado con SERIALIZABLE

Si la Transacción 2 hace COMMIT primero:
- La Transacción 1 fallará al intentar hacer COMMIT con un error como:
```
ERROR: could not serialize access due to concurrent update
```

Si la Transacción 1 hace COMMIT primero:
- La Transacción 2 fallará al intentar hacer COMMIT.

**Resolución del error**:
La transacción que falla debe ser reintentada desde el principio:

```sql
-- Reintentar la transacción fallida
BEGIN;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

-- Verificar saldo disponible nuevamente (ahora refleja la actualización de la otra transacción)
SELECT id, titular, saldo FROM Cuentas WHERE id = 1;
-- Si la Transacción 1 tuvo éxito: id=1, titular='Juan Pérez', saldo=800.00

-- Actualizar el saldo con el nuevo valor (retirar $500)
UPDATE Cuentas 
SET saldo = saldo - 500, 
    ultima_actualizacion = CURRENT_TIMESTAMP 
WHERE id = 1;

-- Verificar el nuevo saldo
SELECT id, titular, saldo FROM Cuentas WHERE id = 1;
-- Resultado: id=1, titular='Juan Pérez', saldo=300.00

COMMIT;
```

### Resultado final correcto

```sql
-- Consultar el saldo final después de ambas transacciones
SELECT id, titular, saldo FROM Cuentas WHERE id = 1;
-- Resultado: id=1, titular='Juan Pérez', saldo=300.00
```

## Implementación práctica con control de versiones

Una forma práctica de manejar la concurrencia es implementar un sistema de control de versiones mediante un campo de versión:

```sql
-- Modificar la tabla para incluir un campo de versión
ALTER TABLE Cuentas ADD COLUMN version INTEGER DEFAULT 1;

-- Actualización optimista con control de versiones
BEGIN;
-- Leer el saldo y la versión actual
SELECT id, saldo, version FROM Cuentas WHERE id = 1;
-- Supongamos que obtenemos: saldo=1000.00, version=1

-- Actualizar sólo si la versión no ha cambiado
UPDATE Cuentas 
SET saldo = saldo - 200, 
    version = version + 1,
    ultima_actualizacion = CURRENT_TIMESTAMP 
WHERE id = 1 AND version = 1;

-- Verificar si la actualización tuvo éxito
-- Si no afectó filas, alguien más actualizó el registro primero
GET DIAGNOSTICS rowcount = ROW_COUNT;
IF rowcount = 0 THEN
    ROLLBACK;
    RAISE EXCEPTION 'La cuenta fue modificada por otro usuario. Por favor, reintentar.';
END IF;

COMMIT;
```

## Comparación de los niveles de aislamiento

| Nivel de aislamiento | Ventajas | Desventajas |
|---|---|---|
| **READ COMMITTED** | - Mayor concurrencia<br>- Menor bloqueo<br>- Mayor rendimiento | - Permite actualizaciones perdidas<br>- Permite lecturas no repetibles<br>- Permite lecturas fantasma |
| **SERIALIZABLE** | - Previene todos los problemas de concurrencia<br>- Garantiza consistencia total | - Menor concurrencia<br>- Mayor bloqueo<br>- Posibles deadlocks<br>- Transacciones abortadas que requieren reintentos |

## Recomendaciones prácticas

1. **Para operaciones críticas financieras**:
   - Usar SERIALIZABLE cuando la consistencia es crítica
   - Implementar lógica de reintento para manejar errores de serialización

2. **Para operaciones de alto rendimiento**:
   - Usar READ COMMITTED con control de versiones optimista
   - Implementar verificación de versión para detectar conflictos

3. **Estrategia híbrida**:
   - Usar REPEATABLE READ para un equilibrio entre consistencia y rendimiento
   - Agregar bloqueos explícitos para operaciones críticas

## Conclusión

El manejo correcto de la concurrencia es fundamental en sistemas de información donde múltiples usuarios pueden acceder y modificar los mismos datos simultáneamente. La elección del nivel de aislamiento debe basarse en un equilibrio entre la consistencia de los datos y el rendimiento del sistema.

En el caso específico de cuentas bancarias, donde la precisión es crítica, el nivel SERIALIZABLE ofrece las mayores garantías de consistencia, aunque a costa de un rendimiento potencialmente menor y la necesidad de manejar transacciones abortadas.