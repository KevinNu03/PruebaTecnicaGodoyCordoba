namespace WebApiUsuarios.Models
{
    public class Usuario
    {
        public string? Nombre { get; set; }
        public string? Apellido { get; set; }
        public string? Cedula { get; set; }
        public string? CorreoElectronico { get; set; }
        public string? Contrasena { get; set; }
        public int Puntaje { get; set; }
    }
}
