package org.example.projectreact.services;

import jakarta.servlet.http.HttpSession;
import org.example.projectreact.DTO.PaymentDTO;
import org.example.projectreact.models.Account;
import org.example.projectreact.models.Payment;
import org.example.projectreact.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

   @Autowired
   private PaymentRepository paymentRepository;

   public void createPaymentOwnAccounts(Integer customerId, PaymentDTO paymentDTO, double fxRate) {

      Payment paymentDebit = new Payment();
      paymentDebit.setTransactionDate(LocalDate.now());
      paymentDebit.setPaymentDetails(paymentDTO.getPaymentDetails());
      paymentDebit.setDebitedAmount("-" + String.valueOf(paymentDTO.getAmount()));
      paymentDebit.setInterbanking(false);
      paymentDebit.setIntrabanking(true);
      paymentDebit.setDebitedAccountId(paymentDTO.getDebitedAccountId());
      paymentDebit.setCustomerId(customerId);
      paymentRepository.save(paymentDebit);

      Payment paymentCredit = new Payment() ;
      paymentCredit.setTransactionDate(LocalDate.now());
      paymentCredit.setPaymentDetails(paymentDTO.getPaymentDetails());
      paymentCredit.setCreditedAmount(String.valueOf(paymentDTO.getAmount() * fxRate));
      paymentCredit.setInterbanking(false);
      paymentCredit.setIntrabanking(true);
      paymentCredit.setCreditedAccountId(paymentDTO.getDebitedAccountId());
      paymentCredit.setCustomerId(customerId);
      paymentRepository.save(paymentCredit);
   }

   public void createPaymentForGBROAndInterbankingTransfers(Integer customerId, PaymentDTO paymentDTO) {
      Payment paymentDebit = new Payment();
      paymentDebit.setTransactionDate(LocalDate.now());
      paymentDebit.setPaymentDetails(paymentDTO.getPaymentDetails());
      paymentDebit.setDebitedAmount("-" + String.valueOf(paymentDTO.getAmount()));
      if(paymentDTO.isIntraBanking()) {
         paymentDebit.setInterbanking(false);
         paymentDebit.setIntrabanking(true);
      } else {
         paymentDebit.setInterbanking(true);
         paymentDebit.setIntrabanking(false);
      }
      paymentDebit.setDebitedAccountId(paymentDTO.getDebitedAccountId());
      paymentDebit.setCustomerId(customerId);
      paymentRepository.save(paymentDebit);
   }

   public void updateAccounts(Account debitedAccount, Account creditedAccount, double amount, double fxRate) {
      double newBalanceForDebitedAccount = (Double.parseDouble(debitedAccount.getAccountBalance()) - amount);
      debitedAccount.setAccountBalance( String.valueOf(newBalanceForDebitedAccount));

      double newBalanceForCreditedAccount = (Double.parseDouble(creditedAccount.getAccountBalance()) + (amount * fxRate));
      creditedAccount.setAccountBalance(String.valueOf(newBalanceForCreditedAccount));
   }

   public void updateAccountsForGBROPayments(Account debitedAccount, double amount) {
      double newBalanceForDebitedAccount = (Double.parseDouble(debitedAccount.getAccountBalance()) - amount);
      debitedAccount.setAccountBalance(String.valueOf(newBalanceForDebitedAccount));
   }

   public List<Payment> findAllPaymentsForAnAccount(Integer accountId, LocalDate startDate, Integer customerId) {
      if (startDate == null) {
         return paymentRepository.findByAccountId(accountId, customerId);
      } else {
         // Fetch all payments from the specified start date onwards
         return paymentRepository.findTransactionsByAccountAndDate(accountId, startDate, customerId);
      }
   }

   public Optional<Payment> getPaymentById(Integer transactionId) {
      return paymentRepository.findById(transactionId);
   }
}
