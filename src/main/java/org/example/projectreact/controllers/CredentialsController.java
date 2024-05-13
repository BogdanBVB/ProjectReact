package org.example.projectreact.controllers;

import jakarta.servlet.http.HttpSession;
import org.example.projectreact.DTO.CredentialsDTO;
import org.example.projectreact.DTO.CustomerDTO;
import org.example.projectreact.models.Customer;
import org.example.projectreact.services.CredentialsService;
import org.example.projectreact.services.CustomerService;
import org.example.projectreact.services.ExchangeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDate;
import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/login")
public class CredentialsController {

    @Autowired
    private CredentialsService credentialsService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private ExchangeService exchangeService;

    @PostMapping
    public ResponseEntity<String> loginCustomer(@RequestBody CredentialsDTO credentialsDTO, HttpSession session, WebRequest webRequest) {

        boolean isValid = credentialsService.verifyCredentials(credentialsDTO.getUsername(), credentialsDTO.getPassword());

        if (isValid) {
            Integer customerId = (Integer)customerService.getCustomerIdByUsername(credentialsDTO.getUsername());
            session.setAttribute("customerId", customerId);
            session.setAttribute("customerName", customerService.getCustomerName(customerId));
            return ResponseEntity.ok("Login successful");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
    }


}
