using System.Net;
using DalUsuarios.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApiUsuarios.Custom;
using WebApiUsuarios.Models;
using WebApiUsuarios.Services;

namespace WebApiUsuarios.Controllers
{
    [Route("api/[controller]")]
    [AllowAnonymous]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly PruebaTecnicaContext _context;
        private readonly Utilidades _utilidades;

        public LoginController(PruebaTecnicaContext context, Utilidades utilidades)
        {
            _context = context;
            _utilidades = utilidades;
        }

        //se realiza el login del usuario con correo y contraseña
        [HttpPost("Login")]
        [ProducesResponseType(typeof(SpIniciarSesionResult), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ResponseHttp), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.Unauthorized)]
        public async Task<ActionResult> IniciarSesion([FromBody]Login Model)
        {
            try
            {
                var loginUsuario = new Login
                {
                    CorreoElectronico = Model.CorreoElectronico!.ToUpper(),
                    Contrasena = _utilidades.EncriptarSHA256(Model.Contrasena!)
                };

                var loginService = new LoginService(_context, _utilidades);
                var listUsuarios = await loginService.IniciarSesion(loginUsuario);

                if (!(bool)listUsuarios.Ingreso!)
                {
                    return StatusCode(StatusCodes.Status200OK, new { isSuccess = false, token = "", message = "Las credenciales no coinciden." });
                }
                else
                {
                    return StatusCode(StatusCodes.Status200OK, new { isSuccess = true, token = _utilidades.generarJWT(loginUsuario), message = "Bienvenid@" });
                }
            }
            catch (Exception ex)
            {
                var responseHttp = ExceptionHelperServices.HandleException(ex);
                return BadRequest(responseHttp);
            }
        }

        //Se realiza el registro del usuario
        [HttpPost("Registrarse")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ResponseHttp), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.Unauthorized)]
        public async Task<IActionResult> Registrarse(Usuario Model)
        {
            try
            {
                var modelousuario = new Usuario
                {
                    Nombre = Model.Nombre!.ToUpper(),
                    Apellido = Model.Apellido!.ToUpper(), 
                    Cedula = Model.Cedula!.ToUpper(),
                    CorreoElectronico = Model.CorreoElectronico!.ToUpper(),
                    Contrasena = _utilidades.EncriptarSHA256(Model.Contrasena!),
                    Puntaje = Model.Puntaje
                };

                var loginService = new LoginService(_context, _utilidades);
                var Registro = await loginService.Registrarse(modelousuario);

                if ((bool)Registro.Creado!)
                {
                    return StatusCode(StatusCodes.Status200OK, new {isSuccess = true , message = "Usuario creado Correctamente."});
                }
                else
                {
                    return StatusCode(StatusCodes.Status200OK, new { isSuccess = false, message = "El usuario ya se encuentra creado." });
                }
            }
            catch (Exception ex) 
            {
                var responseHttp = ExceptionHelperServices.HandleException(ex);
                return BadRequest(responseHttp);
            }
            

        }
    }
}
