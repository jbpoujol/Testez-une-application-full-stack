package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.SessionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.MockitoAnnotations.openMocks;
import com.openclassrooms.starterjwt.models.Session;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.*;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import org.junit.jupiter.api.Assertions;

import java.util.Optional;
import static org.mockito.Mockito.*;
public class SessionServiceTest {

    @Mock
    private SessionRepository sessionRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SessionService sessionService;

    @BeforeEach
    void setUp() {
        openMocks(this);
    }

    @Test
    void testCreateSession() {
        Session inputSession = new Session();
        Session savedSession = new Session();
        savedSession.setId(1L); // Simulez l'ID généré
        when(sessionRepository.save(any(Session.class))).thenReturn(savedSession);

        Session result = sessionService.create(inputSession);

        assertEquals(savedSession.getId(), result.getId());
        verify(sessionRepository).save(inputSession);
    }

    @Test
    void testDeleteSession() {
        Long sessionId = 1L;

        sessionService.delete(sessionId);

        verify(sessionRepository).deleteById(sessionId);
    }

    @Test
    void testFindAllSessions() {
        List<Session> expectedSessions = Arrays.asList(new Session(), new Session());
        when(sessionRepository.findAll()).thenReturn(expectedSessions);

        List<Session> result = sessionService.findAll();

        assertEquals(expectedSessions.size(), result.size());
        verify(sessionRepository).findAll();
    }

    @Test
    void testGetSessionById() {
        Long sessionId = 1L;
        Session session = new Session();
        session.setId(sessionId);
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));

        Session result = sessionService.getById(sessionId);

        assertEquals(sessionId, result.getId());
        verify(sessionRepository).findById(sessionId);
    }

    @Test
    void testUpdateSession() {
        Long sessionId = 1L;
        Session inputSession = new Session();
        Session updatedSession = new Session();
        updatedSession.setId(sessionId);
        when(sessionRepository.save(any(Session.class))).thenReturn(updatedSession);

        Session result = sessionService.update(sessionId, inputSession);

        assertEquals(sessionId, result.getId());
        verify(sessionRepository).save(inputSession);
    }


    @Test
    void testNoLongerParticipateSessionNotFound() {
        Long sessionId = 1L, userId = 2L;
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.empty());

        Assertions.assertThrows(NotFoundException.class, () -> {
            sessionService.noLongerParticipate(sessionId, userId);
        });
    }

    @Test
    void testNoLongerParticipateNotParticipating() {
        Long sessionId = 1L, userId = 2L;
        Session session = new Session();
        List<User> users = new ArrayList<>();
        session.setUsers(users); // Aucun utilisateur n'est actuellement inscrit

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));

        Assertions.assertThrows(BadRequestException.class, () -> {
            sessionService.noLongerParticipate(sessionId, userId);
        });
    }

}
