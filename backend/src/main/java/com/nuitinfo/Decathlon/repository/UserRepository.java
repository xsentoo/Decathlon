package com.nuitinfo.Decathlon.repository;

import com.nuitinfo.Decathlon.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    // --- POUR LE CLASSEMENT (Leaderboard) ---
    // Récupère les 10 meilleurs joueurs
    List<User> findTop10ByOrderByPointDesc();

    // --- POUR LE DASHBOARD (Stats Admin) ---

    // 1. Somme totale des points
    @Query("SELECT SUM(u.point) FROM User u")
    Long sumTotalPoints();

    // 2. Trouver le sport le plus populaire
    @Query("SELECT u.sportFocus FROM User u GROUP BY u.sportFocus ORDER BY COUNT(u) DESC LIMIT 1")
    String findMostPopularSport();
}