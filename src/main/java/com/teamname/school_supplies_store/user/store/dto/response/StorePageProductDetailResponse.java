package com.teamname.school_supplies_store.user.store.dto.response;

import com.teamname.school_supplies_store.enums.CategoryStatus;
import com.teamname.school_supplies_store.enums.ProductStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record StorePageProductDetailResponse(
        Long idVariant,
        Long idProduct,
        Long idCategory,
        String name,
        String slug,
        String description,
        String mainImage,
        String variantImage,
        String categoryName,
        String categoryDescription,
        BigDecimal price,
        String sku,
        String attributes,
        ProductStatus variantStatus,
        ProductStatus productStatus,
        CategoryStatus categoryStatus,
        Long idInventory,
        Integer inventoryQuantity,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        LocalDateTime productCreatedAt,
        LocalDateTime productUpdatedAt,
        LocalDateTime categoryCreatedAt,
        LocalDateTime categoryUpdatedAt,
        LocalDateTime inventoryCreatedAt,
        LocalDateTime inventoryUpdatedAt) {
}
