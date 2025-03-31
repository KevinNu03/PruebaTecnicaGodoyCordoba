USE [PruebaTecnica]
GO
--SE REALIZA MODIFICACIÓN PARA QUE TODO SEA POR HORAS PARA REALIZAR LA VALIDACION EN EL ULTIMO REGISTRO SE PONE EL NUMERO MAX PARA VALIDAR
--SE REALIZA DE ESTA MANERA PARA QUE SEA MAS AUTOMATICO Y LOS VALORES PUEDAN SER MODIFICADOS EN CUALQUIER MOMENTO

MERGE ClasificacionUsuario AS destino
USING (VALUES 
    (1,'Hechicero', 0, 12),
	(2,'Luchador', 12, 48), 
	(3,'Explorador', 48, 168), 
	(4,'Olvidado', 168, 999999999)
) AS origen (IdClasificacionUsuario,NombreClasificacion, InicioHoras, FinHoras)
ON destino.IdClasificacionUsuario = origen.IdClasificacionUsuario
WHEN MATCHED THEN
    UPDATE SET destino.NombreClasificacion = origen.NombreClasificacion,
			   destino.InicioHoras = origen.InicioHoras,
               destino.FinHoras = origen.FinHoras
WHEN NOT MATCHED THEN
    INSERT (NombreClasificacion, InicioHoras, FinHoras)
    VALUES (origen.NombreClasificacion, origen.InicioHoras, origen.FinHoras);
GO

