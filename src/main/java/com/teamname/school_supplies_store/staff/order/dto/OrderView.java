package com.teamname.school_supplies_store.staff.order.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/** Thông tin đơn hàng hiển thị trong màn hình quản lý của nhân viên. */
public record OrderView(
        Integer id,
        LocalDateTime orderedAt,
        LocalDateTime approvedAt,
        String status,
        String customerName,
        String phone,
        String address,
        BigDecimal total,
        List<OrderLine> lines) {
}
