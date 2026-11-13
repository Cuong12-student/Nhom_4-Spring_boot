package com.teamname.school_supplies_store.staff;

import com.teamname.school_supplies_store.entity.*;
import com.teamname.school_supplies_store.enums.OrderStatus;
import com.teamname.school_supplies_store.enums.Role;
import com.teamname.school_supplies_store.repository.*;
import com.teamname.school_supplies_store.service.CustomerSessionService;
import com.teamname.school_supplies_store.staff.StaffDtos.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class StaffServiceTest {
    private final CustomerSessionService sessions = mock(CustomerSessionService.class);
    private final UserRepository users = mock(UserRepository.class);
    private final StaffRepository staff = mock(StaffRepository.class);
    private final OrderRepository orders = mock(OrderRepository.class);
    private final StaffOrderRepository lockedOrders = mock(StaffOrderRepository.class);
    private final OrderDetailRepository details = mock(OrderDetailRepository.class);
    private final ProductVariantRepository variants = mock(ProductVariantRepository.class);
    private final StockReceiptRepository receipts = mock(StockReceiptRepository.class);
    private final StaffService service = new StaffService(sessions, users, staff, orders,
            lockedOrders, details, variants, receipts);
    private Staff employee;
    private ProductVariant variant;
    private User user;

    @BeforeEach
    void setup() {
        user = new User("staffuser", "hash", Role.STAFF);
        user.setId(7);
        employee = new Staff();
        employee.setName("Nhân viên");
        employee.setUser(user);
        when(sessions.requireUsername("Bearer staff")).thenReturn("staffuser");
        when(users.findByUsername("staffuser")).thenReturn(Optional.of(user));
        when(staff.findByUser_Id(7)).thenReturn(Optional.of(employee));

        Product product = new Product();
        product.setName("Bút");
        variant = new ProductVariant();
        variant.setIdVariant(10L);
        variant.setSku("BUT-1");
        variant.setProduct(product);
        variant.setInventory(new Inventory(4));
    }

    private Order pendingOrder(int quantity) {
        Customer customer = new Customer();
        customer.setName("Khách");
        customer.setPhone("0123456789");
        customer.setAddress("Hà Nội");
        Order order = new Order(LocalDateTime.now(), new BigDecimal("20000"), OrderStatus.PENDING);
        order.setId(1);
        order.setCustomer(customer);
        OrderDetail line = new OrderDetail(quantity, new BigDecimal("10000"));
        line.setVariant(variant);
        line.setOrder(order);
        when(lockedOrders.lockById(1)).thenReturn(Optional.of(order));
        when(details.findByOrder_IdOrder(1)).thenReturn(List.of(line));
        return order;
    }

    @Test
    void cancelRestoresStockOnlyOnce() {
        Order order = pendingOrder(2);
        service.decide("Bearer staff", 1, false);
        assertEquals(OrderStatus.CANCELLED, order.getStatus());
        assertEquals(6, variant.getInventory().getQuantity());
        assertSame(employee, order.getStaff());
        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> service.decide("Bearer staff", 1, false));
        assertEquals(HttpStatus.CONFLICT, error.getStatusCode());
        assertEquals(6, variant.getInventory().getQuantity());
    }

    @Test
    void approvalRecordsDateAndDoesNotRestoreStock() {
        Order order = pendingOrder(2);
        service.decide("Bearer staff", 1, true);
        assertEquals(OrderStatus.CONFIRMED, order.getStatus());
        assertNotNull(order.getApprovedAt());
        assertSame(employee, order.getStaff());
        assertEquals(4, variant.getInventory().getQuantity());
        assertThrows(ResponseStatusException.class, () -> service.decide("Bearer staff", 1, false));
    }

    @Test
    void otherRolesAndDisabledStaffCannotAccess() {
        user.setRole(Role.CUSTOMER);
        assertEquals(HttpStatus.FORBIDDEN,
                assertThrows(ResponseStatusException.class, () -> service.listOrders("Bearer staff")).getStatusCode());
        user.setRole(Role.STAFF);
        user.setEnabled(false);
        assertEquals(HttpStatus.FORBIDDEN,
                assertThrows(ResponseStatusException.class, () -> service.listOrders("Bearer staff")).getStatusCode());
        verifyNoInteractions(orders);
    }

    @Test
    void receiptRecordsCostAndIncreasesExistingStock() {
        when(variants.findById(10L)).thenReturn(Optional.of(variant));
        when(receipts.saveAndFlush(any())).thenAnswer(invocation -> invocation.getArgument(0));
        ReceiptView result = service.receive("Bearer staff",
                new ReceiptInput(List.of(new ReceiptLineInput(10L, 3, new BigDecimal("2500")))));
        assertEquals(7, variant.getInventory().getQuantity());
        assertEquals(0, new BigDecimal("7500").compareTo(result.total()));
        assertEquals("BUT-1", result.lines().get(0).sku());
        assertEquals(0, new BigDecimal("2500").compareTo(result.lines().get(0).unitCost()));
        assertEquals(3, result.lines().get(0).quantity());
    }

    @Test
    void receivingRejectsStockOverflow() {
        variant.getInventory().setQuantity(Integer.MAX_VALUE);
        when(variants.findById(10L)).thenReturn(Optional.of(variant));
        ResponseStatusException error = assertThrows(ResponseStatusException.class, () -> service.receive(
                "Bearer staff", new ReceiptInput(List.of(new ReceiptLineInput(10L, 1, BigDecimal.TEN)))));
        assertEquals(HttpStatus.CONFLICT, error.getStatusCode());
        assertEquals(Integer.MAX_VALUE, variant.getInventory().getQuantity());
        verifyNoInteractions(receipts);
    }

    @Test
    void statisticsRejectsReversedDateRange() {
        ResponseStatusException error = assertThrows(ResponseStatusException.class, () -> service.statistics(
                "Bearer staff", LocalDate.of(2026, 11, 14), LocalDate.of(2026, 11, 13)));
        assertEquals(HttpStatus.BAD_REQUEST, error.getStatusCode());
        verifyNoInteractions(orders, receipts);
    }

    @Test
    void reportUsesApprovalDateAndPurchaseCostInRange() {
        Order accepted = new Order(LocalDateTime.now().minusDays(8), new BigDecimal("20000"), OrderStatus.CONFIRMED);
        accepted.setApprovedAt(LocalDate.now().atTime(12, 0));
        Order historical = new Order(LocalDateTime.now(), new BigDecimal("90000"), OrderStatus.COMPLETED);
        Order waiting = new Order(LocalDateTime.now(), new BigDecimal("50000"), OrderStatus.PENDING);
        StockReceipt receipt = new StockReceipt();
        receipt.setReceivedAt(LocalDate.now().atTime(10, 0));
        receipt.setStaff(employee);
        receipt.setTotalCost(new BigDecimal("7500"));
        when(orders.findAll()).thenReturn(List.of(accepted, historical, waiting));
        when(receipts.findAll()).thenReturn(List.of(receipt));
        Statistics result = service.statistics("Bearer staff", LocalDate.now(), LocalDate.now());
        assertEquals(1, result.dailyRevenue().size());
        assertEquals(1, result.dailyRevenue().get(0).orderCount());
        assertEquals(0, new BigDecimal("20000").compareTo(result.revenue()));
        assertEquals(0, new BigDecimal("7500").compareTo(result.expense()));
        assertEquals(0, new BigDecimal("12500").compareTo(result.difference()));
        assertEquals(1, result.historicalOrdersWithoutApprovalDate());
    }
}
