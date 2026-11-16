package com.teamname.school_supplies_store.staff.inventory.dto;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

/** Dữ liệu một dòng sản phẩm khi nhập kho. */
public record ReceiptLineInput(
        @NotNull Long variantId,
        @Positive int quantity,
        @NotNull @PositiveOrZero @Digits(integer = 13, fraction = 2) BigDecimal unitCost) {
}
