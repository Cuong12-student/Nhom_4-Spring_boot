package com.teamname.school_supplies_store.user.repository;
import com.teamname.school_supplies_store.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository 
public interface StoreInventoryRepository extends JpaRepository<Inventory,Long>{
    Optional<Inventory> findByVariant_IdVariant(Long idVariant);
}
