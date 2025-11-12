package com.stayease.backend.service.impl;

import com.stayease.backend.dto.RegisterRequest;
import com.stayease.backend.model.Role;
import com.stayease.backend.model.User;
import com.stayease.backend.repository.UserRepository;
import com.stayease.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public User register(RegisterRequest dto) {
        // Check if username already exists
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }


        Role userRole = Role.USER; // default
        if (dto.getRole() != null) {
            userRole = Role.valueOf(dto.getRole().toUpperCase()); // convert String → Role enum
        }

        var user = User.builder()
                .username(dto.getUsername())
                .password(passwordEncoder.encode(dto.getPassword()))
                .fullName(dto.getFullName())
                .role(userRole)
                .build();

        // Save user to repository
        return userRepository.save(user);
    }
}
