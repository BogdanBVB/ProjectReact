package org.example.projectreact.repository;

import org.example.projectreact.models.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment,Integer> {

//    @Query("SELECT p FROM Payment p WHERE ((p.debitedAccountId = :accountId AND p.debitedAmount != '') OR (p.creditedAccountId = :accountId AND p.creditedAmount != '')) AND p.transactionDate >= :transactionDate AND p.customerId = :customerId")
//    List<Payment> findTransactionsByAccountAndDate(@Param("accountId") Integer accountId, @Param("transactionDate") LocalDate transactionDate, @Param("customerId") Integer customerId);

    @Query("SELECT p FROM Payment p WHERE ((p.debitedAccountId = :accountId AND p.debitedAmount != '') OR (p.creditedAccountId = :accountId AND p.creditedAmount != '')) AND p.customerId = :customerId")
    List<Payment> findByAccountId (@Param("accountId") Integer accountId,@Param("customerId") Integer customerId);
    @Query("SELECT p FROM Payment p WHERE ((p.debitedAccountId = :accountId OR p.creditedAccountId = :accountId) AND p.transactionDate >= :transactionDate AND p.customerId = :customerId)")
    List<Payment> findTransactionsByAccountAndDate(@Param("accountId") Integer accountId, @Param("transactionDate") LocalDate transactionDate, @Param("customerId") Integer customerId);

}

