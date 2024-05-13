package org.example.projectreact.repository;

import org.example.projectreact.models.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {
    List<Account> findByCustomerId(Integer customerId);
    List<Account> findByCustomerIdAndAccountType(Integer customerId, String accountType);

    Account findByCustomerIdAndId(Integer customerId, Integer accountId);

}
