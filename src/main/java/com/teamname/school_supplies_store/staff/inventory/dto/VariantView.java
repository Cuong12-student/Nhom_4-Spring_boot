package com.teamname.school_supplies_store.staff.inventory.dto;

import java.math.BigDecimal;

/** Thông tin biến thể và lượng tồn kho dành cho màn hình nhân viên. */
public record VariantView(
        Long id,
        String name,
        String sku,
        String category,
        String image,
        String status,
        BigDecimal sellingPrice,
        int quantity) {
}
