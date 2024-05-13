package org.example.projectreact.services;

import org.example.projectreact.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CredentialsService {

    @Autowired
    private CustomerRepository customerRepository;

    public boolean verifyCredentials(String username, String password) {
        return customerRepository.existsByUsernameAndPassword(username, password);
    }
}
