package com.teamname.school_supplies_store.repository;
import com.teamname.school_supplies_store.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository 
public interface ProductRepository extends JpaRepository<Product, Long>{
    List<Product> findByVariants_IdVariant(Long idVariant);
    List<Product> findByCategory_IdCategory(Long idCategory);
    boolean existsByNameIgnoreCase(String name);
}
