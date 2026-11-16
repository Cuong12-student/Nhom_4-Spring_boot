package com.teamname.school_supplies_store.staff.statistics.dto;

import com.teamname.school_supplies_store.staff.inventory.dto.ReceiptView;

import java.math.BigDecimal;
import java.util.List;

/** Tổng hợp doanh thu, chi phí nhập kho và các phiếu nhập trong khoảng ngày. */
public record Statistics(
        List<DailyRevenue> dailyRevenue,
        List<ReceiptView> receipts,
        BigDecimal revenue,
        BigDecimal expense,
        BigDecimal difference,
        long historicalOrdersWithoutApprovalDate) {
}
