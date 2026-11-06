package com.teamname.school_supplies_store.admin;

import tools.jackson.core.JacksonException;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import com.teamname.school_supplies_store.admin.dto.AdminDtos.*;
import com.teamname.school_supplies_store.entity.*;
import com.teamname.school_supplies_store.enums.CategoryStatus;
import com.teamname.school_supplies_store.enums.OrderStatus;
import com.teamname.school_supplies_store.enums.ProductStatus;
import com.teamname.school_supplies_store.enums.Role;
import com.teamname.school_supplies_store.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class AdminService {

    private final ProductRepository products;
    private final ProductVariantRepository variants;
    private final CategoryRepository categories;
    private final InventoryRepository inventories;
    private final StaffRepository staffs;
    private final CustomerRepository customers;
    private final OrderRepository orders;
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;

    public AdminService(
            ProductRepository products,
            ProductVariantRepository variants,
            CategoryRepository categories,
            InventoryRepository inventories,
            StaffRepository staffs,
            CustomerRepository customers,
            OrderRepository orders,
            UserRepository users,
            PasswordEncoder passwordEncoder,
            ObjectMapper objectMapper) {
        this.products = products;
        this.variants = variants;
        this.categories = categories;
        this.inventories = inventories;
        this.staffs = staffs;
        this.customers = customers;
        this.orders = orders;
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.objectMapper = objectMapper;
    }

    @Transactional(readOnly = true)
    public DashboardResponse dashboard() {
        LocalDateTime from = YearMonth.now().minusMonths(11).atDay(1).atStartOfDay();
        LocalDateTime to = YearMonth.now().plusMonths(1).atDay(1).atStartOfDay();
        List<Object[]> rows = orders.findMonthlyRevenue(OrderStatus.COMPLETED, from, to);
        List<RevenuePoint> revenue = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (int i = 0; i < 12; i++) {
            YearMonth month = YearMonth.now().minusMonths(11 - i);
            BigDecimal amount = rows.stream()
                    .filter(row -> ((Number) row[0]).intValue() == month.getYear()
                            && ((Number) row[1]).intValue() == month.getMonthValue())
                    .map(row -> (BigDecimal) row[2])
                    .findFirst()
                    .orElse(BigDecimal.ZERO);
            revenue.add(new RevenuePoint(month.toString(), amount));
            total = total.add(amount);
        }

        return new DashboardResponse(
                total,
                revenue,
                products.count(),
                staffs.count(),
                customers.count(),
                orders.count());
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> listCategories() {
        return categories.findAll().stream().map(this::toCategoryResponse).toList();
    }

    public CategoryResponse createCategory(CategoryRequest request) {
        String name = request.name().trim();
        if (categories.existsByNameIgnoreCase(name)) {
            throw conflict("Tên danh mục đã tồn tại.");
        }
        Category category = new Category(name, clean(request.description()), CategoryStatus.ACTIVE);
        return toCategoryResponse(categories.save(category));
    }

    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category category = categories.findById(id).orElseThrow(() -> notFound("Không tìm thấy danh mục."));
        String name = request.name().trim();
        if (categories.existsByNameIgnoreCaseAndIdCategoryNot(name, id)) {
            throw conflict("Tên danh mục đã tồn tại.");
        }
        category.setName(name);
        category.setDescription(clean(request.description()));
        if (request.status() != null) {
            category.setStatus(request.status());
        }
        return toCategoryResponse(category);
    }

    public void deactivateCategory(Long id) {
        Category category = categories.findById(id).orElseThrow(() -> notFound("Không tìm thấy danh mục."));
        category.setStatus(CategoryStatus.INACTIVE);
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> listProducts() {
        return products.findAll().stream().map(this::toProductResponse).toList();
    }

    public ProductResponse createProduct(ProductRequest request) {
        String slug = request.slug().trim();
        if (products.existsBySlug(slug)) {
            throw conflict("Slug sản phẩm đã tồn tại.");
        }
        Product product = new Product();
        applyProductRequest(product, request);
        product.setStatus(ProductStatus.ACTIVE);
        return toProductResponse(products.save(product));
    }

    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = products.findById(id).orElseThrow(() -> notFound("Không tìm thấy sản phẩm."));
        validateManageableStatus(request.status());
        String slug = request.slug().trim();
        if (products.existsBySlugAndIdProductNot(slug, id)) {
            throw conflict("Slug sản phẩm đã tồn tại.");
        }
        applyProductRequest(product, request);
        if (request.status() != null) {
            product.setStatus(request.status());
        }
        return toProductResponse(product);
    }

    public void deactivateProduct(Long id) {
        Product product = products.findById(id).orElseThrow(() -> notFound("Không tìm thấy sản phẩm."));
        product.setStatus(ProductStatus.INACTIVE);
    }

    public VariantResponse createVariant(Long productId, VariantRequest request) {
        Product product = products.findById(productId).orElseThrow(() -> notFound("Không tìm thấy sản phẩm."));
        ensureSkuAvailable(request.sku(), null);
        ProductVariant variant = new ProductVariant();
        applyVariantRequest(variant, request);
        variant.setProduct(product);
        variant.setStatus(ProductStatus.ACTIVE);
        variant.setInventory(new Inventory(request.quantity()));
        return toVariantResponse(variants.save(variant));
    }

    public VariantResponse updateVariant(Long productId, Long variantId, VariantRequest request) {
        ProductVariant variant = variants.findById(variantId).orElseThrow(() -> notFound("Không tìm thấy biến thể."));
        validateManageableStatus(request.status());
        if (!variant.getProduct().getIdProduct().equals(productId)) {
            throw notFound("Biến thể không thuộc sản phẩm này.");
        }
        ensureSkuAvailable(request.sku(), variantId);
        applyVariantRequest(variant, request);
        if (variant.getInventory() == null) {
            variant.setInventory(new Inventory(request.quantity()));
        } else {
            variant.getInventory().setQuantity(request.quantity());
        }
        if (request.status() != null) {
            variant.setStatus(request.status());
        }
        return toVariantResponse(variant);
    }

    public void deactivateVariant(Long productId, Long variantId) {
        ProductVariant variant = variants.findById(variantId).orElseThrow(() -> notFound("Không tìm thấy biến thể."));
        if (!variant.getProduct().getIdProduct().equals(productId)) {
            throw notFound("Biến thể không thuộc sản phẩm này.");
        }
        variant.setStatus(ProductStatus.INACTIVE);
    }

    @Transactional(readOnly = true)
    public List<StaffResponse> listStaff() {
        return staffs.findAll().stream().map(this::toStaffResponse).toList();
    }

    public StaffResponse createStaff(StaffCreateRequest request) {
        if (users.existsByUsername(request.username().trim())) {
            throw conflict("Tên đăng nhập đã tồn tại.");
        }
        ensureStaffContactAvailable(request.phone(), request.email(), null);

        User user = new User(request.username().trim(), passwordEncoder.encode(request.password()), Role.STAFF);
        user.setEnabled(true);
        users.save(user);

        Staff staff = new Staff(
                request.name().trim(),
                request.age(),
                request.gender(),
                request.phone().trim(),
                request.email().trim(),
                request.address().trim());
        staff.setUser(user);
        return toStaffResponse(staffs.save(staff));
    }

    public StaffResponse updateStaff(Integer id, StaffUpdateRequest request) {
        Staff staff = staffs.findById(id).orElseThrow(() -> notFound("Không tìm thấy nhân viên."));
        User user = staff.getUser();
        String username = request.username().trim();
        if (!user.getUsername().equals(username) && users.existsByUsername(username)) {
            throw conflict("Tên đăng nhập đã tồn tại.");
        }
        ensureStaffContactAvailable(request.phone(), request.email(), id);

        staff.setName(request.name().trim());
        staff.setAge(request.age());
        staff.setGender(request.gender());
        staff.setPhone(request.phone().trim());
        staff.setEmail(request.email().trim());
        staff.setAddress(request.address().trim());
        user.setUsername(username);
        if (request.password() != null && !request.password().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.password()));
        }
        if (request.active() != null) {
            user.setEnabled(request.active());
        }
        return toStaffResponse(staff);
    }

    public StaffResponse deactivateStaff(Integer id) {
        Staff staff = staffs.findById(id).orElseThrow(() -> notFound("Không tìm thấy nhân viên."));
        staff.getUser().setEnabled(false);
        return toStaffResponse(staff);
    }

    @Transactional(readOnly = true)
    public List<AdminOrderResponse> listOrders() {
        return orders.findAllWithDetails().stream().map(this::toOrderResponse).toList();
    }

    private void applyProductRequest(Product product, ProductRequest request) {
        Category category = categories.findById(request.categoryId())
                .orElseThrow(() -> notFound("Không tìm thấy danh mục."));
        if (category.getStatus() != CategoryStatus.ACTIVE) {
            throw conflict("Không thể gán sản phẩm vào danh mục đã ngừng hoạt động.");
        }
        product.setName(request.name().trim());
        product.setSlug(request.slug().trim());
        product.setDescription(clean(request.description()));
        product.setMainImage(clean(request.mainImage()));
        product.setCategory(category);
    }

    private void applyVariantRequest(ProductVariant variant, VariantRequest request) {
        variant.setSku(request.sku().trim());
        variant.setPrice(request.price());
        variant.setImage(clean(request.image()));
        variant.setAttributes(validateAttributes(request.attributes()));
    }

    private void validateManageableStatus(ProductStatus status) {
        if (status != null && status != ProductStatus.ACTIVE && status != ProductStatus.INACTIVE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Trạng thái chỉ được là ACTIVE hoặc INACTIVE.");
        }
    }

    private String validateAttributes(String attributes) {
        String value = clean(attributes);
        if (value == null) {
            return null;
        }
        try {
            JsonNode json = objectMapper.readTree(value);
            if (!json.isObject()) {
                throw new IllegalArgumentException();
            }
            return objectMapper.writeValueAsString(json);
        } catch (JacksonException | IllegalArgumentException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thuộc tính phải là JSON hợp lệ dạng object.");
        }
    }

    private void ensureSkuAvailable(String sku, Long currentVariantId) {
        variants.findBySku(sku.trim()).ifPresent(existing -> {
            if (!existing.getIdVariant().equals(currentVariantId)) {
                throw conflict("Mã SKU đã tồn tại.");
            }
        });
    }

    private void ensureStaffContactAvailable(String phone, String email, Integer currentStaffId) {
        staffs.findByPhone(phone.trim()).ifPresent(existing -> {
            if (!existing.getIdStaff().equals(currentStaffId)) {
                throw conflict("Số điện thoại đã được sử dụng.");
            }
        });
        staffs.findByEmail(email.trim()).ifPresent(existing -> {
            if (!existing.getIdStaff().equals(currentStaffId)) {
                throw conflict("Email đã được sử dụng.");
            }
        });
    }

    private CategoryResponse toCategoryResponse(Category category) {
        return new CategoryResponse(
                category.getIdCategory(), category.getName(), category.getDescription(), category.getStatus().name());
    }

    private ProductResponse toProductResponse(Product product) {
        List<VariantResponse> variantResponses = product.getVariants().stream().map(this::toVariantResponse).toList();
        return new ProductResponse(
                product.getIdProduct(),
                product.getName(),
                product.getSlug(),
                product.getDescription(),
                product.getMainImage(),
                product.getCategory().getIdCategory(),
                product.getCategory().getName(),
                product.getStatus(),
                variantResponses);
    }

    private VariantResponse toVariantResponse(ProductVariant variant) {
        Inventory inventory = variant.getInventory();
        if (inventory == null) {
            inventory = inventories.findByVariant_IdVariant(variant.getIdVariant()).orElse(null);
        }
        return new VariantResponse(
                variant.getIdVariant(),
                variant.getSku(),
                variant.getPrice(),
                variant.getImage(),
                variant.getAttributes(),
                inventory == null ? 0 : inventory.getQuantity(),
                variant.getStatus());
    }

    private StaffResponse toStaffResponse(Staff staff) {
        return new StaffResponse(
                staff.getIdStaff(),
                staff.getName(),
                staff.getAge(),
                staff.getGender(),
                staff.getPhone(),
                staff.getEmail(),
                staff.getAddress(),
                staff.getUser().getUsername(),
                Boolean.TRUE.equals(staff.getUser().getEnabled()));
    }

    private AdminOrderResponse toOrderResponse(Order order) {
        Customer customer = order.getCustomer();
        List<OrderLineResponse> items = order.getDetail() == null
                ? List.of()
                : order.getDetail().stream()
                        .map(detail -> {
                            ProductVariant variant = detail.getVariant();
                            return new OrderLineResponse(
                                    variant == null ? null : variant.getSku(),
                                    variant == null || variant.getProduct() == null
                                            ? null
                                            : variant.getProduct().getName(),
                                    detail.getQuantity(),
                                    detail.getPrice());
                        })
                        .toList();
        return new AdminOrderResponse(
                order.getId(),
                order.getOrderDate(),
                order.getTotalAmount(),
                order.getStatus(),
                customer == null ? null : customer.getName(),
                customer == null ? null : customer.getAge(),
                customer == null ? null : customer.getGender(),
                customer == null ? null : customer.getPhone(),
                customer == null ? null : customer.getEmail(),
                customer == null ? null : customer.getAddress(),
                items);
    }

    private String clean(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }

    private ResponseStatusException notFound(String message) {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, message);
    }

    private ResponseStatusException conflict(String message) {
        return new ResponseStatusException(HttpStatus.CONFLICT, message);
    }
}
