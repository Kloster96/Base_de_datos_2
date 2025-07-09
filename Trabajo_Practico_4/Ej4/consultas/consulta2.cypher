//Verificar si un estudiante puede inscribirse en una materia (si aprobó los prerrequisitos). 
MATCH (e:Estudiante {nombre: 'Carla'})
MATCH (m:Materia {nombre: 'Algoritmos'})
MATCH (prereq:Materia)-[:ES_PRERREQUISITO_DE]->(m)
MATCH (e)-[r:CURSO_REALIZADO]->(:Curso)-[:CORRESPONDE_A]->(prereq)
WHERE r.nota >= 6
RETURN prereq.nombre AS Prerrequisito, r.nota AS Nota
