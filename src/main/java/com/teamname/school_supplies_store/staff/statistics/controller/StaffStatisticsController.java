package com.teamname.school_supplies_store.staff.statistics.controller;

import com.teamname.school_supplies_store.staff.statistics.dto.Statistics;
import com.teamname.school_supplies_store.staff.statistics.service.StaffStatisticsService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

/** API trả về báo cáo doanh thu và chi phí cho nhân viên. */
@RestController
@RequestMapping("/api/v1/staff/statistics")
public class StaffStatisticsController {
    private final StaffStatisticsService staffStatisticsService;

    public StaffStatisticsController(StaffStatisticsService staffStatisticsService) {
        this.staffStatisticsService = staffStatisticsService;
    }

    /** Lọc báo cáo theo ngày ISO tùy chọn bắt đầu và kết thúc. */
    @GetMapping
    public Statistics statistics(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return staffStatisticsService.statistics(authorization, from, to);
    }
}
