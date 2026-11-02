# Graph Report - webspringboot  (2026-11-02)

## Corpus Check
- 109 files · ~23,671 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: .css 9, (none) 3, .properties 1)

## Summary
- 899 nodes · 2029 edges · 49 communities (19 shown, 30 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 144 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1182f00e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CartController.java
- Product
- package.json
- with
- 2. Chi Tiết Trực Quan Từng Bước Chuyển Đổi Dữ Liệu
- StorePageController.java
- ProductVariant
- list
- UserStorePage.jsx
- Customer
- Order
- Category
- CartService
- User
- Staff
- Admin
- spring
- Cart
- UserProfilePage.jsx
- OrderDetail
- Inventory
- list
- ShipmentStatus
- RegisterRequest
- OrderStatus
- StorePageServiceImpl.java
- SecurityConfig.java
- CategoryStatus
- SchoolSuppliesStoreApplicationTests.java
- SchoolSuppliesStoreApplication.java
- CustomerSessionService
- bigdecimal
- React + Vite
- School Supplies Store
- CorsConfig.java
- com.teamname:school-supplies-store
- .login
- .getFilterOptions
- HomeController.java
- LoginResponse
- package.json

## God Nodes (most connected - your core abstractions)
1. `ProductVariant` - 66 edges
2. `Customer` - 44 edges
3. `Order` - 41 edges
4. `Product` - 37 edges
5. `User` - 35 edges
6. `Staff` - 33 edges
7. `Cart` - 29 edges
8. `UserStorePage()` - 28 edges
9. `CartItem` - 28 edges
10. `OrderDetail` - 28 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `UserStorePage()`  [EXTRACTED]
  frontend/src/App.jsx → frontend/src/user/UserStorePage.jsx
- `UserStorePage()` --calls--> `StoreProductDetailPage()`  [EXTRACTED]
  frontend/src/user/UserStorePage.jsx → frontend/src/user/StoreProductDetailPage.jsx
- `UserStorePage()` --calls--> `UserFooter()`  [EXTRACTED]
  frontend/src/user/UserStorePage.jsx → frontend/src/user/UserFooter.jsx
- `UserHomePage()` --calls--> `fetchStoreProducts()`  [EXTRACTED]
  frontend/src/user/UserHomePage.jsx → frontend/src/user/api/storeApi.js
- `UserStorePage()` --calls--> `UserNavBar()`  [EXTRACTED]
  frontend/src/user/UserStorePage.jsx → frontend/src/user/UserNavBar.jsx

## Import Cycles
- None detected.

## Communities (49 total, 30 thin omitted)

### Community 0 - "CartController.java"
Cohesion: 0.14
Nodes (7): CartController, CartItemRequest, CartQuantityRequest, CartResponse, CheckoutRequest, CustomerProfileResponse, OrderHistoryResponse

### Community 3 - "package.json"
Cohesion: 0.08
Nodes (34): dependencies, react@^19.2.8, react-dom@^19.2.8, react-router-dom@^7.18.5, devDependencies, eslint@^10.10.0, @eslint/js@^10.0.1, eslint-plugin-react-hooks@^7.1.1 (+26 more)

### Community 4 - "with"
Cohesion: 0.06
Nodes (32): runs-on, services, steps, MYSQL_DATABASE, MYSQL_ROOT_PASSWORD, SPRING_DATASOURCE_PASSWORD, SPRING_DATASOURCE_URL, SPRING_DATASOURCE_USERNAME (+24 more)

### Community 5 - "2. Chi Tiết Trực Quan Từng Bước Chuyển Đổi Dữ Liệu"
Cohesion: 0.06
Nodes (31): 1. Sơ Đồ Liên Kết Tổng Thể (Architectural Flowchart), 2. Chi Tiết Trực Quan Từng Bước Chuyển Đổi Dữ Liệu, BƯỚC 1: Entity `Product.java` (Ánh Xạ Database), BƯỚC 2: Repository `ProductRepository.java` (Truy Văn Database), BƯỚC 3: DTO `ProductSummaryResponse.java` (Khuôn Mẫu Dữ Liệu Outbound), BƯỚC 4: Service `ProductServiceImpl.java` (Ánh Xạ Dữ Liệu Entity $\rightarrow$ DTO), BƯỚC 5: Controller `ProductController.java` (Đóng Gói HTTP Response JSON), BƯỚC 6: Axios Call `productService.js` (Phía Frontend React) (+23 more)

### Community 6 - "StorePageController.java"
Cohesion: 0.19
Nodes (3): StorePageController, StorePageProductDetailResponse, StorePageService

### Community 7 - "ProductVariant"
Cohesion: 0.12
Nodes (3): ProductVariant, ProductVariantRepository, StorePageProductVariantRepository

### Community 8 - "list"
Cohesion: 0.14
Nodes (7): AdminRepository, CartItemRepository, CartRepository, InventoryRepository, OrderDetailRepository, ShipmentRepository, StaffRepository

### Community 9 - "UserStorePage.jsx"
Cohesion: 0.06
Nodes (40): ApiError, buildProductQuery(), fetchFilterOptions(), fetchStoreProductDetail(), fetchStoreProducts(), getJson(), useFilterOptions(), useStoreProductDetail() (+32 more)

### Community 15 - "User"
Cohesion: 0.11
Nodes (6): User, Role, ADMIN, CUSTOMER, STAFF, UserRepository

### Community 17 - "Admin"
Cohesion: 0.08
Nodes (4): Admin, Gender, Female, Male

### Community 18 - "spring"
Cohesion: 0.12
Nodes (16): name, password, url, username, ddl-auto, format_sql, hibernate, properties (+8 more)

### Community 20 - "UserProfilePage.jsx"
Cohesion: 0.08
Nodes (51): AdminHome(), App(), Login(), Register(), StaffHome(), addCartItem(), checkoutCart(), fetchCart() (+43 more)

### Community 24 - "ShipmentStatus"
Cohesion: 0.18
Nodes (7): ShipmentStatus, DELIVERED, FAILED, IN_TRANSIT, PENDING, PICKED_UP, RETURNED

### Community 26 - "OrderStatus"
Cohesion: 0.20
Nodes (7): OrderStatus, CANCELLED, COMPLETED, CONFIRMED, PENDING, PROCESSING, SHIPPING

### Community 30 - "CategoryStatus"
Cohesion: 0.16
Nodes (9): CategoryStatus, ACTIVE, INACTIVE, ProductStatus, ACTIVE, IN_STOCK, LOW_STOCK, OUT_OF_STOCK (+1 more)

### Community 33 - "CustomerSessionService"
Cohesion: 0.17
Nodes (4): AuthController, AuthService, CustomerSessionService, Session

### Community 35 - "React + Vite"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + Vite

### Community 41 - ".getFilterOptions"
Cohesion: 0.35
Nodes (5): StorePageFilterController, CategoryOption, ProductOption, StorePageFilterResponse, StorePageFilterService

### Community 45 - "package.json"
Cohesion: 0.67
Nodes (3): dependencies, react-router-dom@^7.18.5, react-router-dom

## Knowledge Gaps
- **24 isolated node(s):** `com.teamname:school-supplies-store`, `ACTIVE`, `INACTIVE`, `Male`, `Female` (+19 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 282 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **30 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ProductVariant` connect `ProductVariant` to `Product`, `list`, `list`, `.toStoreProductDetailResponse`, `CartService`, `CartService.java`, `.checkout`, `Cart`, `OrderDetail`, `Inventory`, `StorePageServiceImpl.java`, `CategoryStatus`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **What connects `com.teamname:school-supplies-store`, `ACTIVE`, `INACTIVE` to the rest of the system?**
  _24 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CartController.java` be split into smaller, more focused modules?**
  _Cohesion score 0.1396011396011396 - nodes in this community are weakly interconnected._
- **Why does `Order` connect `Order` to `list`, `list`, `Customer`, `CartService.java`, `Staff`, `.checkout`, `OrderDetail`, `list`, `OrderStatus`, `StorePageServiceImpl.java`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Should `Product` be split into smaller, more focused modules?**
  _Cohesion score 0.09333333333333334 - nodes in this community are weakly interconnected._
- **Why does `Customer` connect `Customer` to `list`, `list`, `Order`, `CartService`, `CartService.java`, `User`, `.checkout`, `Admin`, `Cart`, `RegisterRequest`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07807807807807808 - nodes in this community are weakly interconnected._