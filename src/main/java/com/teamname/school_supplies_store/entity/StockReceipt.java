package com.teamname.school_supplies_store.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "stock_receipts")
public class StockReceipt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, updatable = false)
    private LocalDateTime receivedAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_staff", nullable = false)
    private Staff staff;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal totalCost;

    @OneToMany(mappedBy = "receipt", cascade = CascadeType.ALL)
    private List<StockReceiptLine> lines = new ArrayList<>();

    public Long getId() { return id; }
    public LocalDateTime getReceivedAt() { return receivedAt; }
    public void setReceivedAt(LocalDateTime receivedAt) { this.receivedAt = receivedAt; }
    public Staff getStaff() { return staff; }
    public void setStaff(Staff staff) { this.staff = staff; }
    public BigDecimal getTotalCost() { return totalCost; }
    public void setTotalCost(BigDecimal totalCost) { this.totalCost = totalCost; }
    public List<StockReceiptLine> getLines() { return lines; }
    public void addLine(StockReceiptLine line) {
        lines.add(line);
        line.setReceipt(this);
    }
}
