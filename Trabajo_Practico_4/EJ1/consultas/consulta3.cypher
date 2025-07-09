// Listar los empleados que trabajan en más de un proyecto.
MATCH (e:Empleado)-[:ASIGNADO_A]->(p:Proyecto)
WITH e, count(DISTINCT p) AS cantidad
WHERE cantidad > 1
RETURN e.nombre AS Empleado, cantidad AS ProyectosAsignados;
