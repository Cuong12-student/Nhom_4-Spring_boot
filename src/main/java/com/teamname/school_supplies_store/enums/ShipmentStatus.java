package com.teamname.school_supplies_store.enums;

public enum ShipmentStatus {
    PENDING,       // Chờ bàn giao vận chuyển
    PICKED_UP,     // Đơn vị vận chuyển đã nhận hàng
    IN_TRANSIT,    // Đang vận chuyển
    DELIVERED,     // Đã giao thành công
    FAILED,        // Giao hàng thất bại
    RETURNED       // Hàng được hoàn trả
}