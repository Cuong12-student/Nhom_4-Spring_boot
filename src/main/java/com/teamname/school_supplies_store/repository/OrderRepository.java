package com.teamname.school_supplies_store.repository;
import com.teamname.school_supplies_store.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;
import java.time.LocalDateTime;
import com.teamname.school_supplies_store.enums.OrderStatus;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
@Repository 
public interface OrderRepository extends JpaRepository<Order,Integer>{
    List<Order> findByCustomer_IdCustomer(Integer idCustomer);
    List<Order> findByStaff_IdStaff(Integer idStaff);
    List<Order> findByOrderDetail_Id(Integer id);
    Optional<Order> findByShipment_IdShipment(Integer idShipment);
    boolean existsByStaff_IdStaff(Integer idStaff);

    @Query("""
            select year(o.orderDate), month(o.orderDate), sum(o.totalAmount)
            from Order o
            where o.status = :status and o.orderDate >= :from and o.orderDate < :to
            group by year(o.orderDate), month(o.orderDate)
            order by year(o.orderDate), month(o.orderDate)
            """)
    List<Object[]> findMonthlyRevenue(
            @Param("status") OrderStatus status,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to);

    @Query("""
            select distinct o
            from Order o
            left join fetch o.customer
            left join fetch o.orderDetail detail
            left join fetch detail.variant variant
            left join fetch variant.product
            order by o.orderDate desc
            """)
    List<Order> findAllWithDetails();
}
