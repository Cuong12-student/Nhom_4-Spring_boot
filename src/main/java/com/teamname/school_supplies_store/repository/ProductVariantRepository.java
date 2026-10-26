package com.teamname.school_supplies_store.repository;
import com.teamname.school_supplies_store.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;
@Repository 
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long>{
    Optional<ProductVariant> findByInventory_IdInventory(Long idInventory);
    List<ProductVariant> findByOrderDetails_Id(Integer id);
    List<ProductVariant> findByProduct_IdProduct(Long idProduct);
    List<ProductVariant> findByCartItems_IdItem(Integer idItem);
} 
