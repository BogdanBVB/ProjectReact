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
@RequestMapping("/api/currentAccounts")
public class OpenCloseCurrentAccountsController {

    @Autowired
    private AccountService accountService;

    @GetMapping
    public ResponseEntity<?> getCurrentAccounts(HttpSession session) {
        Integer customerId = (Integer) session.getAttribute("customerId");
        if (customerId == null) {
            return ResponseEntity.badRequest().body("Customer ID is required");
        }
        List<Account> accounts = accountService.getCurrentAccountsByCustomerId(customerId);

        if (accounts.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(accounts);
    }

    @DeleteMapping("/{accountId}")
    public ResponseEntity<?> closeAccount(@PathVariable Integer accountId) throws Exception {
        accountService.closeCurrentAccount(accountId);
        return ResponseEntity.ok("Account closed successfully");
    }
    @PostMapping("/openNewCurrentAccount")
    public ResponseEntity<?> openAccount(@RequestBody AccountDTO accountDTO, HttpSession session) {

            Integer customerId = (Integer) session.getAttribute("customerId");
            if (customerId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not logged in.");
            }

            accountDTO.setAccountType("current");
            accountService.createAccount(accountDTO,customerId);

            return ResponseEntity.ok("Account successfully created");

    }


}
