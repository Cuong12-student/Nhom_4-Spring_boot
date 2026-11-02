package com.teamname.school_supplies_store.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Service
public class CustomerSessionService {

    private static final long SESSION_LIFETIME_SECONDS = 12 * 60 * 60;
    private final ConcurrentMap<String, Session> sessions = new ConcurrentHashMap<>();

    public String create(String username) {
        String token = UUID.randomUUID().toString();
        sessions.put(token, new Session(username, Instant.now().plusSeconds(SESSION_LIFETIME_SECONDS)));
        return token;
    }

    public String requireUsername(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw unauthorized();
        }
        String token = authorization.substring("Bearer ".length()).trim();
        Session session = sessions.get(token);
        if (session == null) {
            throw unauthorized();
        }
        if (session.expiresAt().isBefore(Instant.now())) {
            sessions.remove(token, session);
            throw unauthorized();
        }
        return session.username();
    }

    public void revoke(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return;
        }
        sessions.remove(authorization.substring("Bearer ".length()).trim());
    }

    private ResponseStatusException unauthorized() {
        return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Phiên đăng nhập không hợp lệ hoặc đã hết hạn.");
    }

    private record Session(String username, Instant expiresAt) {}
}
