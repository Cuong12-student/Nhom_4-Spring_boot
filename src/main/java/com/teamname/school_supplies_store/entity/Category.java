package com.teamname.school_supplies_store.entity;
import jakarta.persistence.Entity; 
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.persistence.Id; 
import jakarta.persistence.GeneratedValue; 
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;  
import jakarta.persistence.OneToMany;
import java.util.List;

import com.teamname.school_supplies_store.enums.CategoryStatus;
@Entity
@Table(name="category")
public class Category{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id_category")
    private Integer id;
    @NotBlank(message="Tên danh mục không được trống")
    @Column(nullable = false)
    private String name;
    private String description;
    @NotBlank(message="Trạng thái phải hiển thị")
    @Column(nullable = false)
    private CategoryStatus status;
    @OneToMany (mappedBy="category")
    private List<Product> products;
    public Category(){
    }
    public Category(String name,String description, CategoryStatus status){
        this.name=name;
        this.description=description;
        this.status=status;
    }
    public String getName(){
        return name;
    }
    public void setName(String name){
        this.name=name;
    }
    public String getDescription(){
        return description;
    }
    public void setDescription(String description){
        this.description=description;
    }
    public CategoryStatus getStatus(){
        return status;
    }
    public void setStatus(CategoryStatus status){
        this.status=status;
    }
    public List<Product> getProduct(){
        return products;
    }
    public void setProduct(List<Product> products){
        this.products=products;
    }
}