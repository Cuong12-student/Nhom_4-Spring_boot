package com.teamname.school_supplies_store.user.store.service;

import com.teamname.school_supplies_store.user.store.dto.response.StorePageProductResponse;
import com.teamname.school_supplies_store.user.store.dto.response.StorePageProductDetailResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public interface StorePageService {
    StorePageProductDetailResponse getStoreProductDetail(Long variantId);

    StorePageProductDetailResponse getStoreProductDetail(String slug, String sku);

    Page<StorePageProductResponse> searchStorePageProducts(
            String keyword,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            List<Long> productIds,
            List<Long> categoryIds,
            Map<String, List<String>> attributes,
            String sort,
            Sort.Direction direction,
            Pageable pageable);
}
