package com.teamname.school_supplies_store.staff.inventory.controller;

import com.teamname.school_supplies_store.staff.inventory.dto.ReceiptInput;
import com.teamname.school_supplies_store.staff.inventory.dto.ReceiptView;
import com.teamname.school_supplies_store.staff.inventory.dto.VariantView;
import com.teamname.school_supplies_store.staff.inventory.service.StaffInventoryService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** API quản lý tồn kho và phiếu nhập của nhân viên. */
@RestController
@RequestMapping("/api/v1/staff")
public class StaffInventoryController {
    private final StaffInventoryService staffInventoryService;

    public StaffInventoryController(StaffInventoryService staffInventoryService) {
        this.staffInventoryService = staffInventoryService;
    }

    /** Danh sách sản phẩm và biến thể có thể theo dõi tồn kho. */
    @GetMapping("/variants")
    public List<VariantView> variants(
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        return staffInventoryService.listVariants(authorization);
    }

    /** Tạo phiếu nhập và cộng số lượng vào kho. */
    @PostMapping("/receipts")
    public ReceiptView receive(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @Valid @RequestBody ReceiptInput input) {
        return staffInventoryService.receive(authorization, input);
    }
}
