package com.teamname.school_supplies_store.user.controller;

import com.teamname.school_supplies_store.user.dto.response.StorePageProductResponse;
import com.teamname.school_supplies_store.user.service.StorePageService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping({"/api/v1/store-page/products", "/api/v1/products"})
public class StorePageController {

    private static final int MAX_PAGE_SIZE = 100;
    private static final String ATTRIBUTE_PARAMETER_PREFIX = "attribute.";

    private final StorePageService storePageService;

    public StorePageController(StorePageService storePageService) {
        this.storePageService = storePageService;
    }

    /**
     * Trả về danh sách biến thể sản phẩm đang hoạt động theo từng trang.
     *
     * <p>Các bộ lọc được hỗ trợ: {@code q} tìm trong tên sản phẩm;
     * {@code minPrice}/{@code maxPrice} giới hạn giá; {@code productId} và
     * {@code categoryId} lọc theo sản phẩm/danh mục. Thuộc tính biến thể được
     * lọc động theo khóa JSON, ví dụ {@code attribute.Size=M} hoặc
     * {@code attribute.Color=Blue}. Có thể truyền nhiều giá trị cho cùng một
     * thuộc tính; chỉ cần khớp một giá trị, nhưng các thuộc tính khác nhau
     * phải đồng thời khớp.</p>
     *
     * <p>{@code sort} nhận {@code price}, {@code name}, {@code createdAt} hoặc
     * {@code popular}. Độ phổ biến được tính từ tổng số lượng trong đơn hàng
     * đã hoàn thành; đơn đang xử lý hoặc đã hủy không được tính.</p>
     */
    @GetMapping
    public ResponseEntity<Page<StorePageProductResponse>> searchStorePageProducts(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(name = "productId", required = false) List<Long> productIds,
            @RequestParam(name = "categoryId", required = false) List<Long> categoryIds,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "DESC") Sort.Direction direction,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam MultiValueMap<String, String> queryParameters) {

        validatePagination(page, size);
        Map<String, List<String>> attributes = extractAttributes(queryParameters);

        Sort pageableSort = sort.equalsIgnoreCase("popular")
                ? Sort.unsorted()
                : createSort(sort, direction);
        PageRequest pageable = PageRequest.of(page, size, pageableSort);

        return ResponseEntity.ok(storePageService.searchStorePageProducts(
                q, minPrice, maxPrice, productIds, categoryIds, attributes, sort, direction, pageable));
    }

    private void validatePagination(int page, int size) {
        if (page < 0 || size < 1 || size > MAX_PAGE_SIZE) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "page phải lớn hơn hoặc bằng 0 và size phải từ 1 đến " + MAX_PAGE_SIZE);
        }
    }

    private Sort createSort(String sort, Sort.Direction direction) {
        String property = switch (sort.toLowerCase(Locale.ROOT)) {
            case "price" -> "price";
            case "name" -> "product.name";
            case "createdat" -> "createdAt";
            default -> throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "sort chỉ nhận một trong các giá trị: price, name, createdAt, popular");
        };
        return Sort.by(direction, property).and(Sort.by(Sort.Direction.DESC, "idVariant"));
    }

    private Map<String, List<String>> extractAttributes(MultiValueMap<String, String> queryParameters) {
        Map<String, List<String>> attributes = new LinkedHashMap<>();
        queryParameters.forEach((parameterName, values) -> {
            if (parameterName.startsWith(ATTRIBUTE_PARAMETER_PREFIX)) {
                String attributeName = parameterName.substring(ATTRIBUTE_PARAMETER_PREFIX.length());
                if (values != null && !values.isEmpty()) {
                    attributes.put(attributeName, values);
                }
            }
        });
        return attributes;
    }
}