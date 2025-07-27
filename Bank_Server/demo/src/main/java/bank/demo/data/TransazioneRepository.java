package bank.demo.data;

import org.springframework.data.jpa.repository.JpaRepository;

import bank.demo.models.Transazione;

public interface TransazioneRepository extends JpaRepository<Transazione, Long> {

}
