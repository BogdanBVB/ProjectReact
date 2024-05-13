package org.example.projectreact.services;
import org.example.projectreact.DTO.AccountDTO;
import org.example.projectreact.models.Account;
import org.example.projectreact.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;


    public void createAccount (AccountDTO accountDTO, Integer customerId) {

        Account account = new Account();

        account.setCustomerId(customerId);
        account.setAccountType(accountDTO.getAccountType());
        account.setCurrency(accountDTO.getCurrency());
        account.setIban(generateIban(accountDTO.getCurrency()));
        account.setAccountBalance("1000");
        account.setOpeningDate(LocalDate.now());

        accountRepository.save(account);
    }

    private String generateIban(String currency) {
        Random random = new Random();
        StringBuilder sb = new StringBuilder("RO");
        int checkDigits = random.nextInt(10,99);
        String bankId = "GBRO";
        sb.append(checkDigits).append(bankId).append(random.nextInt(9));
        char a = (char) ('A' + random.nextInt(26));
        sb.append(a);
        for(int i = 0; i < 13; i++) {
            sb.append(random.nextInt(9));
        }
        sb.append(currency);
        return sb.toString()   ;
    }

    public List<Account> getAllAccountsByCustomerId(Integer customerId) {
        return accountRepository.findByCustomerId(customerId);
    }
    public List<Account> getAllAccountsByType(Integer customerId, String accountType) {
        return accountRepository.findByCustomerIdAndAccountType(customerId, accountType);
    }

    public Optional<Account> findAccountById(Integer accountId) {
        return accountRepository.findById(accountId);
    }

    public Account findAccountByCustomerIdAndAccountId(Integer customerId, Integer accountId) {
        return accountRepository.findByCustomerIdAndId(customerId,accountId);
    }

    public List<Account> getCurrentAccountsByCustomerId(Integer customerId) {
       return accountRepository.findByCustomerIdAndAccountType(customerId, "current");

    }

    public void closeCurrentAccount(Integer accountId) throws Exception{
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new Exception("Account not found"));

        // Check if this is the last account
        int count = accountRepository.findByCustomerIdAndAccountType(account.getCustomerId(),"current").size();

        if (count <= 1) {
            throw new Exception("Cannot close the last account.");
        }

        accountRepository.delete(account);
    }

    public void closeSavingsAccount(Integer accountId) throws Exception{
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new Exception("Account not found"));
        accountRepository.delete(account);
    }

      public List<Account> getSavingsAccountsByCustomerId(Integer customerId) {
        return accountRepository.findByCustomerIdAndAccountType(customerId, "savings");
    }
}
