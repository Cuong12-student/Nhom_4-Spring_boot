package com.teamname.school_supplies_store.repository;
import com.teamname.school_supplies_store.entity.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository 
public interface ShipmentRepository extends JpaRepository<Shipment, Integer>{
    Optional<Shipment> findByOrder_IdOrder(Integer idOrder);  
} 
