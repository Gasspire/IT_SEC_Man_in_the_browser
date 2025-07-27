package bank.demo.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="transazioni")
public class Transazione {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    
    Long iban_mittente;
    Long iban_destinatario;

    Long importo;
    String stato;

    
    public Transazione(){
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getIban_mittente() {
        return iban_mittente;
    }

    public void setIban_mittente(Long iban_mittente) {
        this.iban_mittente = iban_mittente;
    }

    public Long getIban_destinatario() {
        return iban_destinatario;
    }

    public void setIban_destinatario(Long iban_destinatario) {
        this.iban_destinatario = iban_destinatario;
    }

    public Long getImporto() {
        return importo;
    }

    public void setImporto(Long importo) {
        this.importo = importo;
    }

    public String getStato() {
        return stato;
    }

    public void setStato(String stato) {
        this.stato = stato;
    }

    
}
