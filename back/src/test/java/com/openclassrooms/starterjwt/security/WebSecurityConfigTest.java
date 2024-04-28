package com.openclassrooms.starterjwt.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithAnonymousUser;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
public class WebSecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;


    @Test
    @WithAnonymousUser
    public void givenUnauthenticatedUser_whenAccessProtectedUrl_thenUnauthorized() throws Exception {
        mockMvc.perform(get("/api/session"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser
    public void givenAuthenticatedUser_whenAccessProtectedUrl_thenOk() throws Exception {
        mockMvc.perform(get("/api/session"))
                .andExpect(status().isOk());
    }

    @Test
    public void givenInvalidCredentials_whenLogin_thenUnauthorized() throws Exception {
        String invalidRequestBody = "{\"email\": \"wrong@studio.com\", \"password\": \"wrongPassword\"}";

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidRequestBody))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void whenRequestWithInvalidToken_thenUnauthorized() throws Exception {
        String invalidToken = "Bearer invalid.jwt.token.here";
        mockMvc.perform(get("/api/protectedResource")
                        .header("Authorization", invalidToken))
                .andExpect(status().isUnauthorized());
    }


}
