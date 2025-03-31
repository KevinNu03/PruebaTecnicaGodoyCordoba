using DalUsuarios.Models;
using WebApiUsuarios.Custom;
using WebApiUsuarios.Models;

namespace WebApiUsuarios.Services
{
    public class UsuarioService
    {
        private readonly PruebaTecnicaContext _context;
        private readonly Utilidades _utilidades;

        public UsuarioService(PruebaTecnicaContext context, Utilidades utilidades)
        {
            _context = context;
            _utilidades = utilidades;
        }

        public async Task<List<SpGetUsuariosResult>> GetUsuarios(string Cedula)
        {
            try
            {
                var listUsuarios = await this._context.GetProcedures().SpGetUsuariosAsync(Cedula == "null" || Cedula == null ? null : Cedula);

                return listUsuarios;
            }
            catch
            {
                throw;
            }
        }

        public async Task<string> UpdateUsuarios(UpdateUsuario Usuario)
        {
            try
            {
                await this._context.GetProcedures().SpUpdateUsuariosAsync(Usuario.Nombre,
                                                                                Usuario.Apellido,
                                                                                Usuario.Cedula,
                                                                                Usuario.CorreoElectronico,
                                                                                Usuario.Contrasena,
                                                                                Usuario.Puntaje,
                                                                                Usuario.IdUsuario);

                return "Usuario Actualizado";
            }
            catch
            {
                throw;
            }
        }

        public async Task<string> AddUsuarios(Usuario Usuario)
        {
            try
            {
                await this._context.GetProcedures().SpAddUsuariosAsync(Usuario.Nombre,
                                                                                Usuario.Apellido,
                                                                                Usuario.Cedula,
                                                                                Usuario.CorreoElectronico,
                                                                                Usuario.Contrasena,
                                                                                Usuario.Puntaje);

                return "Usuario Creado";
            }
            catch
            {
                throw;
            }
        }

        public async Task<string> DeleteUsuario(int IdUsuario)
        {
            try
            {
                await this._context.GetProcedures().SpDeleteUsuarioAsync(IdUsuario);

                return "Usuario Eliminado Correctamente.";
            }
            catch
            {
                throw;
            }
        }
    }
}
