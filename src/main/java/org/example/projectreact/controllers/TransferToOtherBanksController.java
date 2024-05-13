package org.example.projectreact.controllers;

import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import org.example.projectreact.DTO.PaymentDTO;
import org.example.projectreact.models.Account;
import org.example.projectreact.services.AccountService;
import org.example.projectreact.services.ExchangeService;
import org.example.projectreact.services.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/otherBanksAccounts")
public class TransferToOtherBanksController {


    @Autowired
    private AccountService accountService;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private ExchangeService exchangeService;

    @GetMapping
    public ResponseEntity<?> getAllAccounts(HttpSession session) {
        Integer customerId = (Integer) session.getAttribute("customerId");
        if (customerId == null) {
            return ResponseEntity.badRequest().body("Customer ID is required");
        }
        List<Account> accounts = accountService.getAllAccountsByType(customerId, "current");

        if (accounts.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(accounts);
    }

    @PostMapping("/executeTransferToOtherBanksAccounts")
    @Transactional
    public ResponseEntity<?> executeTransferBetweenOwn(@RequestBody PaymentDTO paymentDTO, HttpSession session) {
        Integer customerId = (Integer) session.getAttribute("customerId");
        if (customerId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Customer ID is required");
        }

        Account debitedAccount = accountService.findAccountByCustomerIdAndAccountId(customerId, paymentDTO.getDebitedAccountId());
        if (debitedAccount == null) {
            return ResponseEntity.badRequest().body("One or both accounts not found");
        }

        if (Double.parseDouble(debitedAccount.getAccountBalance()) < paymentDTO.getAmount()) {
            return ResponseEntity.badRequest().body("Amount exceeds available balance");
        }

        double fxRate = 1;
        // Perform the transfer
        paymentService.createPaymentForGBROAndInterbankingTransfers(customerId, paymentDTO);

        // Assuming this method updates the account balances
        paymentService.updateAccountsForGBROPayments(debitedAccount, paymentDTO.getAmount());

        return ResponseEntity.ok("Transfer completed successfully");

    }
}
