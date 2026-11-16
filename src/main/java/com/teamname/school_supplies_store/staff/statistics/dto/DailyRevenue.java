package com.teamname.school_supplies_store.staff.statistics.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/** Doanh thu và số đơn đã duyệt trong một ngày. */
public record DailyRevenue(LocalDate date, long orderCount, BigDecimal revenue) {
}
