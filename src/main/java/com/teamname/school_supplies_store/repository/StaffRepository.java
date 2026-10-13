package com.teamname.school_supplies_store.repository;
import com.teamname.school_supplies_store.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;
@Repository
public interface StaffRepository extends JpaRepository<Staff, Integer>{
     Optional<Staff> findByUser_Id(Integer id);
    List<Staff> findByOrders_IdOrder(Integer idOrder);
}