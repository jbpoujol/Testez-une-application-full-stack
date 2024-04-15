package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.controllers.SessionController;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.services.SessionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.services.SessionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SessionControllerTest {

    @Mock
    private SessionMapper sessionMapper;

    @Mock
    private SessionService sessionService;

    @InjectMocks
    private SessionController sessionController;

    private Session session;
    private SessionDto sessionDto;

    @BeforeEach
    public void setup() {
        // Initialise your session and sessionDto objects here
        session = new Session();
        session.setId(1L);
        sessionDto = new SessionDto();
        sessionDto.setId(1L);
    }

    @Test
    public void testFindById_Found() {
        when(sessionService.getById(1L)).thenReturn(session);
        when(sessionMapper.toDto(any(Session.class))).thenReturn(sessionDto);

        ResponseEntity<?> response = sessionController.findById("1");

        assertEquals(ResponseEntity.ok().body(sessionDto), response);
    }

    @Test
    public void testFindById_NotFound() {
        when(sessionService.getById(1L)).thenReturn(null);

        ResponseEntity<?> response = sessionController.findById("1");

        assertEquals(ResponseEntity.notFound().build(), response);
    }

    @Test
    public void testFindAll() {
        when(sessionService.findAll()).thenReturn(Arrays.asList(session));
        when(sessionMapper.toDto(any(List.class))).thenReturn(Arrays.asList(sessionDto));

        ResponseEntity<?> response = sessionController.findAll();

        assertEquals(ResponseEntity.ok().body(Arrays.asList(sessionDto)), response);
    }

    @Test
    public void testCreate_Success() {
        when(sessionService.create(any(Session.class))).thenReturn(session);
        when(sessionMapper.toEntity(any(SessionDto.class))).thenReturn(session);
        when(sessionMapper.toDto(any(Session.class))).thenReturn(sessionDto);

        ResponseEntity<?> response = sessionController.create(sessionDto);

        assertEquals(ResponseEntity.ok().body(sessionDto), response);
    }

    @Test
    public void testUpdate_Success() {
        when(sessionService.update(anyLong(), any(Session.class))).thenReturn(session);
        when(sessionMapper.toEntity(any(SessionDto.class))).thenReturn(session);
        when(sessionMapper.toDto(any(Session.class))).thenReturn(sessionDto);

        ResponseEntity<?> response = sessionController.update("1", sessionDto);

        assertEquals(ResponseEntity.ok().body(sessionDto), response);
    }

    @Test
    public void testUpdate_BadRequest() {
        ResponseEntity<?> response = sessionController.update("notANumber", sessionDto);

        assertEquals(ResponseEntity.badRequest().build(), response);
    }

    @Test
    public void testParticipate_Success() {
        doNothing().when(sessionService).participate(anyLong(), anyLong());

        ResponseEntity<?> response = sessionController.participate("1", "2");

        assertEquals(ResponseEntity.ok().build(), response);
    }

    @Test
    public void testParticipate_BadRequest() {
        ResponseEntity<?> response = sessionController.participate("one", "two");

        assertEquals(ResponseEntity.badRequest().build(), response);
    }

    @Test
    public void testNoLongerParticipate_Success() {
        doNothing().when(sessionService).noLongerParticipate(anyLong(), anyLong());

        ResponseEntity<?> response = sessionController.noLongerParticipate("1", "2");

        assertEquals(ResponseEntity.ok().build(), response);
    }

    @Test
    public void testNoLongerParticipate_BadRequest() {
        ResponseEntity<?> response = sessionController.noLongerParticipate("one", "two");

        assertEquals(ResponseEntity.badRequest().build(), response);
    }



}
