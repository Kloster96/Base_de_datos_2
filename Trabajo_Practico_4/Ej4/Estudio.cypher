MATCH (n) DETACH DELETE n; // para que no se dupliquen
//NODOS
CREATE
  (ana:Estudiante {nombre: "Ana"}),
  (beto:Estudiante {nombre: "Beto"}),
  (carla:Estudiante {nombre: "Carla"}),


  (mat:Materia {nombre: "Matemáticas"}),
  (prog:Materia {nombre: "Programación"}),
  (alg:Materia {nombre: "Algoritmos"}),


  (c1:Curso {codigo: "MAT101", anio: 2024}),
  (c2:Curso {codigo: "PRO102", anio: 2024}),
  (c3:Curso {codigo: "ALG201", anio: 2025}),
  (c4:Curso {codigo: "PRO202", anio: 2025}),

//RELACIONES
// los cursos con las materias
  (c1)-[:CORRESPONDE_A]->(mat),

  (c2)-[:CORRESPONDE_A]->(prog),

  (c3)-[:CORRESPONDE_A]->(alg),


  (c4)-[:CORRESPONDE_A]->(prog),

  // Prerrequisitos (solo programacion)
  (prog)-[:ES_PRERREQUISITO_DE]->(alg),


  // estudiantes y cursos hechos + las notas
  (ana)-[:CURSO_REALIZADO {nota: 8}]->(c1),

  (ana)-[:CURSO_REALIZADO {nota: 7}]->(c2),


  (beto)-[:CURSO_REALIZADO {nota: 6}]->(c2),


  (beto)-[:CURSO_REALIZADO {nota: 9}]->(c3),

  (carla)-[:CURSO_REALIZADO {nota: 5}]->(c1),


  (carla)-[:CURSO_REALIZADO {nota: 6}]->(c4)

