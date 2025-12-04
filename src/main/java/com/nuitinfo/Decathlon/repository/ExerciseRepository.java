package com.nuitinfo.Decathlon.repository;

import com.nuitinfo.Decathlon.model.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    // Pour filtrer les exercices par sport (Niveau 1 -> Niveau 2)
    List<Exercise> findByTargetSport(String targetSport);
}