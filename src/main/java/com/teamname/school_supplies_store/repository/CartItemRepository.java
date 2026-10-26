package com.teamname.school_supplies_store.repository;
import com.teamname.school_supplies_store.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository 
public interface CartItemRepository extends JpaRepository<CartItem, Integer>{
    List<CartItem> findByCart_IdCart(Integer idCart);
    List<CartItem> findByVariant_IdVariant(Long idVariant);
}
