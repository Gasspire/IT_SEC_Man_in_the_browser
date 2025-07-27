package bank.demo.data;

import org.springframework.data.jpa.repository.JpaRepository;

import bank.demo.models.Utente;

public interface UtenteRepository extends JpaRepository<Utente, Long> {
    
}
