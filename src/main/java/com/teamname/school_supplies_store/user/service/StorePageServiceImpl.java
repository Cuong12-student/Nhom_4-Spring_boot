package com.teamname.school_supplies_store.user.service;

import com.teamname.school_supplies_store.entity.Order;
import com.teamname.school_supplies_store.entity.OrderDetail;
import com.teamname.school_supplies_store.entity.ProductVariant;
import com.teamname.school_supplies_store.enums.CategoryStatus;
import com.teamname.school_supplies_store.enums.OrderStatus;
import com.teamname.school_supplies_store.enums.ProductStatus;
import com.teamname.school_supplies_store.user.dto.response.StorePageProductResponse;
import com.teamname.school_supplies_store.user.repository.StorePageProductVariantRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Pattern;

@Service
public class StorePageServiceImpl implements StorePageService {

    private static final Pattern ATTRIBUTE_NAME_PATTERN = Pattern.compile("[A-Za-z0-9_-]+");

    private final StorePageProductVariantRepository storePageProductVariantRepository;

    public StorePageServiceImpl(StorePageProductVariantRepository storePageProductVariantRepository) {
        this.storePageProductVariantRepository = storePageProductVariantRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StorePageProductResponse> searchStorePageProducts(
            String keyword,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Long productId,
            Long categoryId,
            Map<String, List<String>> attributes,
            String sort,
            Sort.Direction direction,
            Pageable pageable) {

        validateFilters(minPrice, maxPrice, productId, categoryId, attributes);
        boolean popularSort = "popular".equalsIgnoreCase(sort);
        Specification<ProductVariant> specification = buildSpecification(
                keyword, minPrice, maxPrice, productId, categoryId, attributes, popularSort, direction);
        Page<ProductVariant> productVariants =
                storePageProductVariantRepository.findAll(specification, pageable);
        return productVariants.map(this::mapToStorePageProductResponse);
    }

    private Specification<ProductVariant> buildSpecification(
            String keyword,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Long productId,
            Long categoryId,
            Map<String, List<String>> attributes,
            boolean popularSort,
            Sort.Direction direction) {
        return (root, query, criteriaBuilder) -> {
            Join<ProductVariant, ?> product = root.join("product", JoinType.INNER);
            Join<?, ?> category = product.join("category", JoinType.INNER);
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(criteriaBuilder.equal(root.get("status"), ProductStatus.ACTIVE));
            predicates.add(criteriaBuilder.equal(product.get("status"), ProductStatus.ACTIVE));
            predicates.add(criteriaBuilder.equal(category.get("status"), CategoryStatus.ACTIVE));

            if (keyword != null && !keyword.isBlank()) {
                String escapedKeyword = escapeLikePattern(keyword.trim().toLowerCase(Locale.ROOT));
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(product.get("name")),
                        "%" + escapedKeyword + "%",
                        '\\'));
            }
            if (minPrice != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice));
            }
            if (productId != null) {
                predicates.add(criteriaBuilder.equal(product.get("idProduct"), productId));
            }
            if (categoryId != null) {
                predicates.add(criteriaBuilder.equal(category.get("idCategory"), categoryId));
            }
            addAttributePredicates(root, criteriaBuilder, predicates, attributes);

            // Chỉ tính số lượng đã bán của đơn COMPLETED để đơn chờ xử lý hoặc bị hủy
            // không làm sai thứ tự phổ biến.
            if (popularSort && query.getResultType() != Long.class) {
                Subquery<Long> soldQuantity = query.subquery(Long.class);
                Root<OrderDetail> orderDetail = soldQuantity.from(OrderDetail.class);
                Join<OrderDetail, Order> order = orderDetail.join("order", JoinType.INNER);
                soldQuantity.select(criteriaBuilder.coalesce(
                        criteriaBuilder.sum(orderDetail.<Integer>get("quantity")).as(Long.class),
                        0L));
                soldQuantity.where(
                        criteriaBuilder.equal(orderDetail.get("variant"), root),
                        criteriaBuilder.equal(order.get("status"), OrderStatus.COMPLETED));

                query.orderBy(
                        direction == Sort.Direction.ASC
                                ? criteriaBuilder.asc(soldQuantity)
                                : criteriaBuilder.desc(soldQuantity),
                        criteriaBuilder.desc(root.get("createdAt")),
                        criteriaBuilder.desc(root.get("idVariant")));
            }

            return criteriaBuilder.and(predicates.toArray(Predicate[]::new));
        };
    }

    private void addAttributePredicates(
            Root<ProductVariant> root,
            CriteriaBuilder criteriaBuilder,
            List<Predicate> predicates,
            Map<String, List<String>> attributes) {
        attributes.forEach((attributeName, values) -> {
            if (attributeName == null || !ATTRIBUTE_NAME_PATTERN.matcher(attributeName).matches()) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Tên thuộc tính chỉ được chứa chữ cái, chữ số, dấu gạch dưới và dấu gạch ngang");
            }

            List<String> nonBlankValues = values == null ? List.of() : values.stream()
                    .filter(value -> value != null && !value.isBlank())
                    .map(value -> value.trim().toLowerCase(Locale.ROOT))
                    .toList();
            if (nonBlankValues.isEmpty()) {
                return;
            }

            // Kiểm tra khóa trước khi ghép vào JSON path của MySQL để tránh nhận
            // cú pháp path tùy ý từ query string.
            var jsonValue = criteriaBuilder.function(
                    "JSON_UNQUOTE",
                    String.class,
                    criteriaBuilder.function(
                            "JSON_EXTRACT",
                            String.class,
                            root.get("attributes"),
                            criteriaBuilder.literal("$." + attributeName)));
            predicates.add(criteriaBuilder.lower(jsonValue).in(nonBlankValues));
        });
    }

    private void validateFilters(
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Long productId,
            Long categoryId,
            Map<String, List<String>> attributes) {
        if ((minPrice != null && minPrice.signum() < 0)
                || (maxPrice != null && maxPrice.signum() < 0)
                || (minPrice != null && maxPrice != null && minPrice.compareTo(maxPrice) > 0)
                || (productId != null && productId < 1)
                || (categoryId != null && categoryId < 1)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Giá lọc phải không âm và minPrice không được lớn hơn maxPrice; productId/categoryId phải dương");
        }
        if (attributes == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bộ lọc thuộc tính không được null");
        }
    }

    private String escapeLikePattern(String value) {
        return value.replace("\\", "\\\\")
                .replace("%", "\\%")
                .replace("_", "\\_");
    }

    private StorePageProductResponse mapToStorePageProductResponse(ProductVariant productVariant) {
        var product = productVariant.getProduct();
        return new StorePageProductResponse(
                productVariant.getIdVariant(),
                product.getName(),
                productVariant.getImage() != null ? productVariant.getImage() : product.getMainImage(),
                product.getCategory().getName(),
                productVariant.getPrice(),
                product.getSlug(),
                productVariant.getSku(),
                productVariant.getStatus());
    }
}