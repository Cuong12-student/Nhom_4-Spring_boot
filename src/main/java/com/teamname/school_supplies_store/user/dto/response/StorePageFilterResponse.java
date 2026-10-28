package com.teamname.school_supplies_store.user.dto.response;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/** Các lựa chọn của bộ lọc trang cửa hàng, lấy trực tiếp từ DB. */
public record StorePageFilterResponse(
        List<CategoryOption> categories,
        List<ProductOption> products,
        Map<String, List<String>> attributes,
        BigDecimal minPrice,
        BigDecimal maxPrice) {

    public record CategoryOption(Long idCategory, String name) {
    }

    public record ProductOption(Long idProduct, String name, Long idCategory) {
    }
}
