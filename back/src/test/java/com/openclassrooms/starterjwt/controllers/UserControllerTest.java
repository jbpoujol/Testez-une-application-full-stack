package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;


import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.ArgumentMatchers.any;


@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
public class UserControllerTest {

    @Mock
    private UserMapper userMapper;

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    private User user;
    private UserDto userDto;
    private UserDetails userDetails;

    @BeforeEach
    public void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");
        userDto = new UserDto();
        userDto.setId(1L);
        userDetails = mock(UserDetails.class);
        mockSecurityContext(userDetails);
    }

    private void mockSecurityContext(UserDetails userDetails) {
        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    public void testFindById_Found() {
        when(userService.findById(1L)).thenReturn(user);
        when(userMapper.toDto(any(User.class))).thenReturn(userDto);

        ResponseEntity<?> response = userController.findById("1");

        assertEquals(ResponseEntity.ok().body(userDto), response);
    }

    @Test
    public void testFindById_NotFound() {
        when(userService.findById(1L)).thenReturn(null);

        ResponseEntity<?> response = userController.findById("1");

        assertEquals(ResponseEntity.notFound().build(), response);
    }

    @Test
    public void testDelete_Unauthorized() {
        when(userService.findById(1L)).thenReturn(user);
        when(userDetails.getUsername()).thenReturn("other@example.com");

        ResponseEntity<?> response = userController.save("1");

        assertEquals(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(), response);
    }

    @Test
    public void testDelete_Success() {
        when(userService.findById(1L)).thenReturn(user);
        when(userDetails.getUsername()).thenReturn("test@example.com");

        ResponseEntity<?> response = userController.save("1");

        assertEquals(ResponseEntity.ok().build(), response);
    }
}
