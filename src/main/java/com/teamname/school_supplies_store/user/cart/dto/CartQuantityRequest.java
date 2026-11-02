package com.teamname.school_supplies_store.user.cart.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public record CartQuantityRequest(
        @Min(1) @Max(99) int quantity) {
}
