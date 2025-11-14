package com.stayease.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stayease.backend.config.JwtUtils;
import com.stayease.backend.dto.LoginRequest;
import com.stayease.backend.dto.RegisterRequest;
import com.stayease.backend.model.User;
import com.stayease.backend.model.Role;
import com.stayease.backend.repository.UserRepository;
import com.stayease.backend.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;

import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;

import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Optional;
import java.util.Set;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class AuthControllerTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserService userService;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private UserRepository userRepository;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private AuthController authController;

    private final ObjectMapper mapper = new ObjectMapper();

    private MockMvc mockMvc;

    private void setupMockMvc() {
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
    }

    // ✅ TEST: Successful registration
    @Test
    void testRegisterSuccess() throws Exception {
        setupMockMvc();

        RegisterRequest req = new RegisterRequest();
        req.setUsername("john");
        req.setPassword("12345");
        req.setEmail("john@test.com");

        User saved = new User();
        saved.setId(1L);
        saved.setUsername("john");
        saved.setEmail("john@test.com");
        saved.setRole(Role.USER);

        when(userService.register(any(RegisterRequest.class))).thenReturn(saved);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("john"))
                .andExpect(jsonPath("$.email").value("john@test.com"))
                .andExpect(jsonPath("$.role").value("USER"));
    }

    // ❌ TEST: Registration fails due to duplicate email/username
    @Test
    void testRegisterFailure() throws Exception {
        setupMockMvc();

        RegisterRequest req = new RegisterRequest();
        req.setUsername("same");
        req.setPassword("12345");
        req.setEmail("same@test.com");

        when(userService.register(any(RegisterRequest.class)))
                .thenThrow(new IllegalArgumentException("User already exists"));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("User already exists"));
    }

    // ✅ TEST: Login success
    @Test
    void testLoginSuccess() throws Exception {
        setupMockMvc();

        LoginRequest req = new LoginRequest();
        req.setUsername("john");
        req.setPassword("12345");

        User user = new User();
        user.setUsername("john");
        user.setEmail("john@test.com");
        user.setRole(Role.USER);

        when(authenticationManager.authenticate(any())).thenReturn(authentication);
        when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));
        when(jwtUtils.generateToken(eq("john"), any(Set.class))).thenReturn("fake-jwt-token");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("fake-jwt-token"))
                .andExpect(jsonPath("$.username").value("john"));
    }

    // ❌ TEST: Invalid credentials
    @Test
    void testLoginInvalidCredentials() throws Exception {
        setupMockMvc();

        LoginRequest req = new LoginRequest();
        req.setUsername("wrong");
        req.setPassword("bad");

        when(authenticationManager.authenticate(any()))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Invalid username or password"));
    }

    // ❌ TEST: Unexpected server error
    @Test
    void testLoginServerError() throws Exception {
        setupMockMvc();

        LoginRequest req = new LoginRequest();
        req.setUsername("john");
        req.setPassword("12345");

        when(authenticationManager.authenticate(any()))
                .thenThrow(new RuntimeException("DB down"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(req)))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message").value("Login failed: DB down"));
    }
}
