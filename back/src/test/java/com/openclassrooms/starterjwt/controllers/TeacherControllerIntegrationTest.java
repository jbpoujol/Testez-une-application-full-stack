package com.openclassrooms.starterjwt.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class TeacherControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setup() {
        // Nettoyer la base de données avant chaque test
        teacherRepository.deleteAll();

        // Ajouter quelques données de test
        Teacher teacher1 = new Teacher();
        teacher1.setFirstName("John");
        teacher1.setLastName("Doe");
        Teacher teacher2 = new Teacher();
        teacher2.setFirstName("Jane");
        teacher2.setLastName("Smith");
        teacherRepository.save(teacher1);
        teacherRepository.save(teacher2);
    }

    @Test
    @WithMockUser
    public void testFindAll() throws Exception {
        mockMvc.perform(get("/api/teacher"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].firstName").value("John"))
                .andExpect(jsonPath("$[0].lastName").value("Doe"))
                .andExpect(jsonPath("$[1].firstName").value("Jane"))
                .andExpect(jsonPath("$[1].lastName").value("Smith"));
    }

    @Test
    @WithMockUser
    public void testFindById() throws Exception {
        Teacher teacher = teacherRepository.findAll().get(0);

        mockMvc.perform(get("/api/teacher/{id}", teacher.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value(teacher.getFirstName()))
                .andExpect(jsonPath("$.lastName").value(teacher.getLastName()));
    }

    @Test
    @WithMockUser
    public void testFindByIdNotFound() throws Exception {
        mockMvc.perform(get("/api/teacher/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser
    public void testFindByIdInvalidId() throws Exception {
        mockMvc.perform(get("/api/teacher/{id}", "invalid"))
                .andExpect(status().isBadRequest());
    }
}
