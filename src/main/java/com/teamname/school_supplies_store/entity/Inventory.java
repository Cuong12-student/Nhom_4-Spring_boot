package com.teamname.school_supplies_store.entity; 
import java.time.LocalDateTime;

import jakarta.persistence.Entity; 
import jakarta.persistence.Table; 
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.GeneratedValue; 
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.OneToOne; 
@Entity
@Table(name="inventories")
public class Inventory{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id_inventory")
    private Integer id;
    @Column(nullable = false)
    private int quantity;
    private LocalDateTime updateAt;
    @OneToOne
    @JoinColumn(name = "id_variant", nullable = false, unique = true)
    private ProductVariant variant;
    public Inventory(){
    }
    public Inventory(int quantity,LocalDateTime updateAt){
        this.quantity=quantity;
        this.updateAt=updateAt;
    }
    public Integer getId(){
        return id;
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
    public LocalDateTime getUpdateAt(){
        return updateAt;
    }
    public void setUpdateAt(LocalDateTime updateAt){
        this.updateAt=updateAt;
    }
    public ProductVariant getVariant() {
        return variant;
    }

    public void setVariant(ProductVariant variant) {
        this.variant = variant;
    }
}