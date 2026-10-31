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
import com.teamname.school_supplies_store.enums.Role;
@Entity
@Table(name="users")
public class User {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name = "id_user")
    private Integer id;
    @NotBlank (message="Tên đăng nhập không được trống")
    @Size(min=8,max=12,message = "Tên đăng nhập phải từ 8 đến 12 ký tự")
    @Pattern(
        regexp = "^[a-zA-Z0-9_]+$",
        message = "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới"
    )
    @Column(nullable = false,unique = true,length = 20)
    private String username;
    @Column(nullable = false, length = 255)
    private String password;
    @Enumerated(EnumType.STRING)
    private Role role;
    @OneToOne (mappedBy="user")
    private Customer customer;
    @OneToOne (mappedBy="user")
    private Staff staff;
    @OneToOne (mappedBy="user")
    private Admin admin;
    public User() {
    }
    public User (String username,String password,Role role){
        this.username=username;
        this.password=password;
        this.role=role;
    }
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
    public Customer getCustomer(){
        return customer;
    }
    public void setCustomer(Customer customer){
        this.customer=customer;
    }
    public Staff getStaff(){
        return staff;
    }
    public void setStaff(Staff staff){
        this.staff=staff;
    }
    public Admin getAdmin(){
        return admin;
    }
    public void setAdmin(Admin admin){
        this.admin=admin;
    }
}