using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using System;

namespace DiarioStageAPI.Controllers
{
    [ApiController]
    [Route("api")]
    public class DiarioController : ControllerBase
    {
        private readonly DatabaseService _dbService;

        public DiarioController(DatabaseService dbService)
        {
            _dbService = dbService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest richiesta)
        {
            if (richiesta == null || string.IsNullOrEmpty(richiesta.Username) || string.IsNullOrEmpty(richiesta.Password))
                return BadRequest(new { autorizzato = false, messaggio = "Dati incompleti." });

            if (_dbService.AutenticaUtente(richiesta.Username, richiesta.Password))
                return Ok(new { autorizzato = true, utente = richiesta.Username });

            return Unauthorized(new { autorizzato = false, messaggio = "Credenziali SQL Server errate." });
        }

        [HttpGet("giornate")]
        public IActionResult GetGiornate()
        {
            if (!Request.Headers.TryGetValue("X-DB-User", out var user) || !Request.Headers.TryGetValue("X-DB-Pass", out var pass))
                return Unauthorized("Sessione mancante.");

            return Ok(_dbService.OttieniTutteLeGiornate(user.ToString(), pass.ToString()));
        }

        [HttpPost("giornate/salva")]
        public IActionResult Salva([FromBody] Giornata g)
        {
            if (!Request.Headers.TryGetValue("X-DB-User", out var user) || !Request.Headers.TryGetValue("X-DB-Pass", out var pass))
                return Unauthorized("Sessione mancante.");

            try
            {
                _dbService.SalvaOAggiornaGiornata(g, user.ToString(), pass.ToString());
                return Ok(new { successo = true, messaggio = "Salvataggio completato con successo!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete("giornate/elimina/{id}")]
        public IActionResult Elimina(int id)
        {
            if (!Request.Headers.TryGetValue("X-DB-User", out var user) || !Request.Headers.TryGetValue("X-DB-Pass", out var pass))
                return Unauthorized("Sessione mancante.");

            try
            {
                _dbService.EliminaGiornata(id, user.ToString(), pass.ToString());
                return Ok(new { successo = true, messaggio = "Giornata rimossa con successo." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}