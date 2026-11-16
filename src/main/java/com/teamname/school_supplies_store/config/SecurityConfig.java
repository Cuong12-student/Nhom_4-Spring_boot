
package com.teamname.school_supplies_store.config;
import com.teamname.school_supplies_store.security.CustomAuthenticationFilter;

import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
@Configuration
@EnableWebSecurity
public class SecurityConfig {
private final CustomAuthenticationFilter customAuthenticationFilter;
public SecurityConfig(
        CustomAuthenticationFilter customAuthenticationFilter) {
    this.customAuthenticationFilter = customAuthenticationFilter;
}
    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .exceptionHandling(exception -> exception

    // Chưa đăng nhập hoặc chưa xác thực
    .authenticationEntryPoint(
        new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)
    )

    // Đã đăng nhập nhưng không đủ quyền
    .accessDeniedHandler((request, response, accessDeniedException) ->
        response.sendError(HttpServletResponse.SC_FORBIDDEN)
    )
)
            .addFilterBefore(
                customAuthenticationFilter,
    UsernamePasswordAuthenticationFilter.class
)
            .authorizeHttpRequests(auth -> auth

                // Cho phép preflight request
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // API đăng nhập và đăng ký công khai
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/auth/login",
                    "/api/auth/register"
                ).permitAll()

                // API đăng xuất yêu cầu đăng nhập
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/auth/logout"
                ).authenticated()

                // API chỉ dành cho CUSTOMER
                .requestMatchers(
                    "/api/v1/cart",
                    "/api/v1/cart/**"
                ).hasRole("CUSTOMER")

                .requestMatchers(
                    "/api/v1/profile",
                    "/api/v1/orders"
                ).hasRole("CUSTOMER")
                .requestMatchers(
    HttpMethod.PATCH,
    "/api/v1/orders/*/cancel"
).hasRole("CUSTOMER")
                // API chỉ dành cho STAFF
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/v1/staff/orders"
                ).hasRole("STAFF")
                .requestMatchers(
                HttpMethod.POST,
                    "/api/v1/staff/orders/{id}/approve",
                    "/api/v1/staff/orders/{id}/cancel"
                ).hasRole("STAFF")
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/v1/staff/variants"
                    ).hasRole("STAFF")
                .requestMatchers(
                HttpMethod.POST,
                    "/api/v1/staff/receipts"
                ).hasRole("STAFF")
                    .requestMatchers(
                    HttpMethod.GET,
                    "/api/v1/staff/statistics"
                ).hasRole("STAFF")
                // API chỉ dành cho ADMIN
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/admin/dashboard"
                ).hasRole("ADMIN")

                // Quản lý danh mục
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/admin/categories"
                    ).hasRole("ADMIN")

                .requestMatchers(
                    HttpMethod.POST,
                    "/api/admin/categories"
                ).hasRole("ADMIN")

                .requestMatchers(
                    HttpMethod.PUT,
                    "/api/admin/categories/{id}"
                ).hasRole("ADMIN")

                .requestMatchers(
                    HttpMethod.DELETE,
                    "/api/admin/categories/{id}"
                ).hasRole("ADMIN")

                // Quản lý sản phẩm
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/admin/products"
                ).hasRole("ADMIN")

                .requestMatchers(
                    HttpMethod.POST,
                    "/api/admin/products"
                ).hasRole("ADMIN")

                .requestMatchers(
                    HttpMethod.PUT,
                    "/api/admin/products/{id}"
                ).hasRole("ADMIN")

                .requestMatchers(
                    HttpMethod.DELETE,
                    "/api/admin/products/{id}"
                ).hasRole("ADMIN")

                // Quản lý biến thể sản phẩm
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/admin/products/{productId}/variants"
                ).hasRole("ADMIN")

                .requestMatchers(
                    HttpMethod.PUT,
                    "/api/admin/products/{productId}/variants/{variantId}"
                ).hasRole("ADMIN")

                .requestMatchers(
                    HttpMethod.DELETE,
                    "/api/admin/products/{productId}/variants/{variantId}"
                ).hasRole("ADMIN")

                // Quản lý đơn hàng
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/admin/orders"
                ).hasRole("ADMIN")

                // Quản lý nhân viên
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/admin/staff"
                ).hasRole("ADMIN")

                .requestMatchers(
                    HttpMethod.POST,
                    "/api/admin/staff"
                ).hasRole("ADMIN")

                .requestMatchers(
                    HttpMethod.PUT,
                    "/api/admin/staff/{id}"
                ).hasRole("ADMIN")

                .requestMatchers(
                    HttpMethod.DELETE,
                    "/api/admin/staff/{id}"
                ).hasRole("ADMIN")
                // API xem sản phẩm công khai
                .requestMatchers(
                    "/api/v1/home/products",
                    "/api/v1/products",
                    "/api/v1/products/**",
                    "/api/v1/store-page/products",
                    "/api/v1/store-page/products/**",
                    "/api/v1/store-page/filters",
                    "/api/v1/store-page/filters/**"
                ).permitAll()
                .requestMatchers(HttpMethod.GET, "/api/auth/me").authenticated()
                // Các API chưa khai báo quyền riêng
                .anyRequest().permitAll()
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
            List.of("http://localhost:5173")
        );

        configuration.setAllowedMethods(
            List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
        );

        configuration.setAllowedHeaders(List.of("*"));

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
            new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
    @Bean
public FilterRegistrationBean<CustomAuthenticationFilter>
customAuthenticationFilterRegistration(
        CustomAuthenticationFilter filter) {

    FilterRegistrationBean<CustomAuthenticationFilter> registration =
            new FilterRegistrationBean<>(filter);

    registration.setEnabled(false);

    return registration;
}
}
