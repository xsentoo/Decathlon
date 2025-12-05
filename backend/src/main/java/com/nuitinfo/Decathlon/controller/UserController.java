package com.nuitinfo.Decathlon.controller;

import com.nuitinfo.Decathlon.model.ProfileUpdateRequest;
import com.nuitinfo.Decathlon.model.User;
import com.nuitinfo.Decathlon.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
// ❌ Supprimé : @CrossOrigin (Géré globalement par SecurityConfig)
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // Cette route est protégée par JWT
    @PutMapping("/profile-update")
    public ResponseEntity<?> updateProfile(@RequestBody ProfileUpdateRequest request, Principal principal) {

        // 1. Récupération de l'utilisateur à partir du Token JWT
        String email = principal.getName();
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Utilisateur non trouvé dans le Token.");
        }

        User user = userOpt.get();

        // 2. Mise à jour des champs du Quiz (Sport et Douleur)
        user.setSportFocus(request.getSportFocus());
        user.setPainArea(request.getPainArea());

        // 3. Logique d'initialisation du niveau
        if (user.getLevel().equals("NOT_SET")) {
            user.setLevel("Debutant");
            user.setBadge("Novice");
        }

        // 4. Sauvegarde en base
        userRepository.save(user);

        // Réponse OK
        return ResponseEntity.ok().body("Profil mis à jour avec succès. Redirection vers le Dashboard.");
    }

    // NOUVEL ENDPOINT : Récupérer le profil complet de l'utilisateur connecté
    // (Nécessaire pour afficher les points/niveaux sur le dashboard)
    @GetMapping("/profile")
    public ResponseEntity<User> getMyProfile(Principal principal) {
        String email = principal.getName();
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // Toutes les données (y compris points, niveau, sportFocus) sont envoyées
        return ResponseEntity.ok(userOpt.get());
    }
}