package com.teamname.school_supplies_store.repository;
import com.teamname.school_supplies_store.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;
@Repository 
public interface OrderRepository extends JpaRepository<Order,Integer>{
    List<Order> findByCustomer_IdCustomer(Integer idCustomer);
    List<Order> findByStaff_IdStaff(Integer idStaff);
    List<Order> findByOrderDetail_Id(Integer id);
    Optional<Order> findByShipment_IdShipment(Integer idShipment);
} 
