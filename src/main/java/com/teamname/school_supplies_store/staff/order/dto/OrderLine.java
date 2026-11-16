package com.teamname.school_supplies_store.staff.order.dto;

import java.math.BigDecimal;

/** Một sản phẩm trong thông tin đơn hàng trả về cho nhân viên. */
public record OrderLine(
        String productName,
        String sku,
        int quantity,
        BigDecimal price,
        BigDecimal total) {
}
