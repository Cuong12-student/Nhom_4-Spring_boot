package com.teamname.school_supplies_store.user.service;

import com.teamname.school_supplies_store.user.dto.response.StorePageProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public interface StorePageService {
    Page<StorePageProductResponse> searchStorePageProducts(
            String keyword,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Long productId,
            Long categoryId,
            Map<String, List<String>> attributes,
            String sort,
            Sort.Direction direction,
            Pageable pageable);
}
