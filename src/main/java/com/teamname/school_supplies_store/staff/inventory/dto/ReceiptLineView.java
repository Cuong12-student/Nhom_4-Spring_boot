package com.teamname.school_supplies_store.staff.inventory.dto;

import java.math.BigDecimal;

/** Một dòng trong phiếu nhập kho trả về cho giao diện. */
public record ReceiptLineView(
        String productName,
        String sku,
        int quantity,
        BigDecimal unitCost,
        BigDecimal total) {
}
