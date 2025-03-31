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
    [Authorize]
    [ApiController]
    public class UsuarioController : Controller
    {
        private readonly PruebaTecnicaContext _context;
        private readonly Utilidades _utilidades;

        public UsuarioController(PruebaTecnicaContext context, Utilidades utilidades)
        {
            _context = context;
            _utilidades = utilidades;
        }

        //Obtiene lista de usuarios o usuario si se envia en el filtro
        [HttpGet("GetUsuarios/{Cedula}")]
        [ProducesResponseType(typeof(SpGetUsuariosResult), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ResponseHttp), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.Unauthorized)]
        public async Task<ActionResult> GetUsuarios(string Cedula)
        {
            try
            {
                var usuarioService = new UsuarioService(_context, _utilidades);
                var listUsuarios = await usuarioService.GetUsuarios(Cedula);

                return StatusCode(StatusCodes.Status200OK, new { value = listUsuarios });
            }
            catch (Exception ex)
            {
                var responseHttp = ExceptionHelperServices.HandleException(ex);
                return BadRequest(responseHttp);
            }
        }

        //Se actualiza la data del usuario
        [HttpPost("UpdateUsuarios")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ResponseHttp), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.Unauthorized)]
        public async Task<ActionResult> UpdateUsuarios([FromBody] UpdateUsuario Model)
        {
            try
            {
                var modeloUsuario = new UpdateUsuario
                {
                    Nombre = Model.Nombre!.ToUpper(),
                    Apellido = Model.Apellido!.ToUpper(),
                    Cedula = Model.Cedula!.ToUpper(),
                    CorreoElectronico = Model.CorreoElectronico!.ToUpper(),
                    Contrasena = Model.Contrasena == "null"? null : _utilidades.EncriptarSHA256(Model.Contrasena!),
                    Puntaje = Model.Puntaje,
                    IdUsuario = Model.IdUsuario
                };


                var usuarioService = new UsuarioService(_context, _utilidades);
                var Response = await usuarioService.UpdateUsuarios(modeloUsuario);

                return StatusCode(StatusCodes.Status200OK, new { isSuccess = true, message = Response });
            }
            catch (Exception ex)
            {
                var responseHttp = ExceptionHelperServices.HandleException(ex);
                return BadRequest(responseHttp);
            }
        }

        //Se actualiza la data del usuario
        [HttpPost("AddUsuarios")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ResponseHttp), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.Unauthorized)]
        public async Task<ActionResult> AddUsuarios([FromBody] Usuario Model)
        {
            try
            {
                var modeloUsuario = new Usuario
                {
                    Nombre = Model.Nombre!.ToUpper(),
                    Apellido = Model.Apellido!.ToUpper(),
                    Cedula = Model.Cedula!.ToUpper(),
                    CorreoElectronico = Model.CorreoElectronico!.ToUpper(),
                    Contrasena = _utilidades.EncriptarSHA256(Model.Contrasena!),
                    Puntaje = Model.Puntaje
                };


                var usuarioService = new UsuarioService(_context, _utilidades);
                var listUsuario = await usuarioService.GetUsuarios(modeloUsuario.Cedula);
                if (listUsuario.Count > 0)
                {
                    return StatusCode(StatusCodes.Status200OK, new { isSuccess = false, message = "El usuario ya se encuentra registrado" });
                }
                else
                {
                    var Response = await usuarioService.AddUsuarios(modeloUsuario);

                    return StatusCode(StatusCodes.Status200OK, new { isSuccess = true, message = Response });
                }
            }
            catch (Exception ex)
            {
                var responseHttp = ExceptionHelperServices.HandleException(ex);
                return BadRequest(responseHttp);
            }
        }

        //realiza un delete del usuario en base de datos
        [HttpDelete("DeleteUsuario/{IdUsuario}")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ResponseHttp), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.Unauthorized)]
        public async Task<ActionResult> DeleteUsuario(int IdUsuario)
        {
            try
            {
                var usuarioService = new UsuarioService(_context, _utilidades);
                var Response = await usuarioService.DeleteUsuario(IdUsuario);

                return StatusCode(StatusCodes.Status200OK, new { isSuccess = true, message = Response });
            }
            catch (Exception ex)
            {
                var responseHttp = ExceptionHelperServices.HandleException(ex);
                return BadRequest(responseHttp);
            }
        }
    }
}
