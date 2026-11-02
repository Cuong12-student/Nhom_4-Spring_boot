# Graph Report - frontend  (2026-11-02)

## Corpus Check
- 30 files · ~8,368 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .css 7, (none) 1)

## Summary
- 144 nodes · 266 edges · 13 communities (9 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0f69ce5e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- UserStorePage.jsx
- package.json
- storeFilters.js
- react
- SortBar.jsx
- StoreProductDetailPage.jsx
- UserNavBar.jsx
- ProductCard.jsx
- scripts
- React + Vite

## God Nodes (most connected - your core abstractions)
1. `UserStorePage()` - 26 edges
2. `react` - 13 edges
3. `StoreProductDetailPage()` - 9 edges
4. `formatPrice()` - 9 edges
5. `FilterPanel()` - 9 edges
6. `PriceRange()` - 8 edges
7. `StoreSelect()` - 7 edges
8. `App()` - 6 edges
9. `scripts` - 5 edges
10. `getJson()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `UserStorePage()`  [EXTRACTED]
  src/App.jsx → src/user/UserStorePage.jsx
- `StoreProductDetailPage()` --calls--> `formatPrice()`  [EXTRACTED]
  src/user/StoreProductDetailPage.jsx → src/user/format.js
- `UserStorePage()` --calls--> `StoreProductDetailPage()`  [EXTRACTED]
  src/user/UserStorePage.jsx → src/user/StoreProductDetailPage.jsx
- `UserStorePage()` --calls--> `UserNavBar()`  [EXTRACTED]
  src/user/UserStorePage.jsx → src/user/UserNavBar.jsx
- `UserStorePage()` --calls--> `ActiveFilters()`  [EXTRACTED]
  src/user/UserStorePage.jsx → src/user/store/ActiveFilters.jsx

## Import Cycles
- None detected.

## Communities (13 total, 4 thin omitted)

### Community 0 - "UserStorePage.jsx"
Cohesion: 0.12
Nodes (16): ApiError, buildProductQuery(), fetchFilterOptions(), fetchStoreProductDetail(), fetchStoreProducts(), getJson(), useFilterOptions(), useStoreProductDetail() (+8 more)

### Community 1 - "package.json"
Cohesion: 0.12
Nodes (23): devDependencies, eslint@^10.10.0, @eslint/js@^10.0.1, eslint-plugin-react-hooks@^7.1.1, eslint-plugin-react-refresh@^0.5.6, globals@^17.12.0, @types/react@^19.2.18, @types/react-dom@^19.2.7 (+15 more)

### Community 2 - "storeFilters.js"
Cohesion: 0.16
Nodes (15): formatPrice(), priceFormatter, ActiveFilters(), FilterPanel(), PanelSkeleton(), Section(), swatchColor(), niceStep() (+7 more)

### Community 3 - "react"
Cohesion: 0.18
Nodes (12): dependencies, react@^19.2.8, react-dom@^19.2.8, react-router-dom@^7.18.5, react, react-dom, react-router-dom, AdminHome() (+4 more)

### Community 4 - "SortBar.jsx"
Cohesion: 0.27
Nodes (6): SortBar(), StoreSelect(), handleTriggerKeyDown(), moveFocus(), PAGE_SIZES, SORT_OPTIONS

### Community 5 - "StoreProductDetailPage.jsx"
Cohesion: 0.43
Nodes (7): DetailRows(), formatAttributeValue(), formatDate(), getAttributes(), ProductImage(), STATUS_LABELS, StoreProductDetailPage()

### Community 7 - "ProductCard.jsx"
Cohesion: 0.60
Nodes (4): ImagePlaceholder(), ProductCard(), ProductGrid(), SkeletonCard()

### Community 8 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, preview

### Community 9 - "React + Vite"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + Vite

## Knowledge Gaps
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `UserStorePage.jsx`, `package.json`, `storeFilters.js`, `SortBar.jsx`, `StoreProductDetailPage.jsx`, `UserNavBar.jsx`, `ProductCard.jsx`?**
  _High betweenness centrality (0.352) - this node is a cross-community bridge._
- **Should `UserStorePage.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12043010752688173 - nodes in this community are weakly interconnected._
- **Why does `UserStorePage()` connect `UserStorePage.jsx` to `storeFilters.js`, `react`, `SortBar.jsx`, `StoreProductDetailPage.jsx`, `UserNavBar.jsx`, `ProductCard.jsx`?**
  _High betweenness centrality (0.162) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._