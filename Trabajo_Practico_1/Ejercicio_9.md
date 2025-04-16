# Ejercicio 9: Backup y Restore en MySQL

## Objetivo
Documentar paso a paso cómo hacer un backup completo en MySQL y cómo restaurarlo. Simular una pérdida de datos y su posterior recuperación.

## 1. Creación de un Backup Completo en MySQL

MySQL proporciona la herramienta `mysqldump` para crear copias de seguridad de manera eficiente.

### 1.1 Backup de una base de datos completa

```bash
# Sintaxis básica
mysqldump -u username -p database_name > backup_file.sql

# Ejemplo práctico
mysqldump -u root -p universidad > backup_universidad_completo.sql
```

### 1.2 Opciones útiles de mysqldump

```bash
# Incluir DROP TABLE antes de CREATE
mysqldump -u root -p --add-drop-table universidad > backup_universidad_drop.sql

# Backup de tablas específicas
mysqldump -u root -p universidad estudiantes cursos > backup_tablas_especificas.sql

# Backup de todas las bases de datos
mysqldump -u root -p --all-databases > backup_completo_mysql.sql

# Backup solo de estructura (sin datos)
mysqldump -u root -p --no-data universidad > estructura_universidad.sql

# Backup solo de datos (sin estructura)
mysqldump -u root -p --no-create-info universidad > datos_universidad.sql

# Backup con procedimientos almacenados y triggers
mysqldump -u root -p --routines --triggers universidad > backup_con_rutinas.sql
```

## 2. Restauración de un Backup en MySQL

### 2.1 Restaurar desde un archivo SQL

```bash
# Sintaxis básica
mysql -u username -p database_name < backup_file.sql

# Ejemplo práctico
mysql -u root -p universidad < backup_universidad_completo.sql
```

### 2.2 Restaurar en una base de datos nueva

```bash
# Crear primero la base de datos
mysql -u root -p -e "CREATE DATABASE universidad_restaurada;"

# Restaurar el backup en la nueva base
mysql -u root -p universidad_restaurada < backup_universidad_completo.sql
```

## 3. Simulación de pérdida y recuperación de datos

### 3.1 Creación de base de datos y tabla de ejemplo

```sql
-- Crear la base de datos
CREATE DATABASE simulacion_backup;

-- Seleccionar la base de datos
USE simulacion_backup;

-- Crear tabla de ejemplo
CREATE TABLE registros_academicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    estudiante VARCHAR(100) NOT NULL,
    asignatura VARCHAR(100) NOT NULL,
    calificacion DECIMAL(3,1) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos de muestra
INSERT INTO registros_academicos (estudiante, asignatura, calificacion)
VALUES 
    ('Juan Pérez', 'Base de Datos II', 8.5),
    ('María García', 'Base de Datos II', 9.0),
    ('Carlos López', 'Base de Datos II', 7.5),
    ('Ana Martínez', 'Base de Datos II', 10.0),
    ('Luis Torres', 'Base de Datos II', 8.0);

-- Verificar los datos insertados
SELECT * FROM registros_academicos;
```

### 3.2 Crear el backup antes del desastre

```bash
# Crear backup completo
mysqldump -u root -p simulacion_backup > backup_simulacion.sql

# Verificar que el archivo se ha creado correctamente
ls -la backup_simulacion.sql
```

### 3.3 Simular una pérdida de datos

```sql
-- Conectarse a la base de datos
USE simulacion_backup;

-- Opción 1: Eliminar algunos registros accidentalmente
DELETE FROM registros_academicos WHERE calificacion > 8.0;

-- Opción 2: Eliminar la tabla completa 
DROP TABLE registros_academicos;

-- Verificar la pérdida
SELECT * FROM registros_academicos; -- Dará error o mostrará menos datos
```

### 3.4 Restaurar desde el backup

```bash
# Restaurar la base de datos
mysql -u root -p simulacion_backup < backup_simulacion.sql

# Verificar la recuperación
mysql -u root -p -e "USE simulacion_backup; SELECT * FROM registros_academicos;"
```

## 4. Automatización de Backups en MySQL

### 4.1 Script para backup automatizado

```bash
#!/bin/bash
# Script para crear backups automatizados de MySQL

# Configuración
DB_NAME="universidad"
BACKUP_DIR="/var/backups/mysql"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_backup_$DATE.sql"

# Crear el directorio de backups si no existe
mkdir -p $BACKUP_DIR

# Crear el backup
echo "Creando backup de $DB_NAME en $BACKUP_FILE..."
mysqldump -u root -p"mi_contraseña" $DB_NAME > $BACKUP_FILE

# Comprimir el backup
gzip $BACKUP_FILE
echo "Backup completado: ${BACKUP_FILE}.gz"

# Eliminar backups antiguos (mantiene los últimos 7 días)
find $BACKUP_DIR -name "${DB_NAME}_backup_*.sql.gz" -mtime +7 -delete
```

### 4.2 Programar backups con cron

```bash
# Editar la tabla cron
crontab -e

# Añadir una línea para ejecutar el script todos los días a las 2 AM
0 2 * * * /ruta/al/script/backup_mysql.sh > /var/log/backup_mysql.log 2>&1
```

## 5. Mejores Prácticas para Backup y Restore en MySQL

### 5.1 Planificación de backups
- Realizar backups completos al menos una vez por semana
- Considerar backups incrementales diarios en bases de datos con muchas transacciones
- Mantener copias en diferentes ubicaciones físicas

### 5.2 Seguridad de los backups
- Encriptar backups que contengan información sensible
- Restringir permisos de acceso a los archivos de backup
- Verificar regularmente la integridad de los backups

### 5.3 Pruebas de restauración
- Realizar pruebas periódicas de restauración en un entorno de prueba
- Documentar y cronometrar el proceso de restauración
- Verificar la integridad de los datos restaurados

### 5.4 Backup de archivos de configuración
- Incluir en la estrategia de backup los archivos de configuración de MySQL (my.cnf)
- Documentar la configuración del servidor para facilitar la recuperación

### 5.5 Monitoreo y alertas
- Configurar alertas si un backup programado falla
- Monitorear el espacio de almacenamiento disponible para los backups