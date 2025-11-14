package com.stayease.backend.service;

import com.stayease.backend.dto.RegisterRequest;
import com.stayease.backend.model.User;
import com.stayease.backend.model.Role;
import com.stayease.backend.repository.UserRepository;
import com.stayease.backend.service.impl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder; // ✅ ADDED

    @InjectMocks
    private UserServiceImpl userService;

    @BeforeEach
    void init() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegisterUser() {
        // Arrange
        RegisterRequest req = new RegisterRequest();
        req.setUsername("testuser");
        req.setPassword("123456");
        req.setEmail("test@test.com");
        req.setFullName("Test User");

        User user = User.builder()
                .id(1L)
                .username("testuser")
                .email("test@test.com")
                .password("encodedPassword")
                .fullName("Test User")
                .role(Role.USER)
                .build();

        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(userRepository.existsByEmail("test@test.com")).thenReturn(false);
        when(passwordEncoder.encode("123456")).thenReturn("encodedPassword"); // ✅ FIXED
        when(userRepository.save(any(User.class))).thenReturn(user);

        // Act
        User result = userService.register(req);

        // Assert
        assertNotNull(result);
        assertEquals("test@test.com", result.getEmail());
        assertEquals("testuser", result.getUsername());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testRegisterUser_UsernameAlreadyExists() {
        // Arrange
        RegisterRequest req = new RegisterRequest();
        req.setUsername("existinguser");
        req.setPassword("123456");
        req.setEmail("test@test.com");

        when(userRepository.existsByUsername("existinguser")).thenReturn(true);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            userService.register(req);
        });

        assertEquals("Username already exists", exception.getMessage());
    }

    @Test
    void testRegisterUser_EmailAlreadyExists() {
        // Arrange
        RegisterRequest req = new RegisterRequest();
        req.setUsername("newuser");
        req.setPassword("123456");
        req.setEmail("existing@test.com");

        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("existing@test.com")).thenReturn(true);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            userService.register(req);
        });

        assertEquals("Email already exists", exception.getMessage());
    }
}