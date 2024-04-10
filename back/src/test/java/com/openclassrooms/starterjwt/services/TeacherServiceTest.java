package com.openclassrooms.starterjwt.services;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import com.openclassrooms.starterjwt.services.TeacherService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.MockitoAnnotations.openMocks;
import com.openclassrooms.starterjwt.models.Teacher;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class TeacherServiceTest {

    @Mock
    private TeacherRepository teacherRepository;

    @InjectMocks
    private TeacherService teacherService;

    @BeforeEach
    void setUp() {
        openMocks(this);
    }

    @Test
    void testFindAllTeachers() {
        List<Teacher> expectedTeachers = Arrays.asList(new Teacher(), new Teacher());
        when(teacherRepository.findAll()).thenReturn(expectedTeachers);

        List<Teacher> result = teacherService.findAll();

        assertEquals(expectedTeachers, result);
        verify(teacherRepository).findAll();
    }

    @Test
    void testFindTeacherByIdFound() {
        Long teacherId = 1L;
        Teacher expectedTeacher = new Teacher();
        expectedTeacher.setId(teacherId);
        when(teacherRepository.findById(teacherId)).thenReturn(Optional.of(expectedTeacher));

        Teacher result = teacherService.findById(teacherId);

        assertEquals(expectedTeacher, result);
        verify(teacherRepository).findById(teacherId);
    }

    @Test
    void testFindTeacherByIdNotFound() {
        Long teacherId = 2L;
        when(teacherRepository.findById(teacherId)).thenReturn(Optional.empty());

        Teacher result = teacherService.findById(teacherId);

        assertNull(result);
        verify(teacherRepository).findById(teacherId);
    }
}
