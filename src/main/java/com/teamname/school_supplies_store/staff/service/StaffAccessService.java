package com.teamname.school_supplies_store.staff.service;

import com.teamname.school_supplies_store.entity.Staff;
import com.teamname.school_supplies_store.entity.User;
import com.teamname.school_supplies_store.enums.Role;
import com.teamname.school_supplies_store.repository.StaffRepository;
import com.teamname.school_supplies_store.repository.UserRepository;
import com.teamname.school_supplies_store.service.CustomerSessionService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/** Xác thực phiên đăng nhập và hồ sơ nhân viên cho các chức năng staff. */
@Service
public class StaffAccessService {
    private final CustomerSessionService sessions;
    private final UserRepository users;
    private final StaffRepository staff;

    public StaffAccessService(
            CustomerSessionService sessions,
            UserRepository users,
            StaffRepository staff) {
        this.sessions = sessions;
        this.users = users;
        this.staff = staff;
    }

    /** Chỉ trả về hồ sơ khi tài khoản đang hoạt động và có quyền STAFF. */
    public Staff requireStaff(String authorization) {
        String username = sessions.requireUsername(authorization);
        User user = users.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Phiên đăng nhập không hợp lệ."));

        if (!Boolean.TRUE.equals(user.getEnabled()) || user.getRole() != Role.STAFF) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Chỉ nhân viên đang hoạt động được phép truy cập.");
        }

        return staff.findByUser_Id(user.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.FORBIDDEN, "Không tìm thấy hồ sơ nhân viên."));
    }
}
