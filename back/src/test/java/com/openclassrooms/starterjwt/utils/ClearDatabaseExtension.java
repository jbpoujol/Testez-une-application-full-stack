package com.openclassrooms.starterjwt.utils;
import com.openclassrooms.starterjwt.annotations.ClearDatabase;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import org.junit.jupiter.api.extension.BeforeEachCallback;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.junit.jupiter.api.extension.AfterEachCallback;
import org.springframework.beans.factory.annotation.Autowired;

public class ClearDatabaseExtension implements BeforeEachCallback, AfterEachCallback {

    @Autowired
    SessionRepository sessionRepository;

    @Autowired
    TeacherRepository teacherRepository;

    @Override
    public void beforeEach(ExtensionContext context) throws Exception {
        if (context.getElement().isPresent() && context.getElement().get().isAnnotationPresent(ClearDatabase.class)) {
            sessionRepository.deleteAll();
            teacherRepository.deleteAll();
        }
    }

    @Override
    public void afterEach(ExtensionContext context) throws Exception {
        if (context.getElement().isPresent() && context.getElement().get().isAnnotationPresent(ClearDatabase.class)) {
            sessionRepository.deleteAll();
            teacherRepository.deleteAll();
        }
    }
}
