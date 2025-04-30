# Ejercicio 9 - Replicación y Sharding en MongoDB

## ¿Para qué sirve un Replica Set?

Un *Replica Set* es un grupo de servidores que tienen copias iguales de los datos. Sirve para que la base de datos siga funcionando incluso si uno se cae. Algunas ventajas:

- Si el servidor principal falla, otro lo reemplaza solo.
- Hay copias de seguridad automáticas por si pasa algo.
- Las lecturas se pueden repartir entre los servidores, así todo anda más rápido.
- Se puede hacer backup sin parar el sistema.
- Se pueden poner servidores en distintos lugares para evitar problemas con cortes o desastres.

## ¿Qué beneficios tiene el Sharding?

El *Sharding* divide los datos en varios servidores para manejar mejor grandes volúmenes. Beneficios:

- Permite escalar agregando más máquinas (no hace falta una sola máquina muy potente).
- Mejora la velocidad porque reparte el trabajo.
- Es más barato usar varias máquinas comunes que una muy poderosa.
- Se puede guardar más información, sin límites reales.
- Se pueden poner los datos más cerca de los usuarios, bajando la latencia.
- Se pueden separar los datos según cómo se usan y darles recursos diferentes.

## Cosas a tener en cuenta

- Usar Replica Set y Sharding es más complicado, requiere saber bien cómo manejarlos.
- Elegir la clave correcta para hacer el *shard* es clave para que los datos se repartan bien.
- Las operaciones entre shards pueden ser más lentas o complicadas.
- Requiere más servidores, por lo tanto, más presupuesto.
