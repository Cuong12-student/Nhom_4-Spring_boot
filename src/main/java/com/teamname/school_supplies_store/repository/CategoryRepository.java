package com.teamname.school_supplies_store.repository;
import com.teamname.school_supplies_store.entity.Category;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository 
public interface CategoryRepository extends JpaRepository<Category,Integer>{
    Optional<Category> findByProducts_Variants_IdVariant(Integer idVariant);
    Optional<Category> findByName(String name);
    boolean existsByName(String name);
}
