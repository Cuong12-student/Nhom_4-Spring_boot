package com.teamname.school_supplies_store.user.cart.service;

import com.teamname.school_supplies_store.entity.Cart;
import com.teamname.school_supplies_store.entity.CartItem;
import com.teamname.school_supplies_store.entity.Customer;
import com.teamname.school_supplies_store.entity.Inventory;
import com.teamname.school_supplies_store.entity.Order;
import com.teamname.school_supplies_store.entity.OrderDetail;
import com.teamname.school_supplies_store.entity.ProductVariant;
import com.teamname.school_supplies_store.enums.CategoryStatus;
import com.teamname.school_supplies_store.enums.OrderStatus;
import com.teamname.school_supplies_store.enums.ProductStatus;
import com.teamname.school_supplies_store.repository.CartItemRepository;
import com.teamname.school_supplies_store.repository.CartRepository;
import com.teamname.school_supplies_store.repository.CustomerRepository;
import com.teamname.school_supplies_store.repository.OrderDetailRepository;
import com.teamname.school_supplies_store.repository.OrderRepository;
import com.teamname.school_supplies_store.repository.ProductVariantRepository;
import com.teamname.school_supplies_store.user.cart.dto.CartItemResponse;
import com.teamname.school_supplies_store.user.cart.dto.CartResponse;
import com.teamname.school_supplies_store.user.cart.dto.CustomerProfileResponse;
import com.teamname.school_supplies_store.user.cart.dto.OrderHistoryResponse;
import com.teamname.school_supplies_store.user.cart.dto.OrderLineResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final CustomerRepository customerRepository;
    private final ProductVariantRepository productVariantRepository;
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;

    public CartService(
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            CustomerRepository customerRepository,
            ProductVariantRepository productVariantRepository,
            OrderRepository orderRepository,
            OrderDetailRepository orderDetailRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.customerRepository = customerRepository;
        this.productVariantRepository = productVariantRepository;
        this.orderRepository = orderRepository;
        this.orderDetailRepository = orderDetailRepository;
    }

    @Transactional(readOnly = true)
    public CartResponse getCart(String username) {
        Customer customer = findCustomer(username);
        return cartRepository.findByCustomer_IdCustomer(customer.getId())
                .map(this::toCartResponse)
                .orElseGet(() -> new CartResponse(List.of(), 0, BigDecimal.ZERO));
    }

    @Transactional
    public CartResponse addItem(String username, Long variantId, int quantity) {
        Customer customer = findCustomer(username);
        ProductVariant variant = findPurchasableVariant(variantId);
        Cart cart = getOrCreateCart(customer);
        List<CartItem> items = cartItemRepository.findByCart_IdCart(cart.getId());
        CartItem existing = items.stream()
                .filter(item -> item.getVariant().getIdVariant().equals(variantId))
                .findFirst()
                .orElse(null);
        int nextQuantity = quantity + (existing == null ? 0 : existing.getQuantity());
        ensureStock(variant, nextQuantity);

        if (existing == null) {
            existing = new CartItem(nextQuantity, variant.getPrice());
            existing.setCart(cart);
            existing.setVariant(variant);
        } else {
            existing.setQuantity(nextQuantity);
            existing.setPrice(variant.getPrice());
        }
        cartItemRepository.save(existing);
        return toCartResponse(cart);
    }

    @Transactional
    public CartResponse updateItem(String username, Integer itemId, int quantity) {
        Cart cart = findCustomerCart(username);
        CartItem item = findCartItem(cart, itemId);
        ensureStock(item.getVariant(), quantity);
        item.setQuantity(quantity);
        item.setPrice(item.getVariant().getPrice());
        cartItemRepository.save(item);
        return toCartResponse(cart);
    }

    @Transactional
    public CartResponse removeItem(String username, Integer itemId) {
        Cart cart = findCustomerCart(username);
        cartItemRepository.delete(findCartItem(cart, itemId));
        return toCartResponse(cart);
    }

    @Transactional
    public OrderHistoryResponse checkout(String username, List<Integer> itemIds) {
        Cart cart = findCustomerCart(username);
        Set<Integer> selectedIds = new HashSet<>(itemIds);
        if (selectedIds.size() != itemIds.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Sản phẩm được chọn bị trùng.");
        }

        List<CartItem> selectedItems = cartItemRepository.findByCart_IdCart(cart.getId()).stream()
                .filter(item -> selectedIds.contains(item.getId()))
                .toList();
        if (selectedItems.size() != selectedIds.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Một số sản phẩm không còn trong giỏ hàng.");
        }

        BigDecimal total = BigDecimal.ZERO;
        List<OrderDetail> orderDetails = new ArrayList<>();
        for (CartItem cartItem : selectedItems) {
            ProductVariant variant = findPurchasableVariant(cartItem.getVariant().getIdVariant());
            ensureStock(variant, cartItem.getQuantity());
            Inventory inventory = variant.getInventory();
            inventory.setQuantity(inventory.getQuantity() - cartItem.getQuantity());

            BigDecimal lineTotal = cartItem.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            total = total.add(lineTotal);
            OrderDetail detail = new OrderDetail(cartItem.getQuantity(), cartItem.getPrice());
            detail.setVariant(variant);
            orderDetails.add(detail);
        }

        Order order = new Order(LocalDateTime.now(), total, OrderStatus.PENDING);
        order.setCustomer(cart.getCustomer());
        orderRepository.save(order);
        orderDetails.forEach(detail -> detail.setOrder(order));
        orderDetailRepository.saveAll(orderDetails);
        cartItemRepository.deleteAll(selectedItems);
        return toOrderResponse(order, orderDetails);
    }

    @Transactional(readOnly = true)
    public CustomerProfileResponse getProfile(String username) {
        Customer customer = findCustomer(username);
        return new CustomerProfileResponse(
                customer.getId(),
                customer.getUser().getUsername(),
                customer.getName(),
                customer.getAge(),
                customer.getGender().name(),
                customer.getPhone(),
                customer.getEmail(),
                customer.getAddress());
    }

    @Transactional(readOnly = true)
    public List<OrderHistoryResponse> getOrderHistory(String username) {
        Customer customer = findCustomer(username);
        return orderRepository.findByCustomer_IdCustomer(customer.getId()).stream()
                .sorted((first, second) -> second.getOrderDate().compareTo(first.getOrderDate()))
                .map(order -> toOrderResponse(
                        order, orderDetailRepository.findByOrder_IdOrder(order.getId())))
                .toList();
    }

    private Customer findCustomer(String username) {
        return customerRepository.findByUser_Username(username)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Không tìm thấy tài khoản khách hàng."));
    }

    private Cart findCustomerCart(String username) {
        Customer customer = findCustomer(username);
        return cartRepository.findByCustomer_IdCustomer(customer.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Giỏ hàng hiện đang trống."));
    }

    private Cart getOrCreateCart(Customer customer) {
        return cartRepository.findByCustomer_IdCustomer(customer.getId()).orElseGet(() -> {
            LocalDateTime now = LocalDateTime.now();
            Cart cart = new Cart(now, now);
            cart.setCustomer(customer);
            customer.setCart(cart);
            return cartRepository.save(cart);
        });
    }

    private CartItem findCartItem(Cart cart, Integer itemId) {
        return cartItemRepository.findByCart_IdCart(cart.getId()).stream()
                .filter(item -> item.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm trong giỏ hàng."));
    }

    private ProductVariant findPurchasableVariant(Long variantId) {
        ProductVariant variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm."));
        if (variant.getStatus() != ProductStatus.ACTIVE
                || variant.getProduct().getStatus() != ProductStatus.ACTIVE
                || variant.getProduct().getCategory().getStatus() != CategoryStatus.ACTIVE) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Sản phẩm hiện không được bày bán.");
        }
        return variant;
    }

    private void ensureStock(ProductVariant variant, int quantity) {
        Inventory inventory = variant.getInventory();
        int available = inventory == null || inventory.getQuantity() == null
                ? 0
                : inventory.getQuantity();
        if (quantity > available) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Số lượng trong kho không đủ. Hiện còn " + available + " sản phẩm.");
        }
    }

    private CartResponse toCartResponse(Cart cart) {
        List<CartItem> items = cartItemRepository.findByCart_IdCart(cart.getId());
        List<CartItemResponse> responses = items.stream().map(this::toCartItemResponse).toList();
        int totalQuantity = items.stream().mapToInt(CartItem::getQuantity).sum();
        BigDecimal total = responses.stream()
                .map(CartItemResponse::lineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return new CartResponse(responses, totalQuantity, total);
    }

    private CartItemResponse toCartItemResponse(CartItem item) {
        ProductVariant variant = item.getVariant();
        var product = variant.getProduct();
        Inventory inventory = variant.getInventory();
        int available = inventory == null || inventory.getQuantity() == null ? 0 : inventory.getQuantity();
        BigDecimal lineTotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
        return new CartItemResponse(
                item.getId(),
                variant.getIdVariant(),
                product.getName(),
                product.getSlug(),
                variant.getSku(),
                product.getCategory().getName(),
                variant.getImage() == null ? product.getMainImage() : variant.getImage(),
                item.getPrice(),
                item.getQuantity(),
                lineTotal,
                available);
    }

    private OrderHistoryResponse toOrderResponse(Order order, List<OrderDetail> details) {
        List<OrderLineResponse> lines = details.stream().map(detail -> {
            ProductVariant variant = detail.getVariant();
            BigDecimal lineTotal = detail.getPrice().multiply(BigDecimal.valueOf(detail.getQuantity()));
            return new OrderLineResponse(
                    variant.getProduct().getName(),
                    variant.getSku(),
                    detail.getQuantity(),
                    detail.getPrice(),
                    lineTotal);
        }).toList();
        return new OrderHistoryResponse(
                order.getId(),
                order.getOrderDate(),
                order.getTotalAmount(),
                order.getStatus().name(),
                lines);
    }
}
