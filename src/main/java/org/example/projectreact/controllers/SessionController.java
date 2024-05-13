package org.example.projectreact.controllers;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Collections;

@Controller
@RequestMapping("/api/session")
public class SessionController {

    @GetMapping("/user-details")
    public ResponseEntity<?> getUserDetails(HttpSession session) {
        String customerName = (String) session.getAttribute("customerName");
        if (customerName != null) {
            return ResponseEntity.ok(Collections.singletonMap("name", customerName));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User not logged in or session expired");
        }
    }
}
