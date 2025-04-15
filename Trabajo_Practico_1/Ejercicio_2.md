# Ejercicio 2: Implementación de Restricciones

## Problema
Crear una tabla Matriculas con restricciones de clave foránea. Luego, insertar datos que violen la integridad y mostrar el error generado.

## Creación de la estructura de la base de datos

Primero necesitamos crear las tablas base con sus respectivas restricciones:

```sql
-- Primero creamos las tablas necesarias
CREATE TABLE Estudiantes (
    id INTEGER PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    fecha_ingreso DATE DEFAULT CURRENT_DATE
);

CREATE TABLE Cursos (
    codigo VARCHAR(10) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    creditos INTEGER NOT NULL CHECK (creditos > 0),
    departamento VARCHAR(50) NOT NULL
);

-- Tabla Matriculas con restricciones de clave foránea
CREATE TABLE Matriculas (
    id INTEGER PRIMARY KEY,
    id_estudiante INTEGER NOT NULL,
    codigo_curso VARCHAR(10) NOT NULL,
    fecha_inscripcion DATE NOT NULL DEFAULT CURRENT_DATE,
    calificacion DECIMAL(3,1) CHECK (calificacion >= 0.0 AND calificacion <= 10.0),
    CONSTRAINT fk_estudiante FOREIGN KEY (id_estudiante) 
        REFERENCES Estudiantes(id),
    CONSTRAINT fk_curso FOREIGN KEY (codigo_curso) 
        REFERENCES Cursos(codigo)
);
```

## Inserción de datos de prueba

Insertamos algunos datos válidos para nuestras pruebas:

```sql
-- Insertar datos en la tabla Estudiantes
INSERT INTO Estudiantes (id, nombre, email) VALUES 
    (1, 'Ana García', 'ana@universidad.edu'),
    (2, 'Carlos López', 'carlos@universidad.edu'),
    (3, 'María Rodríguez', 'maria@universidad.edu');

-- Insertar datos en la tabla Cursos
INSERT INTO Cursos (codigo, nombre, creditos, departamento) VALUES 
    ('CS101', 'Introducción a la Programación', 4, 'Informática'),
    ('MAT202', 'Cálculo Avanzado', 5, 'Matemáticas'),
    ('FIS103', 'Física Mecánica', 4, 'Física');

-- Insertar matrículas válidas
INSERT INTO Matriculas (id, id_estudiante, codigo_curso, fecha_inscripcion) VALUES 
    (1, 1, 'CS101', '2025-02-10'),
    (2, 2, 'MAT202', '2025-02-11'),
    (3, 3, 'FIS103', '2025-02-12');
```

## Casos de violación de integridad referencial

### Caso 1: Insertar matrícula con ID de estudiante inexistente

```sql
-- Intento de insertar una matrícula con un estudiante que no existe
INSERT INTO Matriculas (id, id_estudiante, codigo_curso, fecha_inscripcion)
VALUES (4, 999, 'CS101', '2025-04-15');
```

**Resultado esperado:**
```
ERROR: insert or update on table "matriculas" violates foreign key constraint "fk_estudiante"
DETAIL: Key (id_estudiante)=(999) is not present in table "estudiantes".
```

### Caso 2: Insertar matrícula con código de curso inexistente

```sql
-- Intento de insertar una matrícula con un curso que no existe
INSERT INTO Matriculas (id, id_estudiante, codigo_curso, fecha_inscripcion)
VALUES (4, 1, 'BIO404', '2025-04-15');
```

**Resultado esperado:**
```
ERROR: insert or update on table "matriculas" violates foreign key constraint "fk_curso"
DETAIL: Key (codigo_curso)=(BIO404) is not present in table "cursos".
```

### Caso 3: Intentar eliminar un estudiante que tiene matrículas

```sql
-- Intentar eliminar un estudiante que tiene matrículas asociadas
DELETE FROM Estudiantes WHERE id = 1;
```

**Resultado esperado (si no hay ON DELETE CASCADE):**
```
ERROR: update or delete on table "estudiantes" violates foreign key constraint "fk_estudiante" on table "matriculas"
DETAIL: Key (id)=(1) is still referenced from table "matriculas".
```

### Caso 4: Intentar eliminar un curso que tiene estudiantes matriculados

```sql
-- Intentar eliminar un curso que tiene estudiantes matriculados
DELETE FROM Cursos WHERE codigo = 'CS101';
```

**Resultado esperado (si no hay ON DELETE CASCADE):**
```
ERROR: update or delete on table "cursos" violates foreign key constraint "fk_curso" on table "matriculas"
DETAIL: Key (codigo)=(CS101) is still referenced from table "matriculas".
```

### Caso 5: Insertar una matrícula con calificación fuera del rango permitido

```sql
-- Intento de insertar una matrícula con calificación superior a 10
INSERT INTO Matriculas (id, id_estudiante, codigo_curso, fecha_inscripcion, calificacion)
VALUES (4, 3, 'MAT202', '2025-04-15', 11.5);
```

**Resultado esperado:**
```
ERROR: new row for relation "matriculas" violates check constraint "matriculas_calificacion_check"
DETAIL: Failing row contains (4, 3, MAT202, 2025-04-15, 11.5).
```

## Modificando restricciones para ver diferente comportamiento

### Implementar ON DELETE CASCADE

```sql
-- Eliminar las restricciones existentes
ALTER TABLE Matriculas DROP CONSTRAINT fk_estudiante;
ALTER TABLE Matriculas DROP CONSTRAINT fk_curso;

-- Agregar restricciones con ON DELETE CASCADE
ALTER TABLE Matriculas ADD CONSTRAINT fk_estudiante 
    FOREIGN KEY (id_estudiante) REFERENCES Estudiantes(id)
    ON DELETE CASCADE;

ALTER TABLE Matriculas ADD CONSTRAINT fk_curso 
    FOREIGN KEY (codigo_curso) REFERENCES Cursos(codigo)
    ON DELETE CASCADE;

-- Ahora al eliminar un estudiante, se eliminarán automáticamente todas sus matrículas
DELETE FROM Estudiantes WHERE id = 1;
-- Verificar que las matrículas asociadas fueron eliminadas
SELECT * FROM Matriculas WHERE id_estudiante = 1;
```

### Implementar ON DELETE SET NULL

```sql
-- Primero debemos permitir NULL en las columnas de clave foránea
ALTER TABLE Matriculas ALTER COLUMN id_estudiante DROP NOT NULL;
ALTER TABLE Matriculas ALTER COLUMN codigo_curso DROP NOT NULL;

-- Eliminar las restricciones existentes
ALTER TABLE Matriculas DROP CONSTRAINT fk_estudiante;
ALTER TABLE Matriculas DROP CONSTRAINT fk_curso;

-- Agregar restricciones con ON DELETE SET NULL
ALTER TABLE Matriculas ADD CONSTRAINT fk_estudiante 
    FOREIGN KEY (id_estudiante) REFERENCES Estudiantes(id)
    ON DELETE SET NULL;

ALTER TABLE Matriculas ADD CONSTRAINT fk_curso 
    FOREIGN KEY (codigo_curso) REFERENCES Cursos(codigo)
    ON DELETE SET NULL;

-- Ahora al eliminar un estudiante, las matrículas quedarán con id_estudiante NULL
DELETE FROM Estudiantes WHERE id = 2;
-- Verificar que las matrículas asociadas tienen id_estudiante NULL
SELECT * FROM Matriculas WHERE id_estudiante IS NULL;
```

## Conclusión

Las restricciones de integridad referencial son fundamentales para mantener la consistencia de los datos en una base de datos relacional. En este ejercicio hemos demostrado:

1. Cómo configurar diferentes tipos de restricciones de clave foránea
2. Qué sucede cuando se intenta violar estas restricciones
3. Cómo diferentes comportamientos (RESTRICT, CASCADE, SET NULL) afectan las operaciones de eliminación

La elección del tipo de restricción depende de los requisitos del negocio y del comportamiento esperado cuando se modifican o eliminan datos en tablas relacionadas.