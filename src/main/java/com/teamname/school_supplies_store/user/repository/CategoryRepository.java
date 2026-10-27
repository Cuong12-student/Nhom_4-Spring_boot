package com.teamname.school_supplies_store.user.repository;
import com.teamname.school_supplies_store.entity.Category;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository 
public interface CategoryRepository extends JpaRepository<Category,Long>{
    Optional<Category> findByProducts_Variants_IdVariant(Long idVariant);
    Optional<Category> findByName(String name);
    boolean existsByName(String name);
}
