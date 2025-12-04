package com.nuitinfo.Decathlon.controller;

import com.nuitinfo.Decathlon.model.Exercise;
import com.nuitinfo.Decathlon.model.LeaderboardEntry;
import com.nuitinfo.Decathlon.model.User;
import com.nuitinfo.Decathlon.repository.ExerciseRepository;
import com.nuitinfo.Decathlon.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/exercises")
@CrossOrigin(origins = "http://localhost:5173")
public class ExerciseController {

    @Autowired private ExerciseRepository exerciseRepository;
    @Autowired private UserRepository userRepository;

    // 1. TOUS LES EXERCICES
    @GetMapping
    public List<Exercise> getAllExercises() {
        return exerciseRepository.findAll();
    }

    // 2. RECOMMANDATION INTELLIGENTE (Sport + Douleur)
    // Exemple : /api/exercises/filter?sport=Running&pain=Genoux
    @GetMapping("/filter")
    public List<Exercise> getRecommendations(
            @RequestParam String sport,
            @RequestParam(required = false) String pain) {

        if (pain == null || pain.isEmpty() || pain.equals("Non, tout va bien")) {
            // Si pas de douleur, on filtre juste par sport
            return exerciseRepository.findByTargetSport(sport);
        }

        // Sinon, on cherche Sport OU Douleur
        return exerciseRepository.findRecommendations(sport, pain);
    }

    // 3. CLASSEMENT
    @GetMapping("/leaderboard")
    public List<LeaderboardEntry> getLeaderboard() {
        List<User> topUsers = userRepository.findTop10ByOrderByPointDesc();
        return topUsers.stream()
                .map(u -> new LeaderboardEntry(u.getPseudo(), u.getPoint(), u.getLevel(), u.getBadge()))
                .collect(Collectors.toList());
    }

    // 4. VALIDATION ET POINTS
    @PostMapping("/{id}/complete")
    public Map<String, Object> completeExercise(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        Exercise exo = exerciseRepository.findById(id).orElseThrow(() -> new RuntimeException("Exo not found"));

        if (user.getCompletedExercises().contains(exo)) {
            Map<String, Object> r = new HashMap<>();
            r.put("message", "Déjà fait !");
            return r;
        }

        user.setPoint(user.getPoint() + exo.getPointsReward());
        user.getCompletedExercises().add(exo);

        if (user.getPoint() >= 1500) user.setLevel("Expert");
        else if (user.getPoint() >= 500) user.setLevel("Intermediaire");

        userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Bravo ! +" + exo.getPointsReward() + " pts");
        response.put("newScore", user.getPoint());
        response.put("newLevel", user.getLevel());
        return response;
    }
}