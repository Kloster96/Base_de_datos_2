//Detectar materias con promedio inferior a 7.
MATCH (:Estudiante)-[r:CURSO_REALIZADO]->(c:Curso)-[:CORRESPONDE_A]->(m:Materia)
WITH m.nombre AS Materia, avg(r.nota) AS Promedio
WHERE Promedio < 7
RETURN Materia, round(Promedio, 2) AS Promedio
ORDER BY Promedio ASC
