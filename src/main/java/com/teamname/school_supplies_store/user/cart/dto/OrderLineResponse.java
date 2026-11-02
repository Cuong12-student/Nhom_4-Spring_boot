package com.teamname.school_supplies_store.user.cart.dto;

import java.math.BigDecimal;

public record OrderLineResponse(
        String productName,
        String sku,
        int quantity,
        BigDecimal price,
        BigDecimal lineTotal) {
}
