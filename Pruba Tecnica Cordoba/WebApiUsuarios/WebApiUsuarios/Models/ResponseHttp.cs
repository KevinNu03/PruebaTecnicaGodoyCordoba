namespace WebApiUsuarios.Models
{
    public class ResponseHttp
    {
        public string RespuestaHttp { get; set; }
        public int EstatusHttp { get; set; }

        public ResponseHttp()
        {
            RespuestaHttp = "default value";
        }
    }
}
