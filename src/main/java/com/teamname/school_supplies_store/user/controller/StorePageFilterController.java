package com.teamname.school_supplies_store.user.controller;

import com.teamname.school_supplies_store.user.dto.response.StorePageFilterResponse;
import com.teamname.school_supplies_store.user.service.StorePageFilterService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/store-page/filters")
public class StorePageFilterController {

    private final StorePageFilterService storePageFilterService;

    public StorePageFilterController(StorePageFilterService storePageFilterService) {
        this.storePageFilterService = storePageFilterService;
    }

    /** Danh mục, sản phẩm, thuộc tính biến thể và khoảng giá để dựng bộ lọc ở frontend. */
    @GetMapping
    public ResponseEntity<StorePageFilterResponse> getFilterOptions() {
        return ResponseEntity.ok(storePageFilterService.getFilterOptions());
    }
}
