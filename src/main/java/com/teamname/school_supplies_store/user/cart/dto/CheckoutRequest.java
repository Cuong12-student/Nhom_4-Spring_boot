package com.teamname.school_supplies_store.user.cart.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record CheckoutRequest(
        @NotEmpty List<@NotNull Integer> itemIds) {
}
