
package com.teamname.school_supplies_store.service;

import com.teamname.school_supplies_store.dto.LoginRequest;
import com.teamname.school_supplies_store.dto.LoginResponse;
import com.teamname.school_supplies_store.dto.RegisterRequest;

import com.teamname.school_supplies_store.entity.User;
import com.teamname.school_supplies_store.entity.Customer;

import com.teamname.school_supplies_store.enums.Role;

import com.teamname.school_supplies_store.repository.UserRepository;
import com.teamname.school_supplies_store.repository.CustomerRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    
    // Constructor Injection
    public AuthService(
            UserRepository userRepository,
            CustomerRepository customerRepository
        ) {

        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        
    }

    // =========================
    // ĐĂNG NHẬP
    // =========================
    public LoginResponse login(LoginRequest request) {

        String username = request.getUsername().trim();

        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Tên đăng nhập hoặc mật khẩu không chính xác"
                        ));

        if (!request.getPassword().equals(user.getPassword()
)) {

            throw new RuntimeException(
                    "Tên đăng nhập hoặc mật khẩu không chính xác"
            );
        }

        return new LoginResponse(
                "Đăng nhập thành công",
                user.getUsername(),
                user.getRole().name()
        );
    }

    // =========================
    // ĐĂNG KÝ TÀI KHOẢN KHÁCH HÀNG
    // =========================
    @Transactional
    public void register(RegisterRequest request) {

        // 1. Chuẩn hóa dữ liệu
        String fullName = request.getFullName().trim();
        String username = request.getUsername().trim();
        String phone = request.getPhone().trim();
        String email = request.getEmail().trim();
        String address = request.getAddress().trim();

        // 2. Kiểm tra tên đăng nhập
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException(
                    "Tên đăng nhập đã tồn tại"
            );
        }

        // 3. Kiểm tra số điện thoại
        if (customerRepository.existsByPhone(phone)) {
            throw new RuntimeException(
                    "Số điện thoại đã được sử dụng"
            );
        }

        // 4. Kiểm tra email
        if (customerRepository.existsByEmail(email)) {
            throw new RuntimeException(
                    "Email đã được sử dụng"
            );
        }

        
       String password = request.getPassword();

        // 6. Tạo User
        User user = new User(
                username,
                password,
                Role.CUSTOMER
        );

        // 7. Lưu User
        userRepository.save(user);

        // 8. Tạo Customer
        Customer customer = new Customer(
                fullName,
                request.getAge(),
                request.getGender(),
                phone,
                email,
                address
        );

        // 9. Thiết lập quan hệ User - Customer
        customer.setUser(user);
        user.setCustomer(customer);

        // 10. Lưu Customer
        customerRepository.save(customer);
    }
}
