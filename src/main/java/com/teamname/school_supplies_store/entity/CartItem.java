package com.teamname.school_supplies_store.entity; 
import java.math.BigDecimal; 
import jakarta.persistence.Column;
import jakarta.persistence.Entity; 
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.GeneratedValue; 
import jakarta.persistence.GenerationType;

@Entity
@Table(name="cartItems")
public class CartItem{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id_cartItem")
    private Integer idItem;
    private int quantity;
    private BigDecimal price;
    @ManyToOne
    @JoinColumn(name="id_cart")
    private Cart cart;
    @ManyToOne
    @JoinColumn(name="id_variant")
    private ProductVariant variant;
    public CartItem(){}
    public CartItem(int quantity, BigDecimal price){
        this.quantity=quantity;
        this.price=price;
    }
    public Integer getId(){
        return  idItem;
    }
    public void setId(Integer idItem){
        this.idItem=idItem;
    }
    public int getQuantity(){
        return  quantity;
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
    public Cart getCart(){
        return cart;
    }
    public void setCart(Cart cart){
        this.cart=cart;
    }
    public ProductVariant getVariant(){
        return variant;
    }
    public void setVariant(ProductVariant variant){
        this.variant=variant;
    }
}