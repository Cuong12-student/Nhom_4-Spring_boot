package com.teamname.school_supplies_store.user.store.repository;
import com.teamname.school_supplies_store.entity.ProductVariant;
import com.teamname.school_supplies_store.enums.CategoryStatus;
import com.teamname.school_supplies_store.enums.ProductStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    @Query("""
            select v
            from ProductVariant v
            join fetch v.product p
            join fetch p.category c
            left join fetch v.inventory i
            where v.idVariant = :variantId
              and v.status = :variantStatus
              and p.status = :productStatus
              and c.status = :categoryStatus
            """)
    Optional<ProductVariant> findActiveStoreProductById(
            @Param("variantId") Long variantId,
            @Param("variantStatus") ProductStatus variantStatus,
            @Param("productStatus") ProductStatus productStatus,
            @Param("categoryStatus") CategoryStatus categoryStatus);

    @Query("""
            select v
            from ProductVariant v
            join fetch v.product p
            join fetch p.category c
            left join fetch v.inventory i
            where p.slug = :slug
              and v.sku = :sku
              and v.status = :variantStatus
              and p.status = :productStatus
              and c.status = :categoryStatus
            """)
    Optional<ProductVariant> findActiveStoreProductBySlugAndSku(
            @Param("slug") String slug,
            @Param("sku") String sku,
            @Param("variantStatus") ProductStatus variantStatus,
            @Param("productStatus") ProductStatus productStatus,
            @Param("categoryStatus") CategoryStatus categoryStatus);

    @Override
    @EntityGraph(attributePaths = {"product", "product.category"})
    Page<ProductVariant> findAll(
            Specification<ProductVariant> specification,
            Pageable pageable);
}