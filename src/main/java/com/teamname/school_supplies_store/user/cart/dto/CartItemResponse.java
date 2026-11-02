package com.teamname.school_supplies_store.user.cart.dto;

import java.math.BigDecimal;

public record CartItemResponse(
        Integer idCartItem,
        Long idVariant,
        String productName,
        String slug,
        String sku,
        String categoryName,
        String image,
        BigDecimal price,
        int quantity,
        BigDecimal lineTotal,
        Integer availableQuantity) {
}
