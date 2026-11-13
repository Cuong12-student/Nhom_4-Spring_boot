package com.teamname.school_supplies_store.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "stock_receipt_lines")
public class StockReceiptLine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "receipt_id", nullable = false)
    private StockReceipt receipt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_variant", nullable = false)
    private ProductVariant variant;

    @Column(nullable = false)
    private String productName;
    @Column(nullable = false, length = 100)
    private String sku;
    @Column(nullable = false)
    private int quantity;
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal unitCost;
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal lineTotal;

    public Long getId() { return id; }
    public void setReceipt(StockReceipt receipt) { this.receipt = receipt; }
    public ProductVariant getVariant() { return variant; }
    public void setVariant(ProductVariant variant) { this.variant = variant; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public BigDecimal getUnitCost() { return unitCost; }
    public void setUnitCost(BigDecimal unitCost) { this.unitCost = unitCost; }
    public BigDecimal getLineTotal() { return lineTotal; }
    public void setLineTotal(BigDecimal lineTotal) { this.lineTotal = lineTotal; }
}
