# Ejercicio 4: Documentos embebidos

Agregar un campo dirección que incluya calle, ciudad y código postal a los documentos de empleados:

## Pasos en MongoDB Compass

1. Seleccionar un empleado (por ejemplo, Juan Pérez)
2. Clic en el botón de edición (icono de lápiz)
3. Añadir el objeto dirección:

```json
{
  "direccion": {
    "calle": "Calle Mayor 45",
    "ciudad": "Madrid",
    "codigo_postal": "28001"
  }
}
```

4. Clic en "Update"

5. Repetir para Ana López con una dirección diferente:

```json
{
  "direccion": {
    "calle": "Rambla 22",
    "ciudad": "Barcelona",
    "codigo_postal": "08002"
  }
}
```

## Verificación
Para verificar los documentos embebidos, mostrar todos los empleados y comprobar que cada uno tiene su dirección correctamente estructurada.

## Consulta avanzada de ejemplo (con documentos embebidos)
Para buscar empleados que vivan en Madrid:

```json
{
  "direccion.ciudad": "Madrid"
}
```

Este tipo de búsqueda demuestra cómo acceder a campos dentro de documentos embebidos utilizando la notación de punto.
