package com.nuitinfo.Decathlon.security;

import com.nuitinfo.Decathlon.component.JwtFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
// 👇 IMPORTS POUR LA CONFIGURATION CORS GLOBALE
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                // 👇 INTÉGRATION DE LA CONFIGURATION CORS GLOBALE
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Routes ouvertes (Auth, Exercices publics, Admin stats)
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/exercises/**").permitAll()
                        .requestMatchers("/api/admin/stats").permitAll() // La page de stats est publique pour la démo
                        .requestMatchers("/test").permitAll()
                        .requestMatchers("/api/users/pr      ofile-update").authenticated() // Cette route EST PROTÉGÉE
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // --- BEAN QUI AUTORISE LE FRONTEND 5173 POUR TOUTES LES MÉTHODES ---
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Autorise le port 5173 (Ton Frontend)
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));

        // Autorise les méthodes GET, POST, PUT, DELETE, OPTIONS
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Headers requis pour envoyer le Token JWT
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Applique cette configuration à TOUTES les routes de l'API (/**)
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}