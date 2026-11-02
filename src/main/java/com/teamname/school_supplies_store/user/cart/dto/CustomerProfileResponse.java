package com.teamname.school_supplies_store.user.cart.dto;

public record CustomerProfileResponse(
        Integer idCustomer,
        String username,
        String name,
        Integer age,
        String gender,
        String phone,
        String email,
        String address) {
}
