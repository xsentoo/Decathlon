package com.nuitinfo.Decathlon.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- AUTHENTIFICATION ---
    @Column(unique = true, nullable = false)
    private String email;
    private String password;
    private String pseudo;

    // --- PROFIL DECATHLON ---
    private String sportFocus;
    private String painArea;

    // --- GAMIFICATION ---
    private int point = 0;
    private String level = "Debutant";
    private String badge = "Novice";

    // --- HISTORIQUE (ANTI-TRICHE) ---
    // Cette liste retient tous les exercices validés par l'utilisateur
    @ManyToMany
    @JoinTable(
            name = "solves",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "exercise_id")
    )
    private Set<Exercise> completedExercises = new HashSet<>();
}