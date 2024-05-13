package org.example.projectreact.repository;

import org.example.projectreact.models.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    List<Customer> findAllByName(String name);

    boolean existsByUsername(String username);

    boolean existsByUsernameAndPassword(String username, String password);

    Customer findByUsername(String username);

    Customer findByUsernameAndPassword(String username, String password);

    Optional<Customer> findById(Integer customerId);
}
