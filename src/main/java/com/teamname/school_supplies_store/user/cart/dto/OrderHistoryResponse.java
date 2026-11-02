package com.teamname.school_supplies_store.user.cart.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderHistoryResponse(
        Integer idOrder,
        LocalDateTime orderDate,
        BigDecimal totalAmount,
        String status,
        List<OrderLineResponse> items) {
}
