package com.stayease.backend.repository;

import com.stayease.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);   // ✔ email se user find karna

    boolean existsByUsername(String username);   // ✔ username exists check

    boolean existsByEmail(String email);        // ✔ email exists check

    Optional<User> findByUsername(String username);

}
