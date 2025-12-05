package com.nuitinfo.Decathlon.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Exercise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- CONTENU (Niveau 2) ---
    private String title;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    // --- FILTRES ---
    private String targetSport;     // Ex: "Running"
    private String targetPainArea;  // Ex: "Genoux" (NOUVEAU CHAMP)

    private String difficulty;

    // --- GAMIFICATION ---
    private int pointsReward;

    // --- VISUEL (Niveau 3) ---
    private String gifUrl;

    // --- BUSINESS DECATHLON (Niveau 4) ---
    private String productName;
    private String productUrl;
    private String productImage;
}