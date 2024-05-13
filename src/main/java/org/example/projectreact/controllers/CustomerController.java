package org.example.projectreact.controllers;

import jakarta.servlet.http.HttpSession;
import org.example.projectreact.DTO.CustomerDTO;
import org.example.projectreact.services.AccountService;
import org.example.projectreact.services.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private AccountService accountService;


    @PostMapping
    public ResponseEntity<String> createCustomer(@RequestBody CustomerDTO customerDto, HttpSession session) {
        if (customerService.usernameExists(customerDto.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already exists");
        }

        customerService.createCustomer(customerDto);
        Integer customerId = customerService.getCustomerIdByUsername(customerDto.getUsername());
        session.setAttribute("customerId", customerId);
        session.setAttribute("customerName", customerService.getCustomerName(customerId));
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }


}
