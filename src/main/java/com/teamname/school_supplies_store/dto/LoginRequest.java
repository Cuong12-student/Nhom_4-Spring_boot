package com.teamname.school_supplies_store.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class LoginRequest {

    @NotBlank(message = "Tên đăng nhập không được trống")
    @Size(min = 8, max = 12,
          message = "Tên đăng nhập phải từ 8 đến 12 ký tự")
    @Pattern(
        regexp = "^[a-zA-Z0-9_]+$",
        message = "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới"
    )
    private String username;

    @NotBlank(message = "Mật khẩu không được trống")
    @Size(min = 8, max = 12,
          message = "Mật khẩu phải từ 8 đến 12 ký tự")
    
    private String password;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}