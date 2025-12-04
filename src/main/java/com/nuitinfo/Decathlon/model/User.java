package com.nuitinfo.Decathlon.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "users") // "user" est interdit en SQL, on met "users"
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- AUTHENTIFICATION ---
    @Column(unique = true)
    private String email;
    private String password;
    private String pseudo;

    // --- PROFIL DECATHLON (Niveau 1) ---
    private String sportFocus; // Running, Yoga...
    private String painArea;   // Dos, Genoux...

    // --- GAMIFICATION (Niveau 3) ---
    private int point = 0;
    private String level = "deb";
    private String badge = "Novice";
}