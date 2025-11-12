package com.stayease.backend.controller;

import com.stayease.backend.config.JwtUtils;
import com.stayease.backend.dto.LoginRequest;
import com.stayease.backend.dto.RegisterRequest;
import com.stayease.backend.model.User;
import com.stayease.backend.model.Role;
import com.stayease.backend.repository.UserRepository;
import com.stayease.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private UserService userService;
    @Autowired private JwtUtils jwtUtils;
    @Autowired private UserRepository userRepository;

    // -------------------------
    // REGISTER
    // -------------------------
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        User u = userService.register(req);
        return ResponseEntity.ok(Map.of(
                "id", u.getId(),
                "username", u.getUsername(),
                "role", u.getRole().name() // send singular role
        ));
    }

    // -------------------------
    // LOGIN
    // -------------------------
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        // Authenticate username + password
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword())
        );

        // Fetch user from DB
        User user = userRepository.findByUsername(req.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate JWT with single role wrapped in Set<String>
        String token = jwtUtils.generateToken(
                user.getUsername(),
                Set.of(user.getRole().name())
        );

        return ResponseEntity.ok(Map.of(
                "token", token,
                "username", user.getUsername(),
                "role", user.getRole().name() // frontend can use as string
        ));
    }
}
