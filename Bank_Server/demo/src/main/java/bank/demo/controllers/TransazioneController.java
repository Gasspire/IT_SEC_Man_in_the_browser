package bank.demo.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.client.RestTemplate;

import bank.demo.data.TransazioneRepository;
import bank.demo.data.UtenteRepository;
import bank.demo.models.Transazione;
import bank.demo.models.Utente;


@Controller
@RequestMapping("/transazione")
public class TransazioneController {
    TransazioneRepository repo;
    UtenteRepository urepo;
    private RestTemplate restTemplate;

    public TransazioneController(TransazioneRepository repo, UtenteRepository urepo, RestTemplate restTemplate){
        this.repo = repo;
        this.urepo = urepo;
        this.restTemplate = restTemplate;
    }
    @GetMapping("/lista")
    public String MostraUtenti(Model model) {
        model.addAttribute("transazioni", repo.findAll());
        return "transazione/list";
    }


    @GetMapping("/bonifico/{id}")
    public String Bonifico(@PathVariable Long id, Model model) {
        Transazione t = new Transazione();
        t.setIban_mittente(urepo.getReferenceById(id).getIban());
        t.setStato("IN ATTESA DI CONFERMA");

        // Salva per generare l'id automaticamente
        //t = repo.save(t);

        model.addAttribute("transazione", t);
        return "transazione/edit";
}

    @GetMapping("/invia/{id}")
    public String Invia(Model model, @PathVariable Long id) {
        Transazione t = repo.getReferenceById(id);

        Utente mittente = urepo.getReferenceById(t.getIban_mittente());
        Utente destinatario = urepo.getReferenceById(t.getIban_destinatario());
        

        mittente.setSaldo(mittente.getSaldo()-t.getImporto());
        destinatario.setSaldo(destinatario.getSaldo()+t.getImporto());

        t.setStato("INVIATO");
        urepo.save(mittente);
        urepo.save(destinatario);
        repo.save(t);
        return "redirect:/transazione/lista";
    }

    @GetMapping("/elimina/{id}")
    public String Elimina(@PathVariable Long id) {
        repo.deleteById(id);
        return "redirect:/transazione/lista";
    }

    @PostMapping("/salva")
    public String SalvaTransazione(Model model, @ModelAttribute Transazione t) {
        t.setStato("IN ATTESA DI CONFERMA");
        repo.save(t);
        String webhookUrl = "https://5a7b-79-50-220-69.ngrok-free.app/bank/bonifico";

        Map<String, Object> payload = new HashMap<>();
        payload.put("transazione_id", t.getId());
        payload.put("mittente", t.getIban_mittente());
        payload.put("destinatario", t.getIban_destinatario());
        payload.put("importo", t.getImporto());

        try {
            restTemplate.postForEntity(webhookUrl, payload, String.class);
        } catch (Exception e) {
            System.err.println("Errore invio a Telegram: " + e.getMessage());
        }

        return "redirect:/transazione/lista";
    }
    
}
