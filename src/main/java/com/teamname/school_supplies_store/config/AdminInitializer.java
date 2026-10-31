package com.teamname.school_supplies_store.config;

import com.teamname.school_supplies_store.service.AuthService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer implements CommandLineRunner {

    private final AuthService authService;

    public AdminInitializer(AuthService authService) {
        this.authService = authService;
    }

    @Override
    public void run(String... args) {
        authService.encodeInitialPasswords();
    }
}