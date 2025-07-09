MATCH (n) DETACH DELETE n; 
//NODOS
CREATE
  (dep1:Departamento {nombre: "Sistemas"}),
  (dep2:Departamento {nombre: "Contabilidad"}),
  (dep3:Departamento {nombre: "Recursos Humanos"}),

  (e1:Empleado {nombre: "Lucía"}),
  (e2:Empleado {nombre: "Tomás"}),
  (e3:Empleado {nombre: "Marcela"}),

  (p1:Proyecto {nombre: "Sistema ERP"}),
  (p2:Proyecto {nombre: "Plan de Capacitación"}),

//RELACIONES
// Relaciones de empleados con departamentos

  (e1)-[:PERTENECE_A]->(dep1),
  (e2)-[:PERTENECE_A]->(dep2),
  (e3)-[:PERTENECE_A]->(dep3),

  // lideres

  (e1)-[:LIDERA]->(p1),
  (e3)-[:LIDERA]->(p2),

  // asignación de horas semanales
  (e1)-[:ASIGNADO_A {horas: 10}]->(p1),
  (e2)-[:ASIGNADO_A {horas: 15}]->(p1),
  (e2)-[:ASIGNADO_A {horas: 12}]->(p2),
  (e3)-[:ASIGNADO_A {horas: 20}]->(p2);
