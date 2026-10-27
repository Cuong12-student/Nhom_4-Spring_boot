package com.teamname.school_supplies_store.user.repository;
import com.teamname.school_supplies_store.entity.ProductVariant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface StorePageProductVariantRepository extends JpaRepository<ProductVariant, Long>,
        JpaSpecificationExecutor<ProductVariant> {
    Optional<ProductVariant> findByInventory_IdInventory(Long idInventory);
    List<ProductVariant> findByOrderDetails_Id(Integer id);
    List<ProductVariant> findByProduct_IdProduct(Long idProduct);
    List<ProductVariant> findByCartItems_IdItem(Integer idItem);

    @Override
    @EntityGraph(attributePaths = {"product", "product.category"})
    Page<ProductVariant> findAll(
            Specification<ProductVariant> specification,
            Pageable pageable);
}