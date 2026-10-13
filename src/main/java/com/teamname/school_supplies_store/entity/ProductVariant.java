package com.teamname.school_supplies_store.entity;
import java.util.List;
import jakarta.persistence.Entity; 
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.persistence.Id; 
import jakarta.persistence.GeneratedValue; 
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;  
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.ManyToOne;
@Entity
@Table(name="productVariants")
public class ProductVariant{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_variant")
    private Integer idVariant;
    @NotNull (message = "Số liệu phải hiển thị")
    @Column(nullable = false)
    private String size;
    private String color;
    @OneToMany (mappedBy="variant")
    private List<CartItem> cartItems;
    @OneToOne(mappedBy = "variant")
    private Inventory inventory;
    @ManyToOne
    @JoinColumn(name="id_product")
    private Product product;
    @OneToMany(mappedBy = "variant")
    private List<OrderDetail> orderDetails;
    public ProductVariant(){}
    public ProductVariant(String size,String color){
        this.size=size;
        this.color=color;
    }
    public Integer getIdVariant(){
        return idVariant;
    }
    public void setIdvariant(Integer idVariant){
        this.idVariant=idVariant;
    }
    public String getSize(){
        return size;
    }
    public void setSize(String size){
        this.size=size;
    }
    public String getColor(){
        return color;
    }
    public void setColor(String color){
        this.color=color;
    }
    public List<CartItem> getItem(){
        return cartItems;
    }
    public void setItem(List<CartItem> cartItems){
        this.cartItems=cartItems;
    }
    public Inventory getInventory(){
        return inventory;
    }
    public void setInventory(Inventory inventory){
        this.inventory=inventory;
    }
}