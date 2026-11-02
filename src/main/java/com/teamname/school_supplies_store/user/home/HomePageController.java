package com.teamname.school_supplies_store.user.home;

import com.teamname.school_supplies_store.user.store.dto.response.StorePageProductResponse;
import com.teamname.school_supplies_store.user.store.service.StorePageService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/home")
public class HomePageController {

    private static final int HOME_PRODUCT_LIMIT = 100;
    private final StorePageService storePageService;

    public HomePageController(StorePageService storePageService) {
        this.storePageService = storePageService;
    }

    @GetMapping("/products")
    public Page<StorePageProductResponse> getHomeProducts() {
        return storePageService.searchStorePageProducts(
                null,
                null,
                null,
                null,
                null,
                Map.of(),
                "popular",
                Sort.Direction.DESC,
                PageRequest.of(0, HOME_PRODUCT_LIMIT));
    }
}
