# Graph Report - webspringboot  (2026-10-30)

## Corpus Check
- 78 files · ~15,794 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 11 file(s) not represented in the graph (top: .css 6, (none) 3, .properties 1)

## Summary
- 704 nodes · 1358 edges · 39 communities (22 shown, 17 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 38 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bd78b6ed`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- react
- Product
- package.json
- with
- 2. Chi Tiết Trực Quan Từng Bước Chuyển Đổi Dữ Liệu
- ProductStatus
- ProductVariant
- org.springframework.data.jpa.repository.JpaRepository
- UserStorePage.jsx
- Customer
- Order
- UserStorePage
- Cart
- hooks.js
- User
- Staff
- Admin
- spring
- CartItem
- main.jsx
- StoreProductDetailPage.jsx
- FilterPanel.jsx
- list
- UserNavBar.jsx
- StoreSelect
- SearchBox
- Inventory
- SecurityConfig.java
- Gender
- SchoolSuppliesStoreApplicationTests.java
- SchoolSuppliesStoreApplication.java
- Role
- React + Vite
- School Supplies Store
- CorsConfig.java
- com.teamname:school-supplies-store

## God Nodes (most connected - your core abstractions)
1. `ProductVariant` - 63 edges
2. `Customer` - 39 edges
3. `Order` - 38 edges
4. `Product` - 37 edges
5. `User` - 34 edges
6. `Staff` - 33 edges
7. `Admin` - 27 edges
8. `ProductStatus` - 27 edges
9. `UserStorePage()` - 26 edges
10. `Category` - 26 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `UserStorePage()`  [EXTRACTED]
  frontend/src/App.jsx → frontend/src/user/UserStorePage.jsx
- `StoreProductDetailPage()` --calls--> `formatPrice()`  [EXTRACTED]
  frontend/src/user/StoreProductDetailPage.jsx → frontend/src/user/format.js
- `UserStorePage()` --calls--> `StoreProductDetailPage()`  [EXTRACTED]
  frontend/src/user/UserStorePage.jsx → frontend/src/user/StoreProductDetailPage.jsx
- `UserStorePage()` --calls--> `UserNavBar()`  [EXTRACTED]
  frontend/src/user/UserStorePage.jsx → frontend/src/user/UserNavBar.jsx
- `UserStorePage()` --calls--> `useFilterOptions()`  [EXTRACTED]
  frontend/src/user/UserStorePage.jsx → frontend/src/user/hooks.js

## Import Cycles
- None detected.

## Communities (39 total, 17 thin omitted)

### Community 0 - "react"
Cohesion: 0.21
Nodes (9): formatPrice(), priceFormatter, niceStep(), PriceRange(), ImagePlaceholder(), ProductCard(), ProductGrid(), SkeletonCard() (+1 more)

### Community 1 - "Product"
Cohesion: 0.06
Nodes (3): Category, Product, ProductRepository

### Community 3 - "package.json"
Cohesion: 0.09
Nodes (28): devDependencies, eslint@^10.10.0, @eslint/js@^10.0.1, eslint-plugin-react-hooks@^7.1.1, eslint-plugin-react-refresh@^0.5.6, globals@^17.12.0, @types/react@^19.2.18, @types/react-dom@^19.2.7 (+20 more)

### Community 4 - "with"
Cohesion: 0.06
Nodes (32): runs-on, services, steps, MYSQL_DATABASE, MYSQL_ROOT_PASSWORD, SPRING_DATASOURCE_PASSWORD, SPRING_DATASOURCE_URL, SPRING_DATASOURCE_USERNAME (+24 more)

### Community 5 - "2. Chi Tiết Trực Quan Từng Bước Chuyển Đổi Dữ Liệu"
Cohesion: 0.06
Nodes (31): 1. Sơ Đồ Liên Kết Tổng Thể (Architectural Flowchart), 2. Chi Tiết Trực Quan Từng Bước Chuyển Đổi Dữ Liệu, BƯỚC 1: Entity `Product.java` (Ánh Xạ Database), BƯỚC 2: Repository `ProductRepository.java` (Truy Văn Database), BƯỚC 3: DTO `ProductSummaryResponse.java` (Khuôn Mẫu Dữ Liệu Outbound), BƯỚC 4: Service `ProductServiceImpl.java` (Ánh Xạ Dữ Liệu Entity $\rightarrow$ DTO), BƯỚC 5: Controller `ProductController.java` (Đóng Gói HTTP Response JSON), BƯỚC 6: Axios Call `productService.js` (Phía Frontend React) (+23 more)

### Community 6 - "ProductStatus"
Cohesion: 0.05
Nodes (19): HomeController, CategoryStatus, ACTIVE, INACTIVE, ProductStatus, ACTIVE, IN_STOCK, LOW_STOCK (+11 more)

### Community 7 - "ProductVariant"
Cohesion: 0.07
Nodes (4): ProductVariant, ProductVariantRepository, StorePageProductVariantRepository, StorePageServiceImpl

### Community 8 - "org.springframework.data.jpa.repository.JpaRepository"
Cohesion: 0.22
Nodes (4): AdminRepository, CategoryRepository, ShipmentRepository, StaffRepository

### Community 9 - "UserStorePage.jsx"
Cohesion: 0.26
Nodes (10): ActiveFilters(), pageItems(), Pagination(), SortBar(), ATTRIBUTE_LABELS, attributeLabel(), countActiveFilters(), INITIAL_FILTERS (+2 more)

### Community 11 - "Order"
Cohesion: 0.06
Nodes (11): Order, OrderDetail, OrderStatus, CANCELLED, COMPLETED, CONFIRMED, PENDING, PROCESSING (+3 more)

### Community 12 - "UserStorePage"
Cohesion: 0.17
Nodes (3): buildProductQuery(), getProductPathFromUrl(), UserStorePage()

### Community 14 - "hooks.js"
Cohesion: 0.36
Nodes (8): ApiError, fetchFilterOptions(), fetchStoreProductDetail(), fetchStoreProducts(), getJson(), useFilterOptions(), useStoreProductDetail(), useStoreProducts()

### Community 18 - "spring"
Cohesion: 0.12
Nodes (16): name, password, url, username, ddl-auto, format_sql, hibernate, properties (+8 more)

### Community 20 - "main.jsx"
Cohesion: 0.29
Nodes (5): dependencies, react@^19.2.8, react-dom@^19.2.8, App(), react-dom

### Community 21 - "StoreProductDetailPage.jsx"
Cohesion: 0.43
Nodes (7): DetailRows(), formatAttributeValue(), formatDate(), getAttributes(), ProductImage(), STATUS_LABELS, StoreProductDetailPage()

### Community 22 - "FilterPanel.jsx"
Cohesion: 0.48
Nodes (6): FilterPanel(), PanelSkeleton(), Section(), swatchColor(), isColorAttribute(), VALID_ATTRIBUTE_NAME

### Community 23 - "list"
Cohesion: 0.09
Nodes (8): Shipment, ShipmentStatus, DELIVERED, FAILED, IN_TRANSIT, PENDING, PICKED_UP, RETURNED

### Community 25 - "StoreSelect"
Cohesion: 0.40
Nodes (3): StoreSelect(), handleTriggerKeyDown(), moveFocus()

### Community 26 - "SearchBox"
Cohesion: 0.67
Nodes (3): SearchBox(), commit(), handleChange()

### Community 30 - "Gender"
Cohesion: 0.15
Nodes (3): Gender, Female, Male

### Community 33 - "Role"
Cohesion: 0.25
Nodes (4): Role, ADMIN, CUSTOMER, STAFF

### Community 35 - "React + Vite"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + Vite

## Knowledge Gaps
- **24 isolated node(s):** `com.teamname:school-supplies-store`, `ACTIVE`, `INACTIVE`, `Male`, `Female` (+19 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 259 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ProductVariant` connect `ProductVariant` to `Product`, `list`, `ProductStatus`, `Order`, `CartItem`, `Inventory`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **What connects `com.teamname:school-supplies-store`, `ACTIVE`, `INACTIVE` to the rest of the system?**
  _24 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Product` be split into smaller, more focused modules?**
  _Cohesion score 0.06090808416389812 - nodes in this community are weakly interconnected._
- **Why does `Order` connect `Order` to `list`, `ProductStatus`, `Customer`, `Staff`, `list`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09462365591397849 - nodes in this community are weakly interconnected._
- **Why does `Customer` connect `Customer` to `list`, `Order`, `Cart`, `User`, `Gender`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Should `with` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._