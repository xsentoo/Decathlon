package com.nuitinfo.Decathlon.repository;

import com.nuitinfo.Decathlon.model.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param; // Import Important
import java.util.List;

public interface ExerciseRepository extends JpaRepository<Exercise, Long> {

    // Filtre simple (Niveau 1)
    List<Exercise> findByTargetSport(String targetSport);

    // Moteur Intelligent (Niveau 2) : Sport OU Douleur
    @Query("SELECT e FROM Exercise e WHERE e.targetSport = :sport OR e.targetPainArea = :pain")
    List<Exercise> findRecommendations(@Param("sport") String sport, @Param("pain") String pain);
}