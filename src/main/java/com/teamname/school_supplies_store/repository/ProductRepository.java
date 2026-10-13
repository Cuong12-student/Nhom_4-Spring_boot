package com.teamname.school_supplies_store.repository;
import com.teamname.school_supplies_store.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository 
public interface ProductRepository extends JpaRepository<Product, Integer>{
    List<Product> findByVariants_IdVariant(Integer idVariant);
    List<Product> findByCategory_Id(Integer id);
    boolean existsByNameIgnoreCase(String name);
}
