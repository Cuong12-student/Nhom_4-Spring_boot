package com.teamname.school_supplies_store.staff.inventory.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/** Phiếu nhập kho đã được lưu cùng tổng chi phí và các dòng hàng. */
public record ReceiptView(
        Long id,
        LocalDateTime receivedAt,
        String staffName,
        BigDecimal total,
        List<ReceiptLineView> lines) {
}
