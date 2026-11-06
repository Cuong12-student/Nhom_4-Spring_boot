package com.teamname.school_supplies_store.admin.dto;

import com.teamname.school_supplies_store.enums.Gender;
import com.teamname.school_supplies_store.enums.OrderStatus;
import com.teamname.school_supplies_store.enums.CategoryStatus;
import com.teamname.school_supplies_store.enums.ProductStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public final class AdminDtos {

    private AdminDtos() {}

    public record DashboardResponse(
            BigDecimal totalRevenue,
            List<RevenuePoint> revenueByMonth,
            long productCount,
            long staffCount,
            long customerCount,
            long orderCount) {}

    public record RevenuePoint(String month, BigDecimal revenue) {}

    public record CategoryRequest(
            @NotBlank @Size(max = 100) String name,
            @Size(max = 500) String description,
            CategoryStatus status) {}

    public record CategoryResponse(
            Long idCategory,
            String name,
            String description,
            String status) {}

    public record ProductRequest(
            @NotBlank @Size(max = 255) String name,
            @NotBlank @Size(max = 255) String slug,
            String description,
            @Size(max = 512) String mainImage,
            @NotNull Long categoryId,
            ProductStatus status) {}

    public record VariantRequest(
            @NotBlank @Size(max = 100) String sku,
            @NotNull @PositiveOrZero BigDecimal price,
            @Size(max = 512) String image,
            String attributes,
            @NotNull @PositiveOrZero Integer quantity,
            ProductStatus status) {}

    public record VariantResponse(
            Long idVariant,
            String sku,
            BigDecimal price,
            String image,
            String attributes,
            Integer quantity,
            ProductStatus status) {}

    public record ProductResponse(
            Long idProduct,
            String name,
            String slug,
            String description,
            String mainImage,
            Long categoryId,
            String categoryName,
            ProductStatus status,
            List<VariantResponse> variants) {}

    public record StaffCreateRequest(
            @NotBlank @Size(max = 100) String name,
            @NotNull @Min(1) @Max(120) Integer age,
            @NotNull Gender gender,
            @NotBlank @Pattern(regexp = "^\\d{10}$") String phone,
            @NotBlank @Email @Size(max = 255) String email,
            @NotBlank @Size(max = 255) String address,
            @NotBlank @Pattern(regexp = "^[a-zA-Z0-9_]{8,12}$") String username,
            @NotBlank @Size(min = 8, max = 72) String password) {}

    public record StaffUpdateRequest(
            @NotBlank @Size(max = 100) String name,
            @NotNull @Min(1) @Max(120) Integer age,
            @NotNull Gender gender,
            @NotBlank @Pattern(regexp = "^\\d{10}$") String phone,
            @NotBlank @Email @Size(max = 255) String email,
            @NotBlank @Size(max = 255) String address,
            @NotBlank @Pattern(regexp = "^[a-zA-Z0-9_]{8,12}$") String username,
            @Size(min = 8, max = 72) String password,
            Boolean active) {}

    public record StaffResponse(
            Integer idStaff,
            String name,
            Integer age,
            Gender gender,
            String phone,
            String email,
            String address,
            String username,
            boolean active) {}

    public record OrderLineResponse(
            String sku,
            String productName,
            int quantity,
            BigDecimal price) {}

    public record AdminOrderResponse(
            Integer idOrder,
            LocalDateTime orderDate,
            BigDecimal totalAmount,
            OrderStatus status,
            String customerName,
            Integer customerAge,
            Gender customerGender,
            String customerPhone,
            String customerEmail,
            String customerAddress,
            List<OrderLineResponse> items) {}
}
