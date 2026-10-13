package com.teamname.school_supplies_store.repository;
import com.teamname.school_supplies_store.entity.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository 
public interface OrderDetailRepository extends JpaRepository<OrderDetail,Integer>{
    List<OrderDetail> findByOrder_IdOrder(Integer idOrder);
    List<OrderDetail> findByVariant_IdVariant(Integer idVariant);
} 