package com.teamname.school_supplies_store.staff;

import com.teamname.school_supplies_store.staff.StaffDtos.*;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/staff")
public class StaffController {
    private final StaffService service;

    public StaffController(StaffService service) { this.service = service; }

    @GetMapping("/orders")
    public List<OrderView> orders(@RequestHeader(value = "Authorization", required = false) String authorization) {
        return service.listOrders(authorization);
    }

    @PostMapping("/orders/{id}/approve")
    public OrderView approve(@RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable Integer id) {
        return service.decide(authorization, id, true);
    }

    @PostMapping("/orders/{id}/cancel")
    public OrderView cancel(@RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable Integer id) {
        return service.decide(authorization, id, false);
    }

    @GetMapping("/variants")
    public List<VariantView> variants(@RequestHeader(value = "Authorization", required = false) String authorization) {
        return service.listVariants(authorization);
    }

    @PostMapping("/receipts")
    public ReceiptView receive(@RequestHeader(value = "Authorization", required = false) String authorization,
            @Valid @RequestBody ReceiptInput input) {
        return service.receive(authorization, input);
    }

    @GetMapping("/statistics")
    public Statistics statistics(@RequestHeader(value = "Authorization", required = false) String authorization,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return service.statistics(authorization, from, to);
    }

    @ExceptionHandler(ObjectOptimisticLockingFailureException.class)
    public ResponseEntity<Map<String, String>> conflict(ObjectOptimisticLockingFailureException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", "Tồn kho vừa thay đổi. Vui lòng tải lại và thử lại."));
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> statusError(ResponseStatusException ex) {
        return ResponseEntity.status(ex.getStatusCode()).body(Map.of("message",
                ex.getReason() == null ? "Yêu cầu không thành công." : ex.getReason()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> invalidInput(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getAllErrors().stream()
                .findFirst().map(error -> error.getDefaultMessage())
                .orElse("Dữ liệu không hợp lệ.");
        return ResponseEntity.badRequest().body(Map.of("message", message));
    }
}
