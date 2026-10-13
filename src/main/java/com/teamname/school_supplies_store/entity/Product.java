package com.teamname.school_supplies_store.entity; 
import java.math.BigDecimal;

import com.teamname.school_supplies_store.enums.ProductStatus;

import java.util.List;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.persistence.Entity; 
import jakarta.persistence.Table; 
import jakarta.persistence.Id; 
import jakarta.persistence.GeneratedValue; 
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;  
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.ManyToOne;
@Entity
@Table(name="products")
public class Product{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_product")
    private Integer idProduct;
    @NotBlank (message="Tên sản phẩm không được trống")
    @Column(nullable = false,unique=true)
    private String name;
    private String description;
    @NotNull(message="Giá sản phẩm không được trống")
    @Positive(message = "Giá sản phẩm phải lớn hơn 0")
    @Column (nullable = false,precision = 12, scale = 0)
    private BigDecimal price;
    private String image;
    @NotBlank(message="Trạng thái phải hiển thị")
    @Column(nullable = false)
    private ProductStatus status;
    @OneToMany (mappedBy="product")
    private List<ProductVariant> variants;
    @ManyToOne
    @JoinColumn(name="id_category")
    private Category category;
    public Product(){}
    public Product(String name,String description, BigDecimal price, String image, ProductStatus status){
        this.name=name;
        this.description=description;
        this.price=price;
        this.image=image;
        this.status=status;
    }
    public Integer getIdProduct(){
        return idProduct;
    }
    public void setIdProduct(Integer idProduct){
        this.idProduct=idProduct;
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
    public BigDecimal getPrice(){
        return price;
    }
    public void setPrice(BigDecimal price){
        this.price=price;
    }
    public String getImage(){
        return image;
    }
    public void setImage(String image){
        this.image=image;
    }
    public ProductStatus getStatus(){
        return status;
    }
    public void setStatus(ProductStatus status){
        this.status=status;
    }
    public List<ProductVariant> getVariant(){
        return variants;
    }
    public void setVariant(List<ProductVariant> variants){
        this.variants=variants;
    }
    public Category getCategory(){
        return category;
    }
    public void setCategory(Category category){
        this.category=category;
    }
}