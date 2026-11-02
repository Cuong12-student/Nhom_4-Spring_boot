package com.teamname.school_supplies_store.user.cart.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CartItemRequest(
        @NotNull Long variantId,
        @Min(1) @Max(99) int quantity) {
}
