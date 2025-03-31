using System.Net;
using WebApiUsuarios.Models;

namespace WebApiUsuarios.Services
{
    public class ExceptionHelperServices
    {
        public static ResponseHttp HandleException(Exception ex)
        {
            //Detecta errores de base de datos(SQL)
            if (ex.Source != null && ex.Source.Contains("SQL", StringComparison.OrdinalIgnoreCase) ||
                ex.Message.Contains("SQL", StringComparison.OrdinalIgnoreCase))
            {
                return new ResponseHttp { EstatusHttp = (int)HttpStatusCode.BadRequest, RespuestaHttp = "Ha ocurrido una falla en la recopilación de la información." };
            }

            //otros tipos de errores comunes
            if (ex is ArgumentNullException)
            {
                return new ResponseHttp { EstatusHttp = (int)HttpStatusCode.BadRequest, RespuestaHttp = "Uno o más parámetros son nulos." };
            }

            if (ex is ArgumentException)
            {
                return new ResponseHttp { EstatusHttp = (int)HttpStatusCode.BadRequest, RespuestaHttp = "Argumento Inválido." };
            }

            return new ResponseHttp { EstatusHttp = (int)HttpStatusCode.BadRequest, RespuestaHttp = ex.Message };
        }
    }
}
