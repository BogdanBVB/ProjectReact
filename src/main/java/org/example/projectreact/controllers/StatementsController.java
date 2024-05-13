package org.example.projectreact.controllers;

import jakarta.servlet.http.HttpSession;
import org.example.projectreact.models.Payment;
import org.example.projectreact.services.PaymentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/statements")
public class StatementsController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping("/{accountId}")
    public ResponseEntity<?> showStatement (HttpSession session,@PathVariable Integer accountId,
                                            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
        Integer customerId = (Integer) session.getAttribute("customerId");
        if (customerId == null) {
            return ResponseEntity.badRequest().body("Customer ID is required");
        }
        System.out.println(accountId + "  Acount ID");
        System.out.println(startDate + "  StartDate");
        System.out.println(customerId + "  customerid");

        List<Payment> statements = paymentService.findAllPaymentsForAnAccount(accountId, startDate, customerId);
        System.out.println(statements.toString());

        if (statements.isEmpty()) {
            return ResponseEntity.noContent().build(); // No statements found
        }
        return ResponseEntity.ok(statements);
    }
}
