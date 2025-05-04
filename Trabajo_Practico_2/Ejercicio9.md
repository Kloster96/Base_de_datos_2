# Ejercicio 9: Replicación y Sharding (teórico)

## Replica Set (replicación)

Un **Replica Set** es un conjunto de servidores que contienen las mismas copias de los datos. La idea es tener varias réplicas de los datos en diferentes servidores para asegurar que, si uno falla, el sistema pueda seguir funcionando sin perder información. 

Cuando se usa un Replica Set:
- Si un servidor se apaga o falla, otro servidor asume automáticamente su rol.
- Los datos están duplicados, lo que ofrece **alta disponibilidad**.
- MongoDB elige un **"Primary"** (principal) y los otros servidores son **"Secondary"** (secundarios). Los secuenciales solo leen los datos; el primario es el que hace las escrituras.

### Ejemplo:

Supongamos que tienes 3 servidores MongoDB en diferentes ubicaciones. Si uno de ellos se cae por cualquier razón, los otros dos seguirán funcionando y el sistema no perderá acceso a los datos.

---

## Sharding

**Sharding** es el proceso de dividir los datos en múltiples partes, llamadas **"shards"**, y distribuirlos en diferentes servidores. Cuando la base de datos tiene grandes cantidades de datos, dividirla en fragmentos ayuda a mejorar el rendimiento y a distribuir la carga.

Cada fragmento (shard) puede estar en un servidor diferente. De esta manera, cuando un servidor recibe muchas solicitudes, puede repartir la carga entre otros servidores.

### Beneficios de Sharding:
- Mejora el rendimiento, porque la carga se distribuye entre diferentes servidores.
- Permite escalar la base de datos fácilmente añadiendo más servidores según sea necesario.
- Mejora la **escalabilidad horizontal**, permitiendo que el sistema siga creciendo.

---

## En resumen:
- **Replica Set**: ayuda a que la base de datos siga funcionando sin caídas, garantizando **alta disponibilidad**.
- **Sharding**: permite manejar grandes cantidades de datos al repartir la carga entre varios servidores.