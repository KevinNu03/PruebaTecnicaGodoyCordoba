using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using DalUsuarios.Models;
using WebApiUsuarios.Models;

namespace WebApiUsuarios.Custom
{
    public class Utilidades
    {
        private readonly IConfiguration _Config;
        public Utilidades( IConfiguration Config)
        {
            _Config = Config;
        }


        public string EncriptarSHA256(string texto)
        {
            using (SHA256 sha256Hash = SHA256.Create())
            {
                //cumputar el hash
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(texto));

                //convertir el array de bytes a string
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }

                return builder.ToString();
            }
        }


        public string generarJWT(Login Model)
        {
            //Crear la informacion del usuario para el token
            var userClaims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier,Model.CorreoElectronico!.ToString()),
            };

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_Config["Jwt:key"]!));
            var credetials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);

            //crear detalle del token

            var jwtConfig = new JwtSecurityToken(

                claims: userClaims,
                expires: DateTime.UtcNow.AddHours(5),
                signingCredentials: credetials
            );

            return new JwtSecurityTokenHandler().WriteToken(jwtConfig);
        }
    }
}
