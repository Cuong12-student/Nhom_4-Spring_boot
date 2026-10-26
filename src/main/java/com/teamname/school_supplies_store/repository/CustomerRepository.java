package com.teamname.school_supplies_store.repository;
import com.teamname.school_supplies_store.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;
@Repository 
public interface CustomerRepository extends JpaRepository<Customer,Integer>{
    Optional<Customer> findByUser_Id(Integer id);
    Optional<Customer> findByCart_IdCart(Integer idCart);
    List<Customer> findByOrders_IdOrder(Integer idOrder);
}
