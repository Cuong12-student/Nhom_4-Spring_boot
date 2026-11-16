
package com.teamname.school_supplies_store.security;

import com.teamname.school_supplies_store.service.CustomerSessionService;
import com.teamname.school_supplies_store.service.CustomerSessionService.SessionInfo;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class CustomAuthenticationFilter extends OncePerRequestFilter {

    private final CustomerSessionService customerSessionService;

    public CustomAuthenticationFilter(
            CustomerSessionService customerSessionService) {
        this.customerSessionService = customerSessionService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {
   
        SecurityContextHolder.clearContext();
        String authorization = request.getHeader(HttpHeaders.AUTHORIZATION);
        System.out.println("CUSTOM AUTHENTICATION FILTER RUNNING");
        if (authorization != null && authorization.startsWith("Bearer ")) {
            try {
                SessionInfo sessionInfo =
                        customerSessionService.validate(authorization);

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                sessionInfo.username(),
                                null,
                                List.of(
                                        new SimpleGrantedAuthority(
                                                "ROLE_" + sessionInfo.role()
                                        )
                                )
                        );

                SecurityContextHolder.getContext()
                        .setAuthentication(authentication);

            } catch (Exception exception) {
                SecurityContextHolder.clearContext();

                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json;charset=UTF-8");

                response.getWriter().write(
                        "{\"status\":401,\"message\":\"Token không hợp lệ hoặc đã hết hạn.\"}"
                );
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}
