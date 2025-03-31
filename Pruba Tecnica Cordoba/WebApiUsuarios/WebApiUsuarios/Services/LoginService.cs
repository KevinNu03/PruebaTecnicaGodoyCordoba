using DalUsuarios.Models;
using WebApiUsuarios.Custom;
using WebApiUsuarios.Models;

namespace WebApiUsuarios.Services
{
    public class LoginService
    {
        private readonly PruebaTecnicaContext _context;
        private readonly Utilidades _utilidades;

        public LoginService(PruebaTecnicaContext context, Utilidades utilidades)
        {
            _context = context;
            _utilidades = utilidades;
        }

        public async Task<SpIniciarSesionResult> IniciarSesion(Login UsuarioLogin)
        {
            try
            {
                var InicioSesion = (await this._context.GetProcedures().SpIniciarSesionAsync(UsuarioLogin.CorreoElectronico, UsuarioLogin.Contrasena)).FirstOrDefault();

                return InicioSesion!;
            }
            catch
            {
                throw;
            }
        }

        public async Task<SpRegistrarUsuarioResult> Registrarse(Usuario Usuario)
        {
            try
            {
                var Registro = (await this._context.GetProcedures().SpRegistrarUsuarioAsync(Usuario.Nombre,
                                                                                                    Usuario.Apellido,
                                                                                                    Usuario.Cedula,
                                                                                                    Usuario.CorreoElectronico,
                                                                                                    Usuario.Contrasena,
                                                                                                    Usuario.Puntaje)).FirstOrDefault();

                return Registro!;
            }
            catch
            {
                throw;
            }
        }

    }
}
