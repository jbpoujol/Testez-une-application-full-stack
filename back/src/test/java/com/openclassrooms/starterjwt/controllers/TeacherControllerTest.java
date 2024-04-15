package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.mapper.TeacherMapper;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.services.TeacherService;
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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class TeacherControllerTest {

    @Mock
    private TeacherMapper teacherMapper;

    @Mock
    private TeacherService teacherService;

    @InjectMocks
    private TeacherController teacherController;

    private Teacher teacher;
    private TeacherDto teacherDto;

    @BeforeEach
    public void setUp() {
        // Initialise your teacher and teacherDto objects here
        teacher = new Teacher();
        teacher.setId(1L);
        teacherDto = new TeacherDto();
        teacherDto.setId(1L);
    }

    @Test
    public void testFindById_Found() {
        when(teacherService.findById(1L)).thenReturn(teacher);
        when(teacherMapper.toDto(any(Teacher.class))).thenReturn(teacherDto);

        ResponseEntity<?> response = teacherController.findById("1");

        assertEquals(ResponseEntity.ok().body(teacherDto), response);
    }

    @Test
    public void testFindById_NotFound() {
        when(teacherService.findById(1L)).thenReturn(null);

        ResponseEntity<?> response = teacherController.findById("1");

        assertEquals(ResponseEntity.notFound().build(), response);
    }

    @Test
    public void testFindById_BadRequest() {
        ResponseEntity<?> response = teacherController.findById("notANumber");

        assertEquals(ResponseEntity.badRequest().build(), response);
    }

    @Test
    public void testFindAll() {
        when(teacherService.findAll()).thenReturn(Arrays.asList(teacher));
        when(teacherMapper.toDto(any(List.class))).thenReturn(Arrays.asList(teacherDto));

        ResponseEntity<?> response = teacherController.findAll();

        assertEquals(ResponseEntity.ok().body(Arrays.asList(teacherDto)), response);
    }
}
