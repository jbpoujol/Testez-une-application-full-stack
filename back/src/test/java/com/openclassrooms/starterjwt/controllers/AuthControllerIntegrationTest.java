package com.openclassrooms.starterjwt.controllers;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    public void setup() {
        userRepository.deleteAll();
    }

    @Test
    public void testRegisterUser() throws Exception {
        SignupRequest newSignUpRequest = new SignupRequest();
        newSignUpRequest.setEmail("newuser@example.com");
        newSignUpRequest.setPassword("Password123");
        newSignUpRequest.setFirstName("John");
        newSignUpRequest.setLastName("Doe");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newSignUpRequest)))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("User registered successfully!")));
    }

    @Test
    public void testRegisterAndAuthenticateUser() throws Exception {
        // Register user
        String rawPassword = "Password123";
        User newUser = new User();
        newUser.setEmail("user@example.com");
        newUser.setPassword(passwordEncoder.encode(rawPassword)); // Encode password
        userRepository.save(newUser);

        // Try to login
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("user@example.com");
        loginRequest.setPassword(rawPassword); // Use the raw password here

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk()); // Now it should pass as password matches
    }
}
