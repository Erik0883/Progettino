
namespace DiarioStageAPI
{
    public class Giornata
    {
        public int id { get; set; }
        public string data_giorno { get; set; } = string.Empty;
        public decimal ore_lavorate { get; set; }
        public int caffe_presi { get; set; }
        public int bug_riscontrati { get; set; }
        public string? bug_dettaglio { get; set; }
        public string descrizione_attivita { get; set; } = string.Empty;
        public string fase_progetto { get; set; } = string.Empty;
    }

    public class LoginRequest
    {
        // Lettere maiuscole corrispondenti alla chiamata nel controller
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}