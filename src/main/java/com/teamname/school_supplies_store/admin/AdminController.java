package com.teamname.school_supplies_store.admin;

import com.teamname.school_supplies_store.admin.dto.AdminDtos.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService service;

    public AdminController(AdminService service) {
        this.service = service;
    }

    @GetMapping("/dashboard")
    public DashboardResponse dashboard() {
        return service.dashboard();
    }

    @GetMapping("/categories")
    public List<CategoryResponse> categories() {
        return service.listCategories();
    }

    @PostMapping("/categories")
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryResponse createCategory(@Valid @RequestBody CategoryRequest request) {
        return service.createCategory(request);
    }

    @PutMapping("/categories/{id}")
    public CategoryResponse updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryRequest request) {
        return service.updateCategory(id, request);
    }

    @DeleteMapping("/categories/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deactivateCategory(@PathVariable Long id) {
        service.deactivateCategory(id);
    }

    @GetMapping("/products")
    public List<ProductResponse> products() {
        return service.listProducts();
    }

    @PostMapping("/products")
    @ResponseStatus(HttpStatus.CREATED)
    public ProductResponse createProduct(@Valid @RequestBody ProductRequest request) {
        return service.createProduct(request);
    }

    @PutMapping("/products/{id}")
    public ProductResponse updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        return service.updateProduct(id, request);
    }

    @DeleteMapping("/products/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deactivateProduct(@PathVariable Long id) {
        service.deactivateProduct(id);
    }

    @PostMapping("/products/{productId}/variants")
    @ResponseStatus(HttpStatus.CREATED)
    public VariantResponse createVariant(
            @PathVariable Long productId, @Valid @RequestBody VariantRequest request) {
        return service.createVariant(productId, request);
    }

    @PutMapping("/products/{productId}/variants/{variantId}")
    public VariantResponse updateVariant(
            @PathVariable Long productId,
            @PathVariable Long variantId,
            @Valid @RequestBody VariantRequest request) {
        return service.updateVariant(productId, variantId, request);
    }

    @DeleteMapping("/products/{productId}/variants/{variantId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deactivateVariant(@PathVariable Long productId, @PathVariable Long variantId) {
        service.deactivateVariant(productId, variantId);
    }

    @GetMapping("/orders")
    public List<AdminOrderResponse> orders() {
        return service.listOrders();
    }

    @GetMapping("/staff")
    public List<StaffResponse> staff() {
        return service.listStaff();
    }

    @PostMapping("/staff")
    @ResponseStatus(HttpStatus.CREATED)
    public StaffResponse createStaff(@Valid @RequestBody StaffCreateRequest request) {
        return service.createStaff(request);
    }

    @PutMapping("/staff/{id}")
    public StaffResponse updateStaff(
            @PathVariable Integer id, @Valid @RequestBody StaffUpdateRequest request) {
        return service.updateStaff(id, request);
    }

    @DeleteMapping("/staff/{id}")
    public StaffResponse deactivateStaff(@PathVariable Integer id) {
        return service.deactivateStaff(id);
    }
}
