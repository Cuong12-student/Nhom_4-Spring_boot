package com.teamname.school_supplies_store.staff;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public final class StaffDtos {
    private StaffDtos() {}

    public record OrderLine(String productName, String sku, int quantity, BigDecimal price, BigDecimal total) {}
    public record OrderView(Integer id, LocalDateTime orderedAt, LocalDateTime approvedAt,
            String status, String customerName, String phone, String address,
            BigDecimal total, List<OrderLine> lines) {}
    public record VariantView(Long id, String name, String sku, String category, String image,
            String status, BigDecimal sellingPrice, int quantity) {}
    public record ReceiptLineInput(
            @NotNull Long variantId,
            @Positive int quantity,
            @NotNull @PositiveOrZero @Digits(integer = 13, fraction = 2) BigDecimal unitCost) {}
    public record ReceiptInput(@NotEmpty @Size(max = 100) List<@NotNull @Valid ReceiptLineInput> lines) {}
    public record ReceiptLineView(String productName, String sku, int quantity,
            BigDecimal unitCost, BigDecimal total) {}
    public record ReceiptView(Long id, LocalDateTime receivedAt, String staffName,
            BigDecimal total, List<ReceiptLineView> lines) {}
    public record DailyRevenue(LocalDate date, long orderCount, BigDecimal revenue) {}
    public record Statistics(List<DailyRevenue> dailyRevenue, List<ReceiptView> receipts,
            BigDecimal revenue, BigDecimal expense, BigDecimal difference, long historicalOrdersWithoutApprovalDate) {}
}
