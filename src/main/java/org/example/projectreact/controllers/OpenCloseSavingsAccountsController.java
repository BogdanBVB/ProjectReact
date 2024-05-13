package org.example.projectreact.controllers;

import jakarta.servlet.http.HttpSession;
import org.example.projectreact.DTO.AccountDTO;
import org.example.projectreact.models.Account;
import org.example.projectreact.services.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/savingsAccounts")
public class OpenCloseSavingsAccountsController {

    @Autowired
    private AccountService accountService;

    @GetMapping
    public ResponseEntity<?> getSavingsAccounts(HttpSession session) {
        Integer customerId = (Integer) session.getAttribute("customerId");
        if (customerId == null) {
            return ResponseEntity.badRequest().body("Customer ID is required");
        }
        List<Account> accounts = accountService.getSavingsAccountsByCustomerId(customerId);

        if (accounts.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(accounts);
    }

    @DeleteMapping("/{accountId}")
    public ResponseEntity<?> closeAccount(@PathVariable Integer accountId) throws Exception {
        accountService.closeSavingsAccount(accountId);
        return ResponseEntity.ok("Account closed successfully");
    }
    @PostMapping("/openNewSavingsAccount")
    public ResponseEntity<?> openAccount(@RequestBody AccountDTO accountDTO, HttpSession session) {

        Integer customerId = (Integer) session.getAttribute("customerId");
        if (customerId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not logged in.");
        }

        accountDTO.setAccountType("savings");
        accountService.createAccount(accountDTO,customerId);

        return ResponseEntity.ok("Account successfully created");

    }
}
