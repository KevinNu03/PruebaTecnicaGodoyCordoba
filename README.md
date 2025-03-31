# Prueba Tecnica Godoy Cordoba

1. Descargar el proyecto.

2. En el proyecto WebApiUsuarios, configurar la ruta de la base de datos en el archivo appsettings.json, dentro de DefaultConnection. Puedes hacerlo cambiando solo el server y el nombre de la base de datos o agregando el usuario y la contraseña.

3. Ejecutar el archivo ScriptsObjetos.sql para crear la base de datos y las tablas.

4. Ejecutar el archivo ScriptsDatos.sql para agregar los registros en las tablas paramétricas.

5. Ejecutar el archivo ScriptsNuevos.sql para crear los procedimientos almacenados (Stored Procedures) necesarios para el funcionamiento de la aplicación.

6. En el proyecto de Angular "Usuarios", ejecutar el comando npm install para instalar los módulos de Node.js necesarios.

7. Validar en el archivo environments/environments.ts el puerto del localhost donde se ejecuta la Web API.
