USE [PruebaTecnica]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Kevin Nuñez>
-- Create date: <29/03/2025>
-- Description:	<SE CREA EL SP PARA TRAER LOS REGISTRO DE LOS USUARIOS YA SEAN TODOS O ALGUNO EN ESPECIFICO>
-- =============================================
CREATE OR ALTER PROCEDURE [SpGetUsuarios]
	-- Add the parameters for the stored procedure here
	@Cedula VARCHAR(15)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT
		U.IdUsuario
		,U.Nombre
		,U.Apellido
		,U.Cedula
		,U.CorreoElectronico
		,CASE WHEN U.FechaUltimoIngreso IS NULL THEN 'El usuario no ha ingresado' ELSE FORMAT(U.FechaUltimoIngreso, 'dd/MM/yyyy HH:mm tt') END AS FechaHoraUIngreso
		,U.Contrasena
		,U.Puntaje
		,U.IdClasificacionUsuario
		,CASE WHEN U.IdClasificacionUsuario IS NULL THEN 'No cuenta con clasificación' ELSE CU.NombreClasificacion END AS NombreClasificacion
		,FORMAT(U.FechaCreacion, 'dd/MM/yyyy HH:mm tt') AS FechaCreacion
	FROM
		Usuarios U
		LEFT JOIN ClasificacionUsuario CU ON CU.IdClasificacionUsuario = U.IdClasificacionUsuario
	WHERE 
		(U.Cedula = @Cedula OR @Cedula IS NULL)
END
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Kevin Nuñez>
-- Create date: <29/03/2025>
-- Description:	<SE CREA EL SP PARA ACTUALIZAR LOS USUARIOS>
-- =============================================
CREATE OR ALTER PROCEDURE [SpUpdateUsuarios]
	-- Add the parameters for the stored procedure here
	@Nombre VARCHAR(100),
    @Apellido VARCHAR(100),
    @Cedula VARCHAR(15),
    @CorreoElectronico VARCHAR(100),
    @Contrasena VARCHAR(300),
    @Puntaje INT,
	@IdUsuario INT
    
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
    -- Insert statements for procedure here
	IF(@Contrasena IS NULL)
		BEGIN
			UPDATE 
				Usuarios
			SET
				Nombre = @Nombre
				,Apellido = @Apellido
				,Puntaje = @Puntaje
			WHERE
				IdUsuario = @IdUsuario
		END
	ELSE
		BEGIN
			UPDATE 
				Usuarios
			SET
				Nombre = @Nombre
				,Apellido = @Apellido
				,Contrasena = @Contrasena
				,Puntaje = @Puntaje
			WHERE
				IdUsuario = @IdUsuario
		END

END
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Kevin Nuñez>
-- Create date: <29/03/2025>
-- Description:	<SE CREA EL SP PARA CREAR LOS USUARIOS>
-- =============================================
CREATE OR ALTER PROCEDURE [SpAddUsuarios]
	-- Add the parameters for the stored procedure here
	@Nombre VARCHAR(100),
    @Apellido VARCHAR(100),
    @Cedula VARCHAR(15),
    @CorreoElectronico VARCHAR(100),
    @Contrasena VARCHAR(300),
    @Puntaje INT
    
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
    -- Insert statements for procedure here
	INSERT INTO Usuarios (Nombre, Apellido, Cedula, CorreoElectronico, Contrasena, Puntaje, FechaCreacion)
	VALUES(@Nombre, @Apellido, @Cedula, @CorreoElectronico, @Contrasena, @Puntaje, GETDATE())

END
GO


SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Kevin Nuñez>
-- Create date: <29/03/2025>
-- Description:	<SE CREA EL SP PARA CREAR Y ACTUALIZAR LOS USUARIOS>
-- =============================================
CREATE OR ALTER PROCEDURE [SpIniciarSesion]
	-- Add the parameters for the stored procedure here
    @CorreoElectronico VARCHAR(100),
    @Contrasena VARCHAR(300)
    
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	DECLARE @Ingreso BIT = 0
	SET NOCOUNT ON;
    -- Insert statements for procedure here
	IF EXISTS(SELECT TOP (1) 1 FROM Usuarios WHERE CorreoElectronico = @CorreoElectronico AND Contrasena = @Contrasena)
		BEGIN
			SET @Ingreso = 1
			--SE TRAEN LOS DATOS NECESARIOS PARA LA VALIDACION DE LA CLASIFICACION DE LOS USUARIOS
			DECLARE @IdUsuario INT = (SELECT TOP (1) IdUsuario FROM Usuarios WHERE CorreoElectronico = @CorreoElectronico AND Contrasena = @Contrasena)
			DECLARE @FechaUltimoIngreso DATETIME = (SELECT TOP (1) FechaUltimoIngreso FROM Usuarios WHERE IdUsuario = @IdUsuario)
			DECLARE @IdClasificacionUsuario INT = NULL
			IF(@FechaUltimoIngreso IS NOT NULL)
				BEGIN
					--SE CALCULA LA DIFERENCIA DE HORAS ENTRE LAS DOS FECHAS
					DECLARE @DiferenciaHoras INT = (SELECT DATEDIFF(HOUR, @FechaUltimoIngreso, GETDATE()))
					SET @IdClasificacionUsuario = (SELECT IdClasificacionUsuario FROM ClasificacionUsuario WHERE (InicioHoras <= @DiferenciaHoras AND FinHoras > @DiferenciaHoras))

					UPDATE
						Usuarios
					SET
						IdClasificacionUsuario = @IdClasificacionUsuario
					WHERE
						IdUsuario = @IdUsuario
				END
			

			UPDATE
				Usuarios
			SET
				FechaUltimoIngreso = GETDATE()
			WHERE
				IdUsuario = @IdUsuario


			INSERT INTO HistorioIngresos (IdUsuario, IdClasificacionUsuario, FechaIngreso)
			VALUES (@IdUsuario, @IdClasificacionUsuario, GETDATE())

		END

	SELECT @Ingreso AS Ingreso,  @IdUsuario AS IdUsuario
END
GO


SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Kevin Nuñez>
-- Create date: <29/03/2025>
-- Description:	<SE CREA EL SP PARA ELIMINAR USUARIOS>
-- =============================================
CREATE OR ALTER PROCEDURE [SpDeleteUsuario]
	-- Add the parameters for the stored procedure here
	@IdUsuario INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here

	DELETE 
		HistorioIngresos
	WHERE
		IdUsuario = @IdUsuario

	DELETE 
		Usuarios 
	WHERE 
		IdUsuario = @IdUsuario 
END
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Kevin Nuñez>
-- Create date: <29/03/2025>
-- Description:	<SE CREA EL SP PARA ELIMINAR USUARIOS>
-- =============================================
CREATE OR ALTER PROCEDURE [SpRegistrarUsuario]
	-- Add the parameters for the stored procedure here
	@Nombre VARCHAR(100),
    @Apellido VARCHAR(100),
    @Cedula VARCHAR(15),
    @CorreoElectronico VARCHAR(100),
    @Contrasena VARCHAR(300),
    @Puntaje INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @Creado BIT = 0
    -- Insert statements for procedure here

	IF NOT EXISTS(SELECT * FROM Usuarios WHERE Cedula = @Cedula AND CorreoElectronico = @CorreoElectronico)
		BEGIN
			INSERT INTO Usuarios(Nombre, Apellido, Cedula, CorreoElectronico, Contrasena, Puntaje, FechaCreacion)
			VALUES (@Nombre, @Apellido, @Cedula, @CorreoElectronico, @Contrasena, @Puntaje, GETDATE())

			SET @Creado = 1
		END
	SELECT @Creado AS Creado
END
GO