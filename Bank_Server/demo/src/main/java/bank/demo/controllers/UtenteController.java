package bank.demo.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import bank.demo.data.UtenteRepository;
import bank.demo.models.Utente;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;



@Controller
@RequestMapping("/utente")
public class UtenteController {
    UtenteRepository repo;

    public UtenteController(UtenteRepository repo){
        this.repo = repo;
    }

    @GetMapping("/lista")
    public String MostraUtenti(Model model) {
        model.addAttribute("utenti", repo.findAll());
        return "utente/list";
    }
    
    @GetMapping("/crea")
    public String creaUtente(Model model) {
        model.addAttribute("utente", new Utente());
        return "utente/edit";
    }
    
    @PostMapping("/save")
    public String SalvaUtente(@ModelAttribute Utente a, Model model) {
        repo.save(a);
        return "redirect:/utente/lista";
    }




}
