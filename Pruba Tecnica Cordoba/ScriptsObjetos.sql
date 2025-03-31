USE [master]
GO
--SE CREA LA BASE DE DATOS 
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'PruebaTecnica')
BEGIN
    CREATE DATABASE PruebaTecnica
END

GO
USE [PruebaTecnica]
--CREACIÓN DE TABLAS

--SE CREA LA TABLA PARAMETRICA PARA LA CLASIFICACIÓN DE LOS USUARIOS CON RESPECTO A SU INGRESO Y ESTE SEA MAS DINAMICO Y FACIL DE CAMBIAR
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'ClasificacionUsuario')
BEGIN
	CREATE TABLE ClasificacionUsuario (
        IdClasificacionUsuario INT IDENTITY (1,1) PRIMARY KEY,
        NombreClasificacion VARCHAR(100),
		InicioHoras INT,
		FinHoras INT
    );
END
GO

--SE CREA LA TABLA DE USUARIOS CON RESPECTO A LA DATA SOLICITADA CON SU RESPECTIVO PUNTAJE Y CLASIFICACIÓN
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Usuarios')
BEGIN
    CREATE TABLE Usuarios (
        IdUsuario INT IDENTITY (1,1) PRIMARY KEY,
        Nombre VARCHAR(100),
        Apellido VARCHAR(100),
        Cedula VARCHAR(15),
        CorreoElectronico VARCHAR(100),
        FechaUltimoIngreso DATETIME,
        Contrasena VARCHAR(300),
        Puntaje INT,
        IdClasificacionUsuario INT,
		FechaCreacion DATETIME,
		CONSTRAINT FK_Clasificacion_Usuario FOREIGN KEY (IdClasificacionUsuario) REFERENCES ClasificacionUsuario(IdClasificacionUsuario)
    );
END
GO

--SE CREA LA TABLA HISTORICO DE LOS INGRESOS PARA TENER UN REGISTRO DE CADA INGRESO QUE HA TENIDO EL CANDIDATO Y LAS CLASIFICACIONES A LAS QUE HA PERTENECIDO
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'HistorioIngresos')
BEGIN
    CREATE TABLE HistorioIngresos (
        IdHistorioIngresos INT IDENTITY (1,1) PRIMARY KEY,
		IdUsuario INT,
		IdClasificacionUsuario INT,
        FechaIngreso DATETIME,
		CONSTRAINT FK_Usuario_Usuario FOREIGN KEY (IdUsuario) REFERENCES Usuarios(IdUsuario),
		CONSTRAINT FK_Clasificacion_Historico FOREIGN KEY (IdClasificacionUsuario) REFERENCES ClasificacionUsuario(IdClasificacionUsuario)
    );
END
GO