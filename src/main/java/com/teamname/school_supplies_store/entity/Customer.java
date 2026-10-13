package com.teamname.school_supplies_store.entity; 
import jakarta.persistence.Entity; 
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;
import jakarta.persistence.Id; 
import jakarta.persistence.GeneratedValue; 
import jakarta.persistence.GenerationType; 
import jakarta.persistence.Column; 
import jakarta.persistence.Enumerated; 
import jakarta.persistence.EnumType; 
import jakarta.persistence.OneToOne; 
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import java.util.List;
import com.teamname.school_supplies_store.enums.Gender;
@Entity
@Table(name="customers")
public class Customer{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name = "id_customer")
    private Integer idCustomer;
    @NotBlank (message = "Tên khách hàng không được trống")
    @Pattern(
        regexp="^[a-zA-Z_]+$",
        message="Tên khách hàng chỉ có chữ hoa và chữ cái"
    )
    @Column(nullable = false)
    private String name;
    @NotBlank (message = "Tuổi không được trống")
    @Pattern(
        regexp="^[0-9_]+$",
        message = "Tuổi chỉ có chữ số"
    )
    @Column (nullable = false) 
    private int age;
    @Enumerated(EnumType.STRING)
    @NotBlank (message = "Giới tính không được trống")
    @Column(nullable = false)
    private Gender gender;
    @NotBlank (message = "Số điện thoại không được trống")
    @Pattern(
        regexp="^[0-9_]+$",
        message = "Số điện thoại chỉ có chữ số"
    )
    @Size(min=10,max=10,message = "Số điện thoại phải đủ 10 số")
    @Column(nullable = false,unique = true)
    private String phone;
    @NotBlank (message = "Email không được trống")
    @Column(nullable = false,unique = true)
    private String email;
    @NotBlank (message = "Địa chỉ không được trống")
    @Column(nullable = false)
    private String address;
    @OneToOne
    @JoinColumn(name="id_user", unique = true, nullable = false)
    private User user;
    @OneToOne (mappedBy="customer")
    private Cart cart;
    @OneToMany (mappedBy="customer")
    private List<Order> orders;
     
    public Customer() {
    }  
    public Customer(String name,int age, Gender gender, String phone,String email, String address){
        this.name=name;
        this.age=age;
        this.gender=gender;
        this.phone=phone;
        this.email=email;
        this.address=address;
    }
    public Integer getId(){
        return idCustomer;
    }
    public void setId(Integer idCustomer){
        this.idCustomer=idCustomer;
    }
    public String getName(){
        return name;
    }
    public void setName(String name){
        this.name=name;
    }
    public int getAge(){
        return age;
    }
    public void setAge(int age){
        this.age=age;
    }
    public Gender getGender(){
        return gender;
    }
    public void setGender(Gender gender){
        this.gender=gender;
    }
    public String getPhone(){
        return phone;
    }
    public void setPhone(String phone){
        this.phone=phone;
    }
    public String getEmail(){
        return email;
    }
    public void setEmail(String email){
        this.email=email;
    }
    public String getAddress(){
        return address;
    }
    public void setAddress(String address){
        this.address=address;
    }
    public User getUser(){
        return user;
    }
    public void setUser(User user){
        this.user=user;
    }
    public Cart getCart(){
        return cart;
    }
    public void setCart(Cart cart){
        this.cart=cart;
    }
    public List<Order> getOrder(){
        return orders;
    }
    public void setOrder(List<Order> orders){
        this.orders=orders;
    }
}