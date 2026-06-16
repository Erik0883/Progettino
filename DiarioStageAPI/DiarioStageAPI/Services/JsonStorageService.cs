using System.IO;
using System.Text.Json;
using System.Collections.Generic;
using System.Linq;

namespace DiarioStageAPI
{
    public class JsonStorageService
    {
        // Il file verrà salvato nella cartella principale del server backend
        private readonly string _filePath = "diario.json";

        // Legge tutto il file JSON e lo trasforma in una lista C#
        public List<Giornata> OttieniTutteLeGiornate()
        {
            if (!File.Exists(_filePath))
                return new List<Giornata>();

            string jsonTesto = File.ReadAllText(_filePath);

            if (string.IsNullOrWhiteSpace(jsonTesto))
                return new List<Giornata>();

            return JsonSerializer.Deserialize<List<Giornata>>(jsonTesto) ?? new List<Giornata>();
        }

        // Inserisce una nuova giornata o modifica una esistente
        public void SalvaOAggiornaGiornata(Giornata nuovaGiornata)
        {
            var lista = OttieniTutteLeGiornate();

            if (nuovaGiornata.id == 0)
            {
                // Auto-incremento dell'ID (trova il massimo e fa +1)
                nuovaGiornata.id = lista.Count > 0 ? lista.Max(g => g.id) + 1 : 1;
                lista.Add(nuovaGiornata);
            }
            else
            {
                // Modifica
                var esistente = lista.FirstOrDefault(g => g.id == nuovaGiornata.id);
                if (esistente != null)
                {
                    esistente.data_giorno = nuovaGiornata.data_giorno;
                    esistente.ore_lavorate = nuovaGiornata.ore_lavorate;
                    esistente.caffe_presi = nuovaGiornata.caffe_presi;
                    esistente.bug_riscontrati = nuovaGiornata.bug_riscontrati;
                    esistente.bug_dettaglio = nuovaGiornata.bug_dettaglio;
                    esistente.descrizione_attivita = nuovaGiornata.descrizione_attivita;
                    esistente.fase_progetto = nuovaGiornata.fase_progetto;
                }
            }

            // Salva la lista aggiornata sul file di testo scrivendo in modo ordinato
            string jsonAggiornato = JsonSerializer.Serialize(lista, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(_filePath, jsonAggiornato);
        }

        // Elimina una giornata dal file JSON
        public void EliminaGiornata(int id)
        {
            var lista = OttieniTutteLeGiornate();
            var elemento = lista.FirstOrDefault(g => g.id == id);
            if (elemento != null)
            {
                lista.Remove(elemento);
                string jsonAggiornato = JsonSerializer.Serialize(lista, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(_filePath, jsonAggiornato);
            }
        }
    }
}