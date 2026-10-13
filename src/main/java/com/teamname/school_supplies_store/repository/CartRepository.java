package com.teamname.school_supplies_store.repository;
import com.teamname.school_supplies_store.entity.Cart;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;
@Repository 
public interface CartRepository extends JpaRepository<Cart,Integer>{
    Optional<Cart> findByCustomer_IdCustomer(Integer idCustomer);
    List<Cart> findByCartItem_IdItem(Integer idItem);
}
