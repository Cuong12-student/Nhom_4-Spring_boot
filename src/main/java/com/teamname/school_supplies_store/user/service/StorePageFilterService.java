package com.teamname.school_supplies_store.user.service;

import com.teamname.school_supplies_store.enums.CategoryStatus;
import com.teamname.school_supplies_store.enums.ProductStatus;
import com.teamname.school_supplies_store.user.dto.response.StorePageFilterResponse;
import com.teamname.school_supplies_store.user.repository.StorePageFilterRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.TreeSet;
import java.util.regex.Pattern;

@Service
public class StorePageFilterService {

    // Cùng quy tắc với StorePageServiceImpl: tên thuộc tính ngoài mẫu này sẽ bị từ chối khi lọc.
    private static final Pattern ATTRIBUTE_NAME_PATTERN = Pattern.compile("[A-Za-z0-9_-]+");

    private final StorePageFilterRepository repository;

    public StorePageFilterService(StorePageFilterRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public StorePageFilterResponse getFilterOptions() {
        ProductStatus active = ProductStatus.ACTIVE;
        CategoryStatus categoryActive = CategoryStatus.ACTIVE;

        List<StorePageFilterResponse.CategoryOption> categories =
                repository.findCategoryOptions(active, categoryActive).stream()
                        .map(row -> new StorePageFilterResponse.CategoryOption(
                                ((Number) row[0]).longValue(), (String) row[1]))
                        .toList();

        List<StorePageFilterResponse.ProductOption> products =
                repository.findProductOptions(active, categoryActive).stream()
                        .map(row -> new StorePageFilterResponse.ProductOption(
                                ((Number) row[0]).longValue(), (String) row[1], ((Number) row[2]).longValue()))
                        .toList();

        Map<String, TreeSet<String>> grouped = new TreeMap<>();
        for (Object[] row : repository.findAttributeOptions()) {
            String name = (String) row[0];
            String value = (String) row[1];
            if (name == null || value == null || value.isBlank()
                    || !ATTRIBUTE_NAME_PATTERN.matcher(name).matches()
                    || value.startsWith("{") || value.startsWith("[")) {
                continue;
            }
            grouped.computeIfAbsent(name, key -> new TreeSet<>()).add(value);
        }
        Map<String, List<String>> attributes = new TreeMap<>();
        grouped.forEach((name, values) -> attributes.put(name, List.copyOf(values)));

        return new StorePageFilterResponse(
                categories,
                products,
                attributes,
                repository.findMinPrice(active, categoryActive),
                repository.findMaxPrice(active, categoryActive));
    }
}
