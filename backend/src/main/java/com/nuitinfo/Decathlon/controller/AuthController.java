package com.nuitinfo.Decathlon.controller; // ⚠️ Package controller

import com.nuitinfo.Decathlon.model.User;
import com.nuitinfo.Decathlon.model.AuthRequest; // On utilise celui qu'on vient de créer
import com.nuitinfo.Decathlon.repository.UserRepository;

// 👇 IMPORT IMPORTANT : On va chercher l'utilitaire dans component
import com.nuitinfo.Decathlon.component.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")

public class AuthController {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtil jwtUtil;

    @PostMapping("/register")
    public Map<String, String> register(@RequestBody AuthRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email déjà pris !");
        }
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPseudo(request.getPseudo());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user.setSportFocus(request.getSportFocus());
        user.setPainArea(request.getPainArea());
        user.setPoint(0);
        user.setLevel("Debutant");

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail());
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("message", "Compte créé !");
        return response;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Utilisateur inconnu"));

        if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            String token = jwtUtil.generateToken(user.getEmail());
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("pseudo", user.getPseudo());
            response.put("sportFocus", user.getSportFocus());
            response.put("painArea", user.getPainArea());
            return response;
        } else {
            throw new RuntimeException("Mauvais mot de passe");
        }
    }
}