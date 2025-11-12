package com.stayease.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="payments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Payment {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long bookingId;

    private String orderId;   // Razorpay se mila Order ID
    private String paymentId; // Razorpay Payment ID

    private Double amount;

    @Column(name = "payment_provider_id")
    private String paymentProviderId;


    private PaymentStatus status;
}
