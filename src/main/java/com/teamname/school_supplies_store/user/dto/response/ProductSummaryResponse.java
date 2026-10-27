package com.teamname.school_supplies_store.user.dto.response;

import com.teamname.school_supplies_store.enums.ProductStatus;

import java.math.BigDecimal;

public record ProductSummaryResponse(
        Long idVariant,
        String name,
        String mainImage,
        String categoryName,
        BigDecimal price,
        String slug,
        String sku,
        ProductStatus status) {
}