package com.teamname.school_supplies_store.user.repository;

import com.teamname.school_supplies_store.entity.Product;
import com.teamname.school_supplies_store.enums.ProductStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import java.util.List;
@Repository 
public interface StoreProductRepository extends JpaRepository<Product, Long>{
    List<Product> findByVariants_IdVariant(Long idVariant);
    List<Product> findByCategory_IdCategory(Long idCategory);
    boolean existsByNameIgnoreCase(String name);
    @EntityGraph(attributePaths = {"category"})
    Page<Product> findByStatus(ProductStatus status, Pageable pageable);
}
