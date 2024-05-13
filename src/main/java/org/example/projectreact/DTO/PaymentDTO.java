package org.example.projectreact.DTO;

import lombok.Data;

@Data
public class PaymentDTO {


    private boolean intraBanking;
    private boolean interBanking;
    private int debitedAccountId;
    private int creditedAccountId;
    private String paymentDetails;
    private String creditedAmount;
    private String debitedAmount;
    private double amount;

 }
