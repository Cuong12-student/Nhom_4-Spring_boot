package com.teamname.school_supplies_store.user.dto.response;

import java.math.BigDecimal;

import com.teamname.school_supplies_store.enums.ProductStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductSummaryResponse {
    private Long idProduct;
    private String name;
    private String mainImage;
    private String categoryName;
    private BigDecimal price;
    private String slug;
    private ProductStatus status;
}