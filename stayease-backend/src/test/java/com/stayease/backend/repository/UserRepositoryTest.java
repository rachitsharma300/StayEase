package com.stayease.backend.repository;

import com.stayease.backend.model.User;
import com.stayease.backend.model.Role;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.TestPropertySource;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.jpa.defer-datasource-initialization=true"
})
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void testFindByEmail() {
        User user = new User();
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setPassword("password");
        user.setFullName("Test User");
        user.setRole(Role.USER);

        userRepository.save(user);

        Optional<User> result = userRepository.findByEmail("test@example.com");
        assertThat(result).isPresent();
        assertThat(result.get().getEmail()).isEqualTo("test@example.com");
    }

    @Test
    void testExistsByUsername() {
        User user = new User();
        user.setUsername("rachit");
        user.setEmail("rachit@example.com");
        user.setPassword("password");
        user.setFullName("Rachit");
        user.setRole(Role.USER);

        userRepository.save(user);

        boolean exists = userRepository.existsByUsername("rachit");
        assertThat(exists).isTrue();
    }

    @Test
    void testFindByUsername() {
        User user = new User();
        user.setUsername("john");
        user.setEmail("john@example.com");
        user.setPassword("password");
        user.setFullName("John Doe");
        user.setRole(Role.USER);

        userRepository.save(user);

        Optional<User> result = userRepository.findByUsername("john");
        assertThat(result).isPresent();
        assertThat(result.get().getUsername()).isEqualTo("john");
    }
}