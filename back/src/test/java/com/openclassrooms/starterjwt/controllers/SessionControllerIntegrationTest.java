package com.openclassrooms.starterjwt.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.annotations.CustomTestAnnotation;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Date;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@CustomTestAnnotation
public class SessionControllerIntegrationTest {
 
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setup() {
        sessionRepository.deleteAll();
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testFindByIdWhenSessionExists() throws Exception {
        Session session = Session.builder()
                .name("Java Workshop")
                .description("Learn about Java")
                .date(new Date())  // Adding current date
                .build();
        session = sessionRepository.save(session);

        mockMvc.perform(get("/api/session/" + session.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Java Workshop"));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testFindByIdWhenSessionDoesNotExist() throws Exception {
        mockMvc.perform(get("/api/session/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testCreateSession() throws Exception {
        // Créer un enseignant et obtenir son ID
        Teacher teacher = new Teacher();
        teacher.setLastName("Smith");
        teacher.setFirstName("John");
        teacher = teacherRepository.save(teacher);

        SessionDto sessionDto = new SessionDto();
        sessionDto.setName("Spring Boot Workshop");
        sessionDto.setDescription("Learn about Spring Boot");
        sessionDto.setDate(new Date());
        sessionDto.setTeacher_id(teacher.getId());

        mockMvc.perform(post("/api/session")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sessionDto)))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testUpdateSessionWithTeacher() throws Exception {
        // Création d'un enseignant
        Teacher teacher = new Teacher();
        teacher.setLastName("Smith");
        teacher.setFirstName("John");
        teacher = teacherRepository.save(teacher);

        Session session = Session.builder()
                .name("Initial Session")
                .description("Initial Description")
                .date(new Date())
                .teacher(teacher)
                .build();
        session = sessionRepository.save(session);

        SessionDto sessionDto = new SessionDto();
        sessionDto.setName("Updated Session");
        sessionDto.setDescription("Updated Description");
        sessionDto.setDate(new Date());
        sessionDto.setTeacher_id(teacher.getId());

        mockMvc.perform(put("/api/session/" + session.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sessionDto)))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testDeleteSession() throws Exception {
        Session session = Session.builder()
                .name("Temporary Session")
                .description("This session will be deleted")
                .date(new Date())  // Adding current date
                .build();
        session = sessionRepository.save(session);

        mockMvc.perform(delete("/api/session/" + session.getId()))
                .andExpect(status().isOk());
    }
}
