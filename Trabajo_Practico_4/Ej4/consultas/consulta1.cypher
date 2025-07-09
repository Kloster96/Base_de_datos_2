//Listar la transcripción académica de un estudiante.
MATCH (e:Estudiante {nombre: 'Carla'})- [r:CURSO_REALIZADO]->(c:Curso)-[:CORRESPONDE_A]->(m:Materia)
RETURN 
    m.nombre AS Materia, 
    c.codigo AS CodigoCurso, 
    c.anio AS Año, 
    r.nota AS Nota
ORDER BY c.anio, m.nombre


