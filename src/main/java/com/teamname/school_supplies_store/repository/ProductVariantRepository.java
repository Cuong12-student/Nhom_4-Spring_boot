package com.teamname.school_supplies_store.repository;
import com.teamname.school_supplies_store.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;
@Repository 
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Integer>{
    Optional<ProductVariant> findByInventory_Id(Integer id);
    List<ProductVariant> findByOrderDetails_Id(Integer id);
    List<ProductVariant> findByProduct_IdProduct(Integer idProduct);
    List<ProductVariant> findByCartItems_IdItem(Integer idItem);
} 
