package com.teamname.school_supplies_store.staff;

import com.teamname.school_supplies_store.entity.*;
import com.teamname.school_supplies_store.enums.OrderStatus;
import com.teamname.school_supplies_store.enums.Role;
import com.teamname.school_supplies_store.repository.OrderDetailRepository;
import com.teamname.school_supplies_store.repository.OrderRepository;
import com.teamname.school_supplies_store.repository.ProductVariantRepository;
import com.teamname.school_supplies_store.repository.StaffRepository;
import com.teamname.school_supplies_store.repository.UserRepository;
import com.teamname.school_supplies_store.service.CustomerSessionService;
import com.teamname.school_supplies_store.staff.StaffDtos.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StaffService {
    private static final Set<OrderStatus> APPROVED = EnumSet.of(
            OrderStatus.CONFIRMED, OrderStatus.PROCESSING, OrderStatus.SHIPPING, OrderStatus.COMPLETED);
    private final CustomerSessionService sessions;
    private final UserRepository users;
    private final StaffRepository staff;
    private final OrderRepository orders;
    private final StaffOrderRepository lockedOrders;
    private final OrderDetailRepository details;
    private final ProductVariantRepository variants;
    private final StockReceiptRepository receipts;

    public StaffService(CustomerSessionService sessions, UserRepository users, StaffRepository staff,
            OrderRepository orders, StaffOrderRepository lockedOrders, OrderDetailRepository details,
            ProductVariantRepository variants, StockReceiptRepository receipts) {
        this.sessions = sessions;
        this.users = users;
        this.staff = staff;
        this.orders = orders;
        this.lockedOrders = lockedOrders;
        this.details = details;
        this.variants = variants;
        this.receipts = receipts;
    }

    private Staff requireStaff(String authorization) {
        String username = sessions.requireUsername(authorization);
        User user = users.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Phiên đăng nhập không hợp lệ."));
        if (!Boolean.TRUE.equals(user.getEnabled()) || user.getRole() != Role.STAFF) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Chỉ nhân viên đang hoạt động được phép truy cập.");
        }
        return staff.findByUser_Id(user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Không tìm thấy hồ sơ nhân viên."));
    }

    @Transactional(readOnly = true)
    public List<OrderView> listOrders(String authorization) {
        requireStaff(authorization);
        return orders.findAllWithDetails().stream().map(this::orderView).toList();
    }

    @Transactional
    public OrderView decide(String authorization, Integer id, boolean approve) {
        Staff employee = requireStaff(authorization);
        Order order = lockedOrders.lockById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng."));
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Chỉ có thể xử lý đơn đang chờ duyệt.");
        }
        List<OrderDetail> orderLines = details.findByOrder_IdOrder(order.getId());
        if (!approve) {
            for (OrderDetail line : orderLines) {
                Inventory inventory = line.getVariant().getInventory();
                if (inventory == null) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Không tìm thấy kho của " + line.getVariant().getSku());
                }
                inventory.setQuantity(addQuantity(inventory.getQuantity(), line.getQuantity()));
            }
        }
        order.setStatus(approve ? OrderStatus.CONFIRMED : OrderStatus.CANCELLED);
        order.setStaff(employee);
        if (approve) order.setApprovedAt(LocalDateTime.now());
        return orderView(order, orderLines);
    }

    @Transactional(readOnly = true)
    public List<VariantView> listVariants(String authorization) {
        requireStaff(authorization);
        return variants.findAll().stream().map(variant -> {
            Product product = variant.getProduct();
            return new VariantView(variant.getIdVariant(), product.getName(), variant.getSku(),
                    product.getCategory().getName(), variant.getImage() != null ? variant.getImage() : product.getMainImage(),
                    variant.getStatus().name(), variant.getPrice(),
                    variant.getInventory() == null ? 0 : variant.getInventory().getQuantity());
        }).toList();
    }

    @Transactional
    public ReceiptView receive(String authorization, ReceiptInput input) {
        Staff employee = requireStaff(authorization);
        StockReceipt receipt = new StockReceipt();
        receipt.setStaff(employee);
        receipt.setReceivedAt(LocalDateTime.now());
        BigDecimal total = BigDecimal.ZERO;
        Set<Long> seen = new HashSet<>();
        for (ReceiptLineInput item : input.lines()) {
            if (!seen.add(item.variantId())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mỗi biến thể chỉ được xuất hiện một lần trong phiếu.");
            }
            ProductVariant variant = variants.findById(item.variantId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy biến thể sản phẩm."));
            Inventory inventory = variant.getInventory();
            if (inventory == null) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Không tìm thấy kho của " + variant.getSku());
            }
            inventory.setQuantity(addQuantity(inventory.getQuantity(), item.quantity()));
            BigDecimal lineTotal = item.unitCost().multiply(BigDecimal.valueOf(item.quantity()));
            total = total.add(lineTotal);
            if (total.precision() - total.scale() > 17) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tổng tiền nhập kho vượt giới hạn cho phép.");
            }
            StockReceiptLine line = new StockReceiptLine();
            line.setVariant(variant);
            line.setProductName(variant.getProduct().getName());
            line.setSku(variant.getSku());
            line.setQuantity(item.quantity());
            line.setUnitCost(item.unitCost());
            line.setLineTotal(lineTotal);
            receipt.addLine(line);
        }
        receipt.setTotalCost(total);
        return receiptView(receipts.saveAndFlush(receipt));
    }

    @Transactional(readOnly = true)
    public Statistics statistics(String authorization, LocalDate from, LocalDate to) {
        requireStaff(authorization);
        if (from != null && to != null && from.isAfter(to)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ngày bắt đầu phải trước ngày kết thúc.");
        }
        List<Order> approved = orders.findAll().stream().filter(o -> APPROVED.contains(o.getStatus())).toList();
        long missingDates = approved.stream().filter(o -> o.getApprovedAt() == null).count();
        Map<LocalDate, List<Order>> byDate = approved.stream()
                .filter(o -> o.getApprovedAt() != null && inRange(o.getApprovedAt().toLocalDate(), from, to))
                .collect(Collectors.groupingBy(o -> o.getApprovedAt().toLocalDate(), TreeMap::new, Collectors.toList()));
        List<DailyRevenue> daily = byDate.entrySet().stream().map(entry -> new DailyRevenue(entry.getKey(),
                entry.getValue().size(), entry.getValue().stream().map(order -> order.getTotalAmount())
                .reduce(BigDecimal.ZERO, (first, second) -> first.add(second)))).toList();
        List<ReceiptView> received = receipts.findAll().stream()
                .filter(r -> inRange(r.getReceivedAt().toLocalDate(), from, to))
                .sorted(Comparator.comparing((StockReceipt receipt) -> receipt.getReceivedAt()).reversed())
                .map(this::receiptView).toList();
        BigDecimal revenue = daily.stream().map(row -> row.revenue())
                .reduce(BigDecimal.ZERO, (first, second) -> first.add(second));
        BigDecimal expense = received.stream().map(row -> row.total())
                .reduce(BigDecimal.ZERO, (first, second) -> first.add(second));
        return new Statistics(daily, received, revenue, expense, revenue.subtract(expense), missingDates);
    }

    private static boolean inRange(LocalDate date, LocalDate from, LocalDate to) {
        return (from == null || !date.isBefore(from)) && (to == null || !date.isAfter(to));
    }

    private static int addQuantity(int current, int added) {
        try {
            return Math.addExact(current, added);
        } catch (ArithmeticException ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Số lượng tồn kho vượt giới hạn.", ex);
        }
    }

    private OrderView orderView(Order order) {
        return orderView(order, order.getDetail());
    }

    private OrderView orderView(Order order, List<OrderDetail> lines) {
        Customer customer = order.getCustomer();
        return new OrderView(order.getId(), order.getOrderDate(), order.getApprovedAt(), order.getStatus().name(),
                customer.getName(), customer.getPhone(), customer.getAddress(), order.getTotalAmount(),
                lines.stream().map(line -> new OrderLine(line.getVariant().getProduct().getName(),
                        line.getVariant().getSku(), line.getQuantity(), line.getPrice(),
                        line.getPrice().multiply(BigDecimal.valueOf(line.getQuantity())))).toList());
    }

    private ReceiptView receiptView(StockReceipt receipt) {
        return new ReceiptView(receipt.getId(), receipt.getReceivedAt(), receipt.getStaff().getName(),
                receipt.getTotalCost(), receipt.getLines().stream()
                .map(line -> new ReceiptLineView(line.getProductName(), line.getSku(), line.getQuantity(),
                        line.getUnitCost(), line.getLineTotal())).toList());
    }
}
