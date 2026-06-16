
using System;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;

namespace DiarioStageAPI
{
    public class DatabaseService
    {
        private string GetConnectionString(string user, string pass)
        {
            return $"Server=DEV73\\DEV73;Database=DiarioStageDB;User Id=oripan.net;Password=xab\\85151;TrustServerCertificate=True;";
        }

        public bool AutenticaUtente(string user, string pass)
        {
            using (var conn = new SqlConnection(GetConnectionString(user, pass)))
            {
                try { conn.Open(); return true; }
                catch { return false; }
            }
        }

        public List<Giornata> OttieniTutteLeGiornate(string user, string pass)
        {
            var lista = new List<Giornata>();
            using (var conn = new SqlConnection(GetConnectionString(user, pass)))
            {
                string sql = "SELECT id, data_giorno, ore_lavorate, caffe_presi, bug_riscontrati, bug_dettaglio, descrizione_attivita, fase_progetto FROM Giornate ORDER BY data_giorno DESC";
                using (var cmd = new SqlCommand(sql, conn))
                {
                    conn.Open();
                    using (var rdr = cmd.ExecuteReader())
                    {
                        while (rdr.Read())
                        {
                            lista.Add(new Giornata
                            {
                                id = Convert.ToInt32(rdr["id"]),
                                data_giorno = Convert.ToDateTime(rdr["data_giorno"]).ToString("yyyy-MM-dd"),
                                ore_lavorate = Convert.ToDecimal(rdr["ore_lavorate"]),
                                caffe_presi = Convert.ToInt32(rdr["caffe_presi"]),
                                bug_riscontrati = Convert.ToInt32(rdr["bug_riscontrati"]),
                                bug_dettaglio = rdr["bug_dettaglio"] != DBNull.Value ? rdr["bug_dettaglio"].ToString() : string.Empty,
                                descrizione_attivita = rdr["descrizione_attivita"].ToString() ?? string.Empty,
                                fase_progetto = rdr["fase_progetto"].ToString() ?? string.Empty
                            });
                        }
                    }
                }
            }
            return lista;
        }

        // Nome esatto richiesto dall'errore CS1061 del controller
        public void SalvaOAggiornaGiornata(Giornata g, string user, string pass)
        {
            using (var conn = new SqlConnection(GetConnectionString(user, pass)))
            {
                conn.Open();
                string sql = g.id == 0
                    ? "INSERT INTO Giornate (data_giorno, ore_lavorate, caffe_presi, bug_riscontrati, bug_dettaglio, descrizione_attivita, fase_progetto) VALUES (@data, @ore, @caffe, @bug, @dett, @desc, @fase)"
                    : "UPDATE Giornate SET data_giorno=@data, ore_lavorate=@ore, caffe_presi=@caffe, bug_riscontrati=@bug, bug_dettaglio=@dett, descrizione_attivita=@desc, fase_progetto=@fase WHERE id=@id";

                using (var cmd = new SqlCommand(sql, conn))
                {
                    if (g.id > 0) cmd.Parameters.AddWithValue("@id", g.id);
                    cmd.Parameters.AddWithValue("@data", DateTime.Parse(g.data_giorno));
                    cmd.Parameters.AddWithValue("@ore", g.ore_lavorate);
                    cmd.Parameters.AddWithValue("@caffe", g.caffe_presi);
                    cmd.Parameters.AddWithValue("@bug", g.bug_riscontrati);
                    cmd.Parameters.AddWithValue("@dett", (object?)g.bug_dettaglio ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@desc", g.descrizione_attivita);
                    cmd.Parameters.AddWithValue("@fase", g.fase_progetto);
                    cmd.ExecuteNonQuery();
                }
            }
        }

        // Nome esatto richiesto dall'errore CS1061 del controller
        public void EliminaGiornata(int id, string user, string pass)
        {
            using (var conn = new SqlConnection(GetConnectionString(user, pass)))
            {
                string sql = "DELETE FROM Giornate WHERE id = @id";
                using (var cmd = new SqlCommand(sql, conn))
                {
                    cmd.Parameters.AddWithValue("@id", id);
                    conn.Open();
                    cmd.ExecuteNonQuery();
                }
            }
        }
    }
}