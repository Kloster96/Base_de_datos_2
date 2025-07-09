//Obtener el nombre del proyecto, su líder y los empleados asignados.
MATCH (p:Proyecto)<-[:LIDERA]-(lider:Empleado),(emp:Empleado)-[a:ASIGNADO_A]->(p)
RETURN 
  p.nombre AS Proyecto, 
  lider.nombre AS Lider,
  collect(emp.nombre) AS EmpleadosAsignados;
