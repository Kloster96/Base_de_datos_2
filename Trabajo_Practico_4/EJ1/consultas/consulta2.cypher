//Calcular el total de horas semanales por proyecto. 
MATCH (:Empleado)-[a:ASIGNADO_A]->(p:Proyecto)
RETURN 
  p.nombre AS Proyecto, 
  sum(a.horas) AS HorasTotales
ORDER BY HorasTotales DESC;
