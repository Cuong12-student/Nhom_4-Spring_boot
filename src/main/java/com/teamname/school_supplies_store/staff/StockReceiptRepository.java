package com.teamname.school_supplies_store.staff;

import com.teamname.school_supplies_store.entity.StockReceipt;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockReceiptRepository extends JpaRepository<StockReceipt, Long> {}
