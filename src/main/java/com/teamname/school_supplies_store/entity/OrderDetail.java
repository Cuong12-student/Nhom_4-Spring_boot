package com.teamname.school_supplies_store.entity;
import java.math.BigDecimal;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.persistence.Entity; 
import jakarta.persistence.Table;
import jakarta.persistence.Id; 
import jakarta.persistence.GeneratedValue; 
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;  
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
@Entity
@Table(name="orderDetails")
public class OrderDetail{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_detail")
    private Integer id;
    @NotNull(message="Số liệu phải hiển thị")
    @Column(nullable = false)
    private int quantity;
    @NotNull(message="Giá thành phải hiển thị")
    @Positive(message = "Giá sản phẩm phải lớn hơn 0")
    @Column(nullable = false,precision = 12,scale = 0)
    private BigDecimal price;
    @ManyToOne
    @JoinColumn(name="id_variant")
    private ProductVariant variant;
    @ManyToOne
    @JoinColumn(name="id_order")
    private Order order;
    public OrderDetail(){}
    public OrderDetail(int quantity,BigDecimal price){
        this.quantity=quantity;
        this.price=price;
    }
    public Integer getId(){
        return  id;
    }
    public void setId(Integer id){
        this.id=id;
    }
    public int getQuantity(){
        return quantity;
    }
    public void setQuantity(int quantity){
        this.quantity=quantity;
    }
    public BigDecimal getPrice(){
        return price;
    }
    public void setPrice(BigDecimal price){
        this.price=price;
    }
    public ProductVariant getVariant(){
        return variant;
    }
    public void setVariant(ProductVariant variant){
        this.variant=variant;
    }
    public Order getOrder(){
        return order;
    }
    public void setOrder(Order order){
        this.order=order;
    }
}