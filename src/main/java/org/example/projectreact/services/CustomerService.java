package org.example.projectreact.services;

import org.example.projectreact.DTO.AccountDTO;
import org.example.projectreact.DTO.CustomerDTO;
import org.example.projectreact.models.Customer;
import org.example.projectreact.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    @Autowired
    CustomerRepository customerRepository;

    @Autowired
    AccountService accountService;

    public void createCustomer(CustomerDTO customerDTO) {
        Customer customer = new Customer();
        customer.setName(customerDTO.getName());
        customer.setSurname(customerDTO.getSurname());
        customer.setEmail(customerDTO.getEmail());
        customer.setPhone(customerDTO.getPhone());
        customer.setUsername(customerDTO.getUsername());
        customer.setPassword(customerDTO.getPassword());
        customerRepository.save(customer);
        Integer customerId = customerRepository.findByUsernameAndPassword(customer.getUsername(), customer.getPassword()).getId();
        AccountDTO accountDTO = new AccountDTO();
        accountDTO.setAccountType("current");
        accountDTO.setCurrency("RON");

        accountService.createAccount(accountDTO, customer.getId());
    }

    public List<Customer> findAll() {
        return customerRepository.findAll();
    }

    public boolean usernameExists(String username) {
        return customerRepository.existsByUsername(username);
    }

    public Integer getCustomerIdByUsername(String username) {
        return customerRepository.findByUsername(username).getId();
    }

    public String getCustomerName(Integer customerId) {
        Optional<Customer> optionalCustomer = customerRepository.findById(customerId);
        String name ="";
        if (optionalCustomer.isPresent()) {
            Customer customer = optionalCustomer.get();
            // Now you can access the fields
            name = customer.getName();
            System.out.println("Customer name: " + name);
        } else {
            System.out.println("Customer not found");
        }
        return name;


    }
}
