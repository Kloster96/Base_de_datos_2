# Ejercicio 1: Reglas de Integridad

## Problema
Dado un modelo de base de datos de una universidad, identificar violaciones posibles a la integridad referencial si se elimina un estudiante con cursos inscritos. ¿Qué mecanismos usarías para evitarlo?

## Violaciones posibles de integridad referencial

Si se elimina un estudiante que tiene cursos inscritos, pueden ocurrir las siguientes violaciones de integridad referencial:

1. **Registros huérfanos**: En la tabla de inscripciones o matrículas quedarían registros que hacen referencia a un estudiante que ya no existe.
2. **Inconsistencia de datos**: Los reportes de asistencia, calificaciones o historial académico quedarían incompletos o inconsistentes.
3. **Afectación a estadísticas**: Los conteos o promedios relacionados con los cursos se verían afectados.

## Modelo de ejemplo

```sql
-- Estructura básica del modelo de base de datos
CREATE TABLE Estudiantes (
    id INTEGER PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    fecha_nacimiento DATE,
    activo BOOLEAN DEFAULT true
);

CREATE TABLE Cursos (
    codigo VARCHAR(10) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    creditos INTEGER NOT NULL
);

CREATE TABLE Matriculas (
    id INTEGER PRIMARY KEY,
    id_estudiante INTEGER NOT NULL,
    codigo_curso VARCHAR(10) NOT NULL,
    periodo VARCHAR(20) NOT NULL,
    fecha_inscripcion DATE NOT NULL,
    calificacion DECIMAL(3,1),
    FOREIGN KEY (id_estudiante) REFERENCES Estudiantes(id),
    FOREIGN KEY (codigo_curso) REFERENCES Cursos(codigo)
);

CREATE TABLE Asistencias (
    id INTEGER PRIMARY KEY,
    id_matricula INTEGER NOT NULL,
    fecha DATE NOT NULL,
    presente BOOLEAN NOT NULL,
    FOREIGN KEY (id_matricula) REFERENCES Matriculas(id)
);
```

## Mecanismos para evitar violaciones de integridad referencial

### 1. Restricción RESTRICT/NO ACTION

Impide la eliminación del estudiante si tiene cursos inscritos.

```sql
ALTER TABLE Matriculas DROP CONSTRAINT IF EXISTS fk_estudiante;
ALTER TABLE Matriculas ADD CONSTRAINT fk_estudiante
    FOREIGN KEY (id_estudiante) REFERENCES Estudiantes(id) 
    ON DELETE RESTRICT;
```

Ejemplo de intento de eliminación:

```sql
-- Intentar eliminar un estudiante con matrículas existentes
DELETE FROM Estudiantes WHERE id = 1;
-- Generará un error: "ERROR: update or delete on table "estudiantes" violates foreign key constraint on table "matriculas"
```

### 2. Restricción CASCADE

Elimina automáticamente todas las inscripciones asociadas al estudiante.

```sql
ALTER TABLE Matriculas DROP CONSTRAINT IF EXISTS fk_estudiante;
ALTER TABLE Matriculas ADD CONSTRAINT fk_estudiante
    FOREIGN KEY (id_estudiante) REFERENCES Estudiantes(id) 
    ON DELETE CASCADE;

-- También es necesario configurar las tablas relacionadas
ALTER TABLE Asistencias DROP CONSTRAINT IF EXISTS fk_matricula;
ALTER TABLE Asistencias ADD CONSTRAINT fk_matricula
    FOREIGN KEY (id_matricula) REFERENCES Matriculas(id) 
    ON DELETE CASCADE;
```

Ejemplo de eliminación en cascada:

```sql
-- Al eliminar un estudiante, se eliminarán automáticamente todas sus matrículas
-- y a su vez todas las asistencias relacionadas con esas matrículas
DELETE FROM Estudiantes WHERE id = 1;
```

### 3. Restricción SET NULL

Mantiene los registros de inscripción pero establece el campo del estudiante como NULL.

```sql
ALTER TABLE Matriculas DROP CONSTRAINT IF EXISTS fk_estudiante;
ALTER TABLE Matriculas ADD CONSTRAINT fk_estudiante
    FOREIGN KEY (id_estudiante) REFERENCES Estudiantes(id) 
    ON DELETE SET NULL;
```

Para implementar esta opción, primero debemos modificar la tabla para permitir valores NULL:

```sql
ALTER TABLE Matriculas ALTER COLUMN id_estudiante DROP NOT NULL;
```

### 4. Eliminación lógica

Utilizar un campo "activo" en la tabla Estudiantes en lugar de eliminar físicamente el registro.

```sql
-- No es necesario modificar las restricciones de clave foránea

-- Para "eliminar" un estudiante:
UPDATE Estudiantes SET activo = false WHERE id = 1;

-- Para consultas que solo consideren estudiantes activos:
SELECT * FROM Estudiantes WHERE activo = true;

-- Las consultas sobre matrículas pueden incluir la condición para mostrar solo estudiantes activos:
SELECT m.*, e.nombre 
FROM Matriculas m
JOIN Estudiantes e ON m.id_estudiante = e.id
WHERE e.activo = true;
```

## Recomendación

La mejor práctica depende del contexto específico:

- **Eliminación lógica**: Es la opción más segura para entornos académicos, ya que preserva el historial completo.
- **RESTRICT**: Adecuada cuando se quiere forzar un proceso manual para gestionar las dependencias antes de eliminar.
- **CASCADE**: Útil en sistemas donde se necesita una limpieza completa de todos los datos asociados.
- **SET NULL**: Menos común en este contexto, pero útil si se desea conservar registros históricos sin asociación a un estudiante específico.

En un entorno universitario real, la combinación de eliminación lógica (campo activo) junto con RESTRICT para operaciones de eliminación física suele ser la estrategia más robusta.
