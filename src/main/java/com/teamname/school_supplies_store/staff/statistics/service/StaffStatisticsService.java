package com.teamname.school_supplies_store.staff.statistics.service;

import com.teamname.school_supplies_store.entity.Order;
import com.teamname.school_supplies_store.entity.StockReceipt;
import com.teamname.school_supplies_store.enums.OrderStatus;
import com.teamname.school_supplies_store.repository.OrderRepository;
import com.teamname.school_supplies_store.staff.inventory.dto.ReceiptView;
import com.teamname.school_supplies_store.staff.inventory.repository.StockReceiptRepository;
import com.teamname.school_supplies_store.staff.inventory.service.StaffInventoryService;
import com.teamname.school_supplies_store.staff.service.StaffAccessService;
import com.teamname.school_supplies_store.staff.statistics.dto.DailyRevenue;
import com.teamname.school_supplies_store.staff.statistics.dto.Statistics;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.stream.Collectors;

/** Nghiệp vụ tổng hợp doanh thu đơn hàng và chi phí nhập kho. */
@Service
public class StaffStatisticsService {
    private static final Set<OrderStatus> APPROVED_STATUSES = EnumSet.of(
            OrderStatus.CONFIRMED,
            OrderStatus.PROCESSING,
            OrderStatus.SHIPPING,
            OrderStatus.COMPLETED);

    private final StaffAccessService staffAccess;
    private final OrderRepository orders;
    private final StockReceiptRepository receipts;
    private final StaffInventoryService staffInventoryService;

    public StaffStatisticsService(
            StaffAccessService staffAccess,
            OrderRepository orders,
            StockReceiptRepository receipts,
            StaffInventoryService staffInventoryService) {
        this.staffAccess = staffAccess;
        this.orders = orders;
        this.receipts = receipts;
        this.staffInventoryService = staffInventoryService;
    }

    /** Tính báo cáo theo ngày và khoảng lọc tùy chọn. */
    @Transactional(readOnly = true)
    public Statistics statistics(String authorization, LocalDate from, LocalDate to) {
        staffAccess.requireStaff(authorization);
        if (from != null && to != null && from.isAfter(to)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Ngày bắt đầu phải trước ngày kết thúc.");
        }

        List<Order> approvedOrders = orders.findAll().stream()
                .filter(order -> APPROVED_STATUSES.contains(order.getStatus()))
                .toList();
        long missingApprovalDates = approvedOrders.stream()
                .filter(order -> order.getApprovedAt() == null)
                .count();

        Map<LocalDate, List<Order>> ordersByDate = approvedOrders.stream()
                .filter(order -> order.getApprovedAt() != null
                        && inRange(order.getApprovedAt().toLocalDate(), from, to))
                .collect(Collectors.groupingBy(
                        order -> order.getApprovedAt().toLocalDate(),
                        TreeMap::new,
                        Collectors.toList()));

        List<DailyRevenue> dailyRevenue = ordersByDate.entrySet().stream()
                .map(entry -> new DailyRevenue(
                        entry.getKey(),
                        entry.getValue().size(),
                        entry.getValue().stream()
                                .map(Order::getTotalAmount)
                                .reduce(BigDecimal.ZERO, BigDecimal::add)))
                .toList();

        List<ReceiptView> filteredReceipts = receipts.findAll().stream()
                .filter(receipt -> inRange(receipt.getReceivedAt().toLocalDate(), from, to))
                .sorted(Comparator.comparing(StockReceipt::getReceivedAt).reversed())
                .map(staffInventoryService::toReceiptView)
                .toList();

        BigDecimal revenue = dailyRevenue.stream()
                .map(DailyRevenue::revenue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal expense = filteredReceipts.stream()
                .map(ReceiptView::total)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new Statistics(
                dailyRevenue,
                filteredReceipts,
                revenue,
                expense,
                revenue.subtract(expense),
                missingApprovalDates);
    }

    private static boolean inRange(LocalDate date, LocalDate from, LocalDate to) {
        return (from == null || !date.isBefore(from))
                && (to == null || !date.isAfter(to));
    }
}
