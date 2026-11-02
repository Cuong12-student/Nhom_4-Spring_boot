package com.teamname.school_supplies_store.user.cart.controller;

import com.teamname.school_supplies_store.user.cart.dto.CartItemRequest;
import com.teamname.school_supplies_store.user.cart.dto.CartQuantityRequest;
import com.teamname.school_supplies_store.user.cart.dto.CartResponse;
import com.teamname.school_supplies_store.user.cart.dto.CheckoutRequest;
import com.teamname.school_supplies_store.user.cart.dto.CustomerProfileResponse;
import com.teamname.school_supplies_store.user.cart.dto.OrderHistoryResponse;
import com.teamname.school_supplies_store.user.cart.service.CartService;
import com.teamname.school_supplies_store.service.CustomerSessionService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class CartController {

    private final CartService cartService;
    private final CustomerSessionService customerSessionService;

    public CartController(CartService cartService, CustomerSessionService customerSessionService) {
        this.cartService = cartService;
        this.customerSessionService = customerSessionService;
    }

    @GetMapping("/cart")
    public CartResponse getCart(@RequestHeader("Authorization") String authorization) {
        return cartService.getCart(customerSessionService.requireUsername(authorization));
    }

    @PostMapping("/cart/items")
    public CartResponse addItem(
            @RequestHeader("Authorization") String authorization,
            @Valid @RequestBody CartItemRequest request) {
        return cartService.addItem(
                customerSessionService.requireUsername(authorization), request.variantId(), request.quantity());
    }

    @PatchMapping("/cart/items/{itemId}")
    public CartResponse updateItem(
            @PathVariable Integer itemId,
            @RequestHeader("Authorization") String authorization,
            @Valid @RequestBody CartQuantityRequest request) {
        return cartService.updateItem(
                customerSessionService.requireUsername(authorization), itemId, request.quantity());
    }

    @DeleteMapping("/cart/items/{itemId}")
    public CartResponse removeItem(
            @PathVariable Integer itemId,
            @RequestHeader("Authorization") String authorization) {
        return cartService.removeItem(customerSessionService.requireUsername(authorization), itemId);
    }

    @PostMapping("/cart/checkout")
    public OrderHistoryResponse checkout(
            @RequestHeader("Authorization") String authorization,
            @Valid @RequestBody CheckoutRequest request) {
        return cartService.checkout(
                customerSessionService.requireUsername(authorization), request.itemIds());
    }

    @GetMapping("/profile")
    public CustomerProfileResponse getProfile(@RequestHeader("Authorization") String authorization) {
        return cartService.getProfile(customerSessionService.requireUsername(authorization));
    }

    @GetMapping("/orders")
    public List<OrderHistoryResponse> getOrderHistory(@RequestHeader("Authorization") String authorization) {
        return cartService.getOrderHistory(customerSessionService.requireUsername(authorization));
    }
}
