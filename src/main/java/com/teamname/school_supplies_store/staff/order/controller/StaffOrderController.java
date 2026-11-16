package com.teamname.school_supplies_store.staff.order.controller;

import com.teamname.school_supplies_store.staff.order.dto.OrderView;
import com.teamname.school_supplies_store.staff.order.service.StaffOrderService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** Các API để nhân viên theo dõi và xử lý đơn hàng. */
@RestController
@RequestMapping("/api/v1/staff/orders")
public class StaffOrderController {
    private final StaffOrderService staffOrderService;

    public StaffOrderController(StaffOrderService staffOrderService) {
        this.staffOrderService = staffOrderService;
    }

    /** Trả về toàn bộ đơn hàng kèm chi tiết sản phẩm. */
    @GetMapping
    public List<OrderView> orders(
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        return staffOrderService.listOrders(authorization);
    }

    /** Duyệt đơn hàng đang chờ xử lý. */
    @PostMapping("/{id}/approve")
    public OrderView approve(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable Integer id) {
        return staffOrderService.decide(authorization, id, true);
    }

    /** Hủy đơn hàng đang chờ và hoàn lại số lượng vào kho. */
    @PostMapping("/{id}/cancel")
    public OrderView cancel(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable Integer id) {
        return staffOrderService.decide(authorization, id, false);
    }
}
