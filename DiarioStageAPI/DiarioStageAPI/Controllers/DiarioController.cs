using Microsoft.AspNetCore.Mvc;

namespace DiarioStageAPI.Controllers
{
    [ApiController]
    [Route("api")]
    public class DiarioController : ControllerBase
    {
        private readonly JsonStorageService _storageService;

        public DiarioController(JsonStorageService storageService)
        {
            _storageService = storageService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest richiesta)
        {
            string usernameCorretto = "Admin";
            string passwordCorretta = "Pomodoro";

            // Controlla se i dati inseriti nel sito corrispondono a quelli corretti
            if (richiesta.Username == usernameCorretto && richiesta.Password == passwordCorretta)
            {
                // Se sono giusti, dà il via libera (Status 200 OK)
                return Ok(new { autorizzato = true });
            }

            // Se sono sbagliati, restituisce un errore di blocco (Status 401 Unauthorized)
            return Unauthorized(new { messaggio = "Username o Password non validi!" });
        }

        [HttpGet("giornate")]
        public IActionResult GetGiornate()
        {
            var giornate = _storageService.OttieniTutteLeGiornate();
            return Ok(giornate);
        }

        [HttpPost("giornate/salva")]
        public IActionResult Salva([FromBody] Giornata giornata)
        {
            _storageService.SalvaOAggiornaGiornata(giornata);
            return Ok(new { messaggio = "Salvataggio completato nel file JSON!" });
        }

        [HttpDelete("giornate/elimina/{id}")]
        public IActionResult Elimina(int id)
        {
            _storageService.EliminaGiornata(id);
            return Ok(new { messaggio = "Elemento rimosso dal file JSON!" });
        }
    }
}
