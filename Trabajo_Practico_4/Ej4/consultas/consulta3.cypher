//Calcular el promedio de calificaciones por estudiante.
MATCH (e:Estudiante)-[r:CURSO_REALIZADO]->(:Curso)
RETURN 
  e.nombre AS Estudiante, 
  round(avg(r.nota), 2) AS Promedio
ORDER BY Promedio DESC
