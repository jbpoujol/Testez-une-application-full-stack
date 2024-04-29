package com.openclassrooms.starterjwt.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.annotations.CustomTestAnnotation;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@CustomTestAnnotation
public class UserControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setup() {
        userRepository.deleteAll();
    }

    @Test
    @WithMockUser(username = "user@example.com")
    public void testFindByIdWhenUserExists() throws Exception {
        User savedUser = userRepository.save(User.builder()
                .email("user@example.com")
                .password("password123")
                .lastName("Doe")
                .firstName("John")
                .admin(false)
                .build());

        mockMvc.perform(get("/api/user/" + savedUser.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("user@example.com"));
    }

    @Test
    @WithMockUser(username = "user@example.com")
    public void testFindByIdWhenUserDoesNotExist() throws Exception {
        mockMvc.perform(get("/api/user/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "user@example.com", roles={"USER"})
    public void testDeleteUserUnauthorized() throws Exception {
        User otherUser = userRepository.save(User.builder()
                .email("other@example.com")
                .password("password123")
                .lastName("Smith")
                .firstName("Jane")
                .admin(false)
                .build());

        mockMvc.perform(delete("/api/user/" + otherUser.getId()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "user@example.com")
    public void testDeleteUserAuthorized() throws Exception {
        User user = userRepository.save(User.builder()
                .email("user@example.com")
                .password("password123")
                .lastName("Doe")
                .firstName("John")
                .admin(false)
                .build());

        mockMvc.perform(delete("/api/user/" + user.getId()))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "user@example.com")
    public void testDeleteUserNotFound() throws Exception {
        mockMvc.perform(delete("/api/user/999"))
                .andExpect(status().isNotFound());
    }
}
