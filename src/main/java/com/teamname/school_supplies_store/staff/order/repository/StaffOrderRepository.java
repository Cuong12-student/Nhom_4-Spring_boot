package com.teamname.school_supplies_store.staff.order.repository;

import com.teamname.school_supplies_store.entity.Order;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

/** Truy vấn đơn hàng cần khóa khi nhân viên duyệt hoặc hủy. */
public interface StaffOrderRepository extends JpaRepository<Order, Integer> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select o from Order o where o.idOrder = :id")
    Optional<Order> lockById(@Param("id") Integer id);
}
