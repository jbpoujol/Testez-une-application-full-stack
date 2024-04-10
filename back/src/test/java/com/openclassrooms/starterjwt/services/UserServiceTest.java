package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.MockitoAnnotations.openMocks;
import static org.mockito.Mockito.verify;
import com.openclassrooms.starterjwt.models.User;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        openMocks(this);
    }

    @Test
    void testDeleteUser() {
        Long userId = 1L;

        userService.delete(userId);

        verify(userRepository).deleteById(userId);
    }

    @Test
    void testFindUserByIdFound() {
        Long userId = 1L;
        User expectedUser = new User();
        expectedUser.setId(userId);
        when(userRepository.findById(userId)).thenReturn(Optional.of(expectedUser));

        User result = userService.findById(userId);

        assertEquals(expectedUser, result);
        verify(userRepository).findById(userId);
    }

    @Test
    void testFindUserByIdNotFound() {
        Long userId = 2L;
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        User result = userService.findById(userId);

        assertNull(result);
        verify(userRepository).findById(userId);
    }
}
