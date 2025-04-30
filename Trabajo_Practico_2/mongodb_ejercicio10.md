# Ejercicio 10: Seguridad y backups

## Crear un usuario con permisos de lectura y escritura

Para crear un usuario con permisos específicos, es necesario usar la Terminal, ya que MongoDB Compass no proporciona una interfaz completa para la administración de usuarios:

1. Abrir Terminal
2. Conectarse a MongoDB:
   ```bash
   mongosh
   ```
3. Cambiar a la base de datos admin:
   ```javascript
   use admin
   ```
4. Crear el usuario con permisos de lectura y escritura para la base de datos "empresa":
   ```javascript
   db.createUser({
     user: "usuario_empresa",
     pwd: "contraseña_segura",
     roles: [
       { role: "readWrite", db: "empresa" }
     ]
   })
   ```
5. Verificar que el usuario se ha creado correctamente:
   ```javascript
   db.getUsers()
   ```

## Comandos para backup y restauración

### Hacer backup de una base de datos

Para hacer una copia de seguridad completa de la base de datos "empresa":

```bash
mongodump --db empresa --out ~/Desktop/backup_mongodb
```

Esto creará una carpeta en el escritorio que contiene:
- Los archivos BSON con los datos de cada colección
- Los archivos JSON con los metadatos de cada colección

### Hacer backup de una colección específica

Para hacer backup solo de la colección "empleados":

```bash
mongodump --db empresa --collection empleados --out ~/Desktop/backup_mongodb
```

### Restaurar una base de datos completa

Para restaurar toda la base de datos desde un backup:

```bash
mongorestore --db empresa ~/Desktop/backup_mongodb/empresa
```

### Restaurar una colección específica

Para restaurar solo la colección "empleados":

```bash
mongorestore --db empresa --collection empleados ~/Desktop/backup_mongodb/empresa/empleados.bson
```

## Opciones adicionales de seguridad

### Habilitar autenticación en el servidor MongoDB

En un entorno de producción, la autenticación debería estar habilitada editando el archivo de configuración de MongoDB (`mongod.conf`):

```yaml
security:
  authorization: enabled
```

### Conectarse con autenticación

Para conectarse utilizando el usuario creado:

```bash
mongosh --authenticationDatabase admin -u usuario_empresa -p
```

### Cifrado de datos en reposo

Para datos sensibles, MongoDB Enterprise ofrece cifrado a nivel de campo y cifrado de toda la base de datos, protegiendo la información almacenada.

### Auditoría

MongoDB Enterprise permite configurar auditoría para registrar eventos importantes como cambios en la configuración, operaciones de autenticación y acceso a datos, cumpliendo requisitos de conformidad.
