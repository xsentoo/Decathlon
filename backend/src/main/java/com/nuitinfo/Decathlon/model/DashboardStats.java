package com.nuitinfo.Decathlon.model;

import lombok.Data;

@Data
public class DashboardStats {
    private long totalUsers;        // Nombre total d'inscrits
    private long totalExercises;    // Nombre d'exercices
    private long totalPoints;       // Points distribués
    private String topSport;        // Sport le plus populaire
}