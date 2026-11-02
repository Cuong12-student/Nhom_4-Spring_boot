
package com.teamname.school_supplies_store.controller;

import com.teamname.school_supplies_store.dto.LoginRequest;
import com.teamname.school_supplies_store.dto.LoginResponse;
import com.teamname.school_supplies_store.dto.RegisterRequest;
import com.teamname.school_supplies_store.service.AuthService;
import com.teamname.school_supplies_store.service.CustomerSessionService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final CustomerSessionService customerSessionService;

    public AuthController(AuthService authService, CustomerSessionService customerSessionService) {
        this.authService = authService;
        this.customerSessionService = customerSessionService;
    }
    // Đăng nhập
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        LoginResponse response = authService.login(request);

        return ResponseEntity.ok(response);
    }
    // Đăng ký
    @PostMapping("/register")
    public ResponseEntity<String> register(
            @Valid @RequestBody RegisterRequest request) {

        authService.register(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("Đăng ký tài khoản thành công");
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        customerSessionService.revoke(authorization);
        return ResponseEntity.noContent().build();
    }
}
