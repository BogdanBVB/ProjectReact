package org.example.projectreact.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class LogoutController {

    @PostMapping("/logout")
    public void logout(HttpServletRequest request, HttpServletResponse response ) {

        request.getSession().invalidate(); // Invalidate the session
        response.setStatus(HttpServletResponse.SC_OK); // Respond with a successful status

    }
}
