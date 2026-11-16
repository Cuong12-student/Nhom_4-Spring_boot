package com.teamname.school_supplies_store.staff.order.service;

import com.teamname.school_supplies_store.entity.Customer;
import com.teamname.school_supplies_store.entity.Inventory;
import com.teamname.school_supplies_store.entity.Order;
import com.teamname.school_supplies_store.entity.OrderDetail;
import com.teamname.school_supplies_store.entity.Staff;
import com.teamname.school_supplies_store.enums.OrderStatus;
import com.teamname.school_supplies_store.repository.OrderDetailRepository;
import com.teamname.school_supplies_store.repository.OrderRepository;
import com.teamname.school_supplies_store.staff.order.dto.OrderLine;
import com.teamname.school_supplies_store.staff.order.dto.OrderView;
import com.teamname.school_supplies_store.staff.order.repository.StaffOrderRepository;
import com.teamname.school_supplies_store.staff.service.StaffAccessService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/** Quy tắc nghiệp vụ xem, duyệt và hủy đơn hàng của nhân viên. */
@Service
public class StaffOrderService {
    private final StaffAccessService staffAccess;
    private final OrderRepository orders;
    private final StaffOrderRepository lockedOrders;
    private final OrderDetailRepository details;

    public StaffOrderService(
            StaffAccessService staffAccess,
            OrderRepository orders,
            StaffOrderRepository lockedOrders,
            OrderDetailRepository details) {
        this.staffAccess = staffAccess;
        this.orders = orders;
        this.lockedOrders = lockedOrders;
        this.details = details;
    }

    /** Liệt kê đơn hàng sau khi xác thực quyền nhân viên. */
    @Transactional(readOnly = true)
    public List<OrderView> listOrders(String authorization) {
        staffAccess.requireStaff(authorization);
        return orders.findAllWithDetails().stream().map(this::orderView).toList();
    }

    /**
     * Xử lý đơn đang chờ; khi hủy phải khóa đơn và hoàn lại số lượng kho đúng một lần.
     */
    @Transactional
    public OrderView decide(String authorization, Integer id, boolean approve) {
        Staff employee = staffAccess.requireStaff(authorization);
        Order order = lockedOrders.lockById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng."));

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Chỉ có thể xử lý đơn đang chờ duyệt.");
        }

        List<OrderDetail> orderLines = details.findByOrder_IdOrder(order.getId());
        if (!approve) {
            restoreInventory(orderLines);
        }

        order.setStatus(approve ? OrderStatus.CONFIRMED : OrderStatus.CANCELLED);
        order.setStaff(employee);
        if (approve) {
            order.setApprovedAt(LocalDateTime.now());
        }
        return orderView(order, orderLines);
    }

    private void restoreInventory(List<OrderDetail> orderLines) {
        for (OrderDetail line : orderLines) {
            Inventory inventory = line.getVariant().getInventory();
            if (inventory == null) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Không tìm thấy kho của " + line.getVariant().getSku());
            }
            inventory.setQuantity(addQuantity(inventory.getQuantity(), line.getQuantity()));
        }
    }

    private static int addQuantity(int current, int added) {
        try {
            return Math.addExact(current, added);
        } catch (ArithmeticException ex) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Số lượng tồn kho vượt giới hạn.", ex);
        }
    }

    private OrderView orderView(Order order) {
        return orderView(order, order.getDetail());
    }

    private OrderView orderView(Order order, List<OrderDetail> lines) {
        Customer customer = order.getCustomer();
        return new OrderView(
                order.getId(),
                order.getOrderDate(),
                order.getApprovedAt(),
                order.getStatus().name(),
                customer.getName(),
                customer.getPhone(),
                customer.getAddress(),
                order.getTotalAmount(),
                lines.stream()
                        .map(line -> new OrderLine(
                                line.getVariant().getProduct().getName(),
                                line.getVariant().getSku(),
                                line.getQuantity(),
                                line.getPrice(),
                                line.getPrice().multiply(BigDecimal.valueOf(line.getQuantity()))))
                        .toList());
    }
}
