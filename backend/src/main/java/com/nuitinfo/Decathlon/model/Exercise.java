package com.nuitinfo.Decathlon.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- CONTENU ---
    private String title;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    @Column(columnDefinition = "TEXT")
    private String variation; // ✔ nouvelles variantes d’exercices

    // --- FILTRES ---
    private String targetSport;
    private String targetPainArea;

    private String difficulty;

    // --- GAMIFICATION ---
    private int pointsReward;

    // --- VISUEL ---
    private String gifUrl;

    // --- PRODUITS DECATHLON (3 maximum) ---
    private String productName;
    private String productUrl;
    private String productImage;

    private String productName2;
    private String productUrl2;
    private String productImage2;

    private String productName3;
    private String productUrl3;
    private String productImage3;
}