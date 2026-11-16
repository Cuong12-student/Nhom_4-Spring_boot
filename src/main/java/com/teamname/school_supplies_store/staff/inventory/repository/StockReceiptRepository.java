package com.teamname.school_supplies_store.staff.inventory.repository;

import com.teamname.school_supplies_store.entity.StockReceipt;
import org.springframework.data.jpa.repository.JpaRepository;

/** Truy cập dữ liệu các phiếu nhập kho. */
public interface StockReceiptRepository extends JpaRepository<StockReceipt, Long> {
}
