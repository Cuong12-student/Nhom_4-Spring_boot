package com.teamname.school_supplies_store.entity; 
import java.time.LocalDateTime;
import java.util.List;
import jakarta.persistence.Entity; 
import jakarta.persistence.Table; 
import jakarta.persistence.Id; 
import jakarta.persistence.GeneratedValue; 
import jakarta.persistence.GenerationType; 
import jakarta.persistence.Column;   
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OneToMany;

@Entity
@Table(name="carts")
public class Cart{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_cart")
    private Integer idCart;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;
    @OneToOne
    @JoinColumn(name="id_customer")
    private Customer customer;
    @OneToMany (mappedBy="cart")
    private List<CartItem> cartItem;
    public Cart(){}
    public Cart (LocalDateTime createAt,LocalDateTime updateAt){
        this.createAt=createAt;
        this.updateAt=updateAt;
    }
    public Integer getId(){
        return idCart;
    }
    public void setId(Integer idCart){
        this.idCart=idCart;
    }
    public LocalDateTime getCreatedAt(){
        return createAt;
    }
    public void setCreatedAt(LocalDateTime createdAt){
        this.createAt=createdAt;
    }
    public LocalDateTime getUpdateAt(){
        return  updateAt;
    }
    public void setUpdateAt(LocalDateTime updateAt){
        this.updateAt=updateAt;
    }
    public Customer getCustomer(){
        return customer;
    }
    public void setCustomer(Customer customer){
        this.customer=customer;
    }
    public List<CartItem> getItem(){
        return cartItem;
    }
    public void setItem(List<CartItem> cartItem){
        this.cartItem=cartItem;
    }
}