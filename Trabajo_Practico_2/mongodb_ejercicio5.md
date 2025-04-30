# Ejercicio 5: Agregación

## 1. Crear colección "ventas"
1. En MongoDB Compass, dentro de la base de datos "empresa"
2. Clic en "Create Collection"
3. Nombre: `ventas`
4. Clic en "Create"

## 2. Insertar datos de ventas

```json
{
  "producto": "laptop", 
  "cantidad": 2, 
  "precio_unitario": 1200
}
```

```json
{
  "producto": "teclado", 
  "cantidad": 5, 
  "precio_unitario": 50
}
```

```json
{
  "producto": "laptop", 
  "cantidad": 1, 
  "precio_unitario": 1200
}
```

```json
{
  "producto": "mouse", 
  "cantidad": 10, 
  "precio_unitario": 25
}
```

```json
{
  "producto": "teclado", 
  "cantidad": 3, 
  "precio_unitario": 50
}
```

## 3. Calcular total de ventas por producto
1. Clic en "Aggregations" en la parte superior
2. Clic en "+ Add Stage"
3. Seleccionar "$group" de la lista
4. Configurar el stage:

```json
{
  "_id": "$producto",
  "total_vendido": { 
    "$sum": { 
      "$multiply": ["$cantidad", "$precio_unitario"] 
    } 
  },
  "unidades_vendidas": { "$sum": "$cantidad" }
}
```

5. Clic en "Add Stage"

## Resultado esperado

- laptop: 3600 (3 unidades)
- teclado: 400 (8 unidades)
- mouse: 250 (10 unidades)

## Explicación
- `"_id": "$producto"`: Agrupa por el campo producto
- `"$sum"`: Operador de suma para acumular valores
- `"$multiply"`: Operador para multiplicar valores (cantidad × precio unitario)
- La agregación calcula tanto el valor total por producto como el número total de unidades vendidas
