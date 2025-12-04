package com.nuitinfo.Decathlon.controller;

import com.nuitinfo.Decathlon.model.DashboardStats;
import com.nuitinfo.Decathlon.repository.ExerciseRepository;
import com.nuitinfo.Decathlon.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired private UserRepository userRepository;
    @Autowired private ExerciseRepository exerciseRepository;

    @GetMapping("/stats")
    public DashboardStats getGlobalStats() {
        DashboardStats stats = new DashboardStats();

        // On remplit les compteurs
        stats.setTotalUsers(userRepository.count());
        stats.setTotalExercises(exerciseRepository.count());

        // Gestion des nulls si la base est vide
        Long points = userRepository.sumTotalPoints();
        stats.setTotalPoints(points != null ? points : 0);

        String sport = userRepository.findMostPopularSport();
        stats.setTopSport(sport != null ? sport : "Aucun");

        return stats;
    }
}