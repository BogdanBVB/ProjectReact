package org.example.projectreact.models;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(nullable = false)
    private String currency;
    @Column(nullable = false)
    private Integer customerId;
    @Column(nullable = false)
    private String iban;
    @Column(nullable = false)
    private String accountBalance;
    @Column(nullable = false)
    private String accountType;
    @Column(insertable = true, updatable = false)
    private LocalDate openingDate;






}
