package com.teamname.school_supplies_store.user.repository;

import com.teamname.school_supplies_store.entity.ProductVariant;
import com.teamname.school_supplies_store.enums.CategoryStatus;
import com.teamname.school_supplies_store.enums.ProductStatus;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

/**
 * Truy vấn các giá trị lọc. Chỉ lấy dữ liệu đang hiển thị ở cửa hàng
 * (biến thể, sản phẩm và danh mục đều ACTIVE) để khớp với StorePageServiceImpl.
 */
public interface StorePageFilterRepository extends Repository<ProductVariant, Long> {

    @Query("""
            select distinct c.idCategory, c.name
            from ProductVariant v join v.product p join p.category c
            where v.status = :status and p.status = :status and c.status = :categoryStatus
            order by c.name
            """)
    List<Object[]> findCategoryOptions(
            @Param("status") ProductStatus status,
            @Param("categoryStatus") CategoryStatus categoryStatus);

    @Query("""
            select distinct p.idProduct, p.name, c.idCategory
            from ProductVariant v join v.product p join p.category c
            where v.status = :status and p.status = :status and c.status = :categoryStatus
            order by p.name
            """)
    List<Object[]> findProductOptions(
            @Param("status") ProductStatus status,
            @Param("categoryStatus") CategoryStatus categoryStatus);

    @Query("""
            select min(v.price)
            from ProductVariant v join v.product p join p.category c
            where v.status = :status and p.status = :status and c.status = :categoryStatus
            """)
    BigDecimal findMinPrice(
            @Param("status") ProductStatus status,
            @Param("categoryStatus") CategoryStatus categoryStatus);

    @Query("""
            select max(v.price)
            from ProductVariant v join v.product p join p.category c
            where v.status = :status and p.status = :status and c.status = :categoryStatus
            """)
    BigDecimal findMaxPrice(
            @Param("status") ProductStatus status,
            @Param("categoryStatus") CategoryStatus categoryStatus);

    /**
     * Cặp (tên thuộc tính, giá trị) trong cột JSON attributes. Dùng JSON_TABLE của
     * MySQL 8 nên không cần parse JSON ở phía Java — cùng họ hàm JSON mà bộ lọc
     * thuộc tính trong StorePageServiceImpl đang dùng.
     */
    @Query(value = """
            select distinct jt.attr_key,
                   json_unquote(json_extract(v.attributes, concat('$."', jt.attr_key, '"'))) as attr_value
            from product_variants v
            join products p on p.id_product = v.id_product
            join categories c on c.id_category = p.id_category
            cross join json_table(json_keys(v.attributes), '$[*]'
                       columns (attr_key varchar(100) path '$')) jt
            where v.status = 'ACTIVE' and p.status = 'ACTIVE' and c.status = 'ACTIVE'
              and v.attributes is not null
              and json_type(v.attributes) = 'OBJECT'
            """, nativeQuery = true)
    List<Object[]> findAttributeOptions();
}
