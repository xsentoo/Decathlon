package com.nuitinfo.Decathlon.controller;

import com.nuitinfo.Decathlon.model.Exercise;
import com.nuitinfo.Decathlon.repository.ExerciseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exercises")
@CrossOrigin(origins = "http://localhost:5173") // ⚠️ INDISPENSABLE : Autorise ton React à parler au Java
public class ExerciseController {

    @Autowired
    private ExerciseRepository exerciseRepository;

    // 1. Récupérer TOUT (Pour voir si ça marche)
    // URL : http://localhost:8080/api/exercises
    @GetMapping
    public List<Exercise> getAllExercises() {
        return exerciseRepository.findAll();
    }

    // 2. FILTRAGE PAR SPORT (Niveau 1 : Profilage)
    // URL : http://localhost:8080/api/exercises/filter?sport=Yoga
    @GetMapping("/filter")
    public List<Exercise> getBySport(@RequestParam String sport) {
        return exerciseRepository.findByTargetSport(sport);
    }
}