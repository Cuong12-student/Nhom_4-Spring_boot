package com.teamname.school_supplies_store.staff.inventory.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

/** Dữ liệu phiếu nhập kho gồm các dòng sản phẩm hợp lệ. */
public record ReceiptInput(
        @NotEmpty @Size(max = 100) List<@NotNull @Valid ReceiptLineInput> lines) {
}
