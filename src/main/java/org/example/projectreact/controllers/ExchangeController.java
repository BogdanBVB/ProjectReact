package org.example.projectreact.controllers;

import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import org.example.projectreact.DTO.ExchangeRatesDTO;
import org.example.projectreact.DTO.PaymentDTO;
import org.example.projectreact.models.Account;
import org.example.projectreact.services.AccountService;
import org.example.projectreact.services.ExchangeService;
import org.example.projectreact.services.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/exchange")
public class ExchangeController {

    @Autowired
    private ExchangeService exchangeService;

    @Autowired
    private AccountService accountService;

    @Autowired
    private PaymentService paymentService;



    @GetMapping
    public ResponseEntity<ExchangeRatesDTO> getRates(@RequestParam String base, HttpSession session) {
        Map<String, Double> rates = exchangeService.fetchExchangeRates(base, session);
        ExchangeRatesDTO dto = new ExchangeRatesDTO();
        dto.setRates(rates);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/executeExchange")
    @Transactional
    public ResponseEntity<?> executeTransferBetweenOwn(@RequestBody PaymentDTO paymentDTO, HttpSession session) {
        Integer customerId = (Integer) session.getAttribute("customerId");
        if (customerId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Customer ID is required");
        }

        Account debitedAccount = accountService.findAccountByCustomerIdAndAccountId(customerId, paymentDTO.getDebitedAccountId());
        Account creditedAccount = accountService.findAccountByCustomerIdAndAccountId(customerId, paymentDTO.getCreditedAccountId());

        if (debitedAccount == null || creditedAccount == null) {
            return ResponseEntity.badRequest().body("One or both accounts not found");
        }

        if (Double.parseDouble(debitedAccount.getAccountBalance()) < paymentDTO.getAmount()) {
            return ResponseEntity.badRequest().body("Amount exceeds available balance");
        }

        double fxRate = exchangeService.fxBetweenAccounts(debitedAccount.getCurrency(), creditedAccount.getCurrency(), session);

        paymentDTO.setPaymentDetails("FX Exchange");
        paymentDTO.setAmount(paymentDTO.getAmount() * fxRate);
        paymentService.createPaymentOwnAccounts(customerId, paymentDTO, fxRate);

        // Assuming this method updates the account balances
        paymentService.updateAccounts(debitedAccount, creditedAccount, paymentDTO.getAmount(),fxRate );

        return ResponseEntity.ok("Transfer completed successfully");
    }
}
