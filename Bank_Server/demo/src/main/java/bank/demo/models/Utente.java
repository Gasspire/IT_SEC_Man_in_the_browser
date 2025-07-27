package bank.demo.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="Utenti")
public class Utente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long iban;
    String nome;
    String cognome;
    Long saldo;


    public Utente(){

    }


    public long getIban() {
        return iban;
    }


    public void setIban(long iban) {
        this.iban = iban;
    }


    public String getNome() {
        return nome;
    }


    public void setNome(String nome) {
        this.nome = nome;
    }


    public String getCognome() {
        return cognome;
    }


    public void setCognome(String cognome) {
        this.cognome = cognome;
    }


    public Long getSaldo() {
        return saldo;
    }


    public void setSaldo(Long saldo) {
        this.saldo = saldo;
    }



    
}
