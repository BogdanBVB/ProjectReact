package org.example.projectreact.models;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(insertable = true, updatable = false)
    private LocalDate transactionDate;
    @Column(nullable = false)
    private int customerId;
    @Column(nullable = false)
    private boolean intrabanking;
    @Column(nullable = false)
    private boolean interbanking;
    @Column(nullable = false)
    private int debitedAccountId;
    @Column(nullable = false)
    private int creditedAccountId;
    @Column
    private String paymentDetails;
    @Column
    private String creditedAmount;
    @Column
    private String debitedAmount;

}
