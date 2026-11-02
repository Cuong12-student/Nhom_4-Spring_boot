START TRANSACTION;

INSERT INTO categories (name, description, status, created_at, updated_at)
SELECT demo.name, demo.description, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM (
    SELECT 'Hàng mẫu cửa hàng' AS name, 'Danh mục dùng cho dữ liệu minh họa.' AS description
    UNION ALL
    SELECT 'Bút viết', 'Các loại bút viết dùng trong học tập và văn phòng.'
    UNION ALL
    SELECT 'Đồ dùng học tập', 'Các dụng cụ học tập phổ biến.'
) AS demo
WHERE NOT EXISTS (
    SELECT 1 FROM categories category WHERE category.name = demo.name
);

INSERT INTO products (
    name, slug, description, main_image, status, id_category, created_at, updated_at
)
SELECT
    demo.name,
    demo.slug,
    demo.description,
    NULL,
    'ACTIVE',
    category.id_category,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM (
    SELECT
        'Sổ tay học sinh mẫu' AS name,
        'so-tay-hoc-sinh-mau' AS slug,
        'Sổ tay minh họa cho cửa hàng. Thông số và giá chỉ phục vụ demo.' AS description,
        'Hàng mẫu cửa hàng' AS category_name
    UNION ALL
    SELECT 'Vở kẻ ngang mẫu', 'vo-ke-ngang-mau', 'Vở kẻ ngang minh họa, phù hợp ghi chép hằng ngày.', 'Hàng mẫu cửa hàng'
    UNION ALL
    SELECT 'Bút bi mẫu', 'but-bi-mau', 'Bút bi minh họa với nhiều màu mực và phiên bản.', 'Bút viết'
    UNION ALL
    SELECT 'Bút chì mẫu', 'but-chi-mau', 'Bút chì minh họa dùng cho học tập và phác thảo.', 'Bút viết'
    UNION ALL
    SELECT 'Thước kẻ mẫu', 'thuoc-ke-mau', 'Thước kẻ minh họa với nhiều phiên bản.', 'Đồ dùng học tập'
    UNION ALL
    SELECT 'Giấy ghi chú mẫu', 'giay-ghi-chu-mau', 'Giấy ghi chú minh họa với nhiều màu sắc.', 'Đồ dùng học tập'
) AS demo
JOIN categories category ON category.name = demo.category_name
WHERE NOT EXISTS (
    SELECT 1 FROM products product WHERE product.slug = demo.slug
);

INSERT INTO product_variants (
    sku, price, image, attributes, status, id_product, created_at, updated_at
)
WITH RECURSIVE demo_numbers (n) AS (
    SELECT 1
    UNION ALL
    SELECT n + 1 FROM demo_numbers WHERE n < 100
)
SELECT
    CASE
        WHEN demo_numbers.n = 1 THEN 'DEMO-SO-TAY-A5'
        ELSE CONCAT('DEMO-STORE-V', LPAD(demo_numbers.n, 3, '0'))
    END,
    CAST(10000 + demo_numbers.n * 500 AS DECIMAL(13, 2)),
    NULL,
    JSON_OBJECT(
        'Phiên bản', CONCAT('Phiên bản ', LPAD(demo_numbers.n, 3, '0')),
        'Màu sắc', ELT(MOD(demo_numbers.n - 1, 5) + 1, 'Đỏ', 'Xanh dương', 'Xanh lá', 'Vàng', 'Đen'),
        'Mã mẫu', CONCAT('M', LPAD(demo_numbers.n, 3, '0'))
    ),
    'ACTIVE',
    product.id_product,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM demo_numbers
JOIN products product
    ON product.slug = ELT(
        CEIL(demo_numbers.n * 6 / 100),
        'so-tay-hoc-sinh-mau',
        'vo-ke-ngang-mau',
        'but-bi-mau',
        'but-chi-mau',
        'thuoc-ke-mau',
        'giay-ghi-chu-mau'
    )
WHERE NOT EXISTS (
    SELECT 1
    FROM product_variants existing
    WHERE existing.sku = CASE
        WHEN demo_numbers.n = 1 THEN 'DEMO-SO-TAY-A5'
        ELSE CONCAT('DEMO-STORE-V', LPAD(demo_numbers.n, 3, '0'))
    END
);

INSERT INTO inventories (quantity, id_variant, created_at, updated_at)
WITH RECURSIVE demo_numbers (n) AS (
    SELECT 1
    UNION ALL
    SELECT n + 1 FROM demo_numbers WHERE n < 100
)
SELECT
    10 + MOD(demo_numbers.n, 41),
    variant.id_variant,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM demo_numbers
JOIN product_variants variant
    ON variant.sku = CASE
        WHEN demo_numbers.n = 1 THEN 'DEMO-SO-TAY-A5'
        ELSE CONCAT('DEMO-STORE-V', LPAD(demo_numbers.n, 3, '0'))
    END
WHERE NOT EXISTS (
    SELECT 1 FROM inventories inventory WHERE inventory.id_variant = variant.id_variant
);

COMMIT;

SELECT
    (SELECT COUNT(*) FROM categories
     WHERE name IN ('Hàng mẫu cửa hàng', 'Bút viết', 'Đồ dùng học tập')) AS demo_categories,
    (SELECT COUNT(*) FROM products
     WHERE slug IN (
         'so-tay-hoc-sinh-mau',
         'vo-ke-ngang-mau',
         'but-bi-mau',
         'but-chi-mau',
         'thuoc-ke-mau',
         'giay-ghi-chu-mau'
     )) AS demo_products,
    (SELECT COUNT(*) FROM product_variants
     WHERE sku = 'DEMO-SO-TAY-A5' OR sku LIKE 'DEMO-STORE-V%') AS demo_variants,
    (SELECT COUNT(*) FROM inventories inventory
     JOIN product_variants variant ON variant.id_variant = inventory.id_variant
     WHERE variant.sku = 'DEMO-SO-TAY-A5' OR variant.sku LIKE 'DEMO-STORE-V%') AS demo_inventory_records;

SELECT
    product.name,
    product.slug,
    COUNT(variant.id_variant) AS variant_count
FROM products product
JOIN product_variants variant ON variant.id_product = product.id_product
WHERE product.slug IN (
    'so-tay-hoc-sinh-mau',
    'vo-ke-ngang-mau',
    'but-bi-mau',
    'but-chi-mau',
    'thuoc-ke-mau',
    'giay-ghi-chu-mau'
)
GROUP BY product.id_product, product.name, product.slug
ORDER BY product.slug;
