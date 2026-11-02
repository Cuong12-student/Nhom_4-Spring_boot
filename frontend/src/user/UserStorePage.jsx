import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import UserNavBar from './UserNavBar'
import StoreProductDetailPage from './StoreProductDetailPage'
import SearchBox from './store/SearchBox'
import FilterPanel from './store/FilterPanel'
import ActiveFilters from './store/ActiveFilters'
import SortBar from './store/SortBar'
import ProductGrid from './store/ProductGrid'
import Pagination from './store/Pagination'
import { buildProductQuery } from './api/storeApi'
import UserFooter from './UserFooter'
import { useFilterOptions, useStoreProductDetail, useStoreProducts } from './hooks'
import { INITIAL_FILTERS, SORT_OPTIONS, countActiveFilters } from './storeFilters'
import './userTheme.css'
import './UserStorePage.css'

function getProductPathFromUrl() {
  const parts = window.location.pathname.split('/').filter(Boolean)
  const productParts = parts.length === 3 && parts[0] === 'store'
    ? parts.slice(1)
    : parts
  if (productParts.length !== 2) return null

  try {
    const [slug, sku] = productParts.map((part) => decodeURIComponent(part))
    return slug && sku ? { slug, sku } : null
  } catch {
    return null
  }
}

function getInitialFilters() {
  const filters = { ...INITIAL_FILTERS }
  const params = new URLSearchParams(window.location.search)
  filters.q = params.get('q') ?? ''
  filters.categoryIds = params.getAll('categoryId')
    .map(Number)
    .filter((id) => Number.isSafeInteger(id) && id > 0)
  return filters
}

export default function UserStorePage() {
  const [filters, setFilters] = useState(getInitialFilters)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(getProductPathFromUrl)
  const resultsRef = useRef(null)

  const query = useMemo(() => buildProductQuery(filters), [filters])
  const products = useStoreProducts(query, !selectedProduct)
  const productDetail = useStoreProductDetail(selectedProduct)
  const filterOptions = useFilterOptions(!selectedProduct)

  useEffect(() => {
    const syncProductFromUrl = () => setSelectedProduct(getProductPathFromUrl())
    window.addEventListener('popstate', syncProductFromUrl)
    return () => window.removeEventListener('popstate', syncProductFromUrl)
  }, [])

  function openProduct(event, product) {
    if (
      event.defaultPrevented
      || event.button !== 0
      || event.metaKey
      || event.ctrlKey
      || event.shiftKey
      || event.altKey
    ) return

    event.preventDefault()
    const url = new URL(window.location.href)
    url.pathname = `/store/${encodeURIComponent(product.slug)}/${encodeURIComponent(product.sku)}`
    url.search = ''
    url.hash = ''
    window.history.pushState({ storeProduct: true }, '', url)
    setSelectedProduct({ slug: product.slug, sku: product.sku })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function returnToStore() {
    if (window.history.state?.storeProduct) {
      window.history.back()
      return
    }

    const url = new URL(window.location.href)
    url.pathname = '/store'
    url.search = ''
    url.hash = ''
    window.history.replaceState(null, '', url)
    setSelectedProduct(null)
  }

  // Mọi thay đổi bộ lọc/sắp xếp đều quay về trang đầu.
  const update = useCallback((patch) => {
    setFilters((previous) => ({ ...previous, ...patch, page: 0 }))
  }, [])

  const options = filterOptions.options

  function toggleCategory(categoryId) {
    const categoryIds = filters.categoryIds.includes(categoryId)
      ? filters.categoryIds.filter((id) => id !== categoryId)
      : [...filters.categoryIds, categoryId]
    const productIds = options && categoryIds.length > 0
      ? filters.productIds.filter((productId) =>
          options.products.some((product) =>
            product.idProduct === productId && categoryIds.includes(product.idCategory),
          ),
        )
      : filters.productIds
    update({ categoryIds, productIds })
  }

  function toggleProduct(productId) {
    const productIds = filters.productIds.includes(productId)
      ? filters.productIds.filter((id) => id !== productId)
      : [...filters.productIds, productId]
    update({ productIds })
  }

  function changePrice({ min, max }) {
    update({ minPrice: min, maxPrice: max })
  }

  function toggleAttribute(name, value) {
    const selected = filters.attributes[name] ?? []
    const next = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value]
    const attributes = { ...filters.attributes }
    if (next.length > 0) attributes[name] = next
    else delete attributes[name]
    update({ attributes })
  }

  function changeSort(value) {
    const option = SORT_OPTIONS.find((item) => item.value === value)
    if (option) update({ sort: option.sort, direction: option.direction })
  }

  function clearFilters() {
    setFilters((previous) => ({
      ...INITIAL_FILTERS,
      sort: previous.sort,
      direction: previous.direction,
      size: previous.size,
    }))
  }

  function changePage(page) {
    setFilters((previous) => ({ ...previous, page }))
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Khóa cuộn trang và cho phép đóng ngăn kéo bộ lọc bằng phím Esc (màn hình nhỏ).
  useEffect(() => {
    if (!filtersOpen) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setFiltersOpen(false)
    }
    document.body.classList.add('us-no-scroll')
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.classList.remove('us-no-scroll')
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [filtersOpen])

  const page = products.data
  const activeCount = countActiveFilters(filters)
  const hasResults = page && page.content.length > 0

  if (selectedProduct) {
    return (
      <div className="us-page-root">
        <UserNavBar activeKey="store" />
        <StoreProductDetailPage
          key={`${selectedProduct.slug}/${selectedProduct.sku}`}
          product={productDetail.data}
          loading={productDetail.loading}
          error={productDetail.error}
          onRetry={productDetail.reload}
          onBack={returnToStore}
        />
        <UserFooter />
      </div>
    )
  }

  let summary = ''
  if (page) {
    summary = page.totalElements === 0
      ? 'Không có sản phẩm'
      : `${page.number * page.size + 1}–${page.number * page.size + page.content.length} / ${page.totalElements} sản phẩm`
  }

  return (
    <div className="us-page-root">
      <UserNavBar activeKey="store" />

      <section className="us-hero">
        <div className="us-container">
          <h1>Cửa hàng</h1>
          <p>Dụng cụ học tập, văn phòng phẩm cho mọi nhu cầu.</p>
          <SearchBox value={filters.q} onCommit={(q) => update({ q })} />
        </div>
      </section>

      <main className="us-container us-layout">
        <FilterPanel
          options={options}
          loading={filterOptions.loading}
          error={filterOptions.error}
          onRetry={filterOptions.reload}
          filters={filters}
          activeCount={activeCount}
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          onToggleCategory={toggleCategory}
          onToggleProduct={toggleProduct}
          onPriceChange={changePrice}
          onToggleAttribute={toggleAttribute}
          onClear={clearFilters}
        />

        <section className="us-results" ref={resultsRef}>
          <SortBar
            summary={summary}
            sortValue={`${filters.sort}:${filters.direction}`}
            size={filters.size}
            activeCount={activeCount}
            onSortChange={changeSort}
            onSizeChange={(size) => update({ size })}
            onOpenFilters={() => setFiltersOpen(true)}
          />

          <ActiveFilters
            filters={filters}
            options={options}
            onClearKeyword={() => update({ q: '' })}
            onToggleCategory={toggleCategory}
            onToggleProduct={toggleProduct}
            onPriceChange={changePrice}
            onToggleAttribute={toggleAttribute}
            onClear={clearFilters}
          />

          {products.error ? (
            <div className="us-state" role="alert">
              <h2>Không tải được sản phẩm</h2>
              <p>Vui lòng kiểm tra kết nối hoặc thử lại.</p>
              <button type="button" className="us-btn" onClick={products.reload}>
                Thử lại
              </button>
            </div>
          ) : page && !hasResults ? (
            <div className="us-state">
              <h2>Không tìm thấy sản phẩm phù hợp</h2>
              <p>Hãy thử bỏ bớt bộ lọc hoặc đổi từ khóa tìm kiếm.</p>
              {activeCount > 0 && (
                <button type="button" className="us-btn" onClick={clearFilters}>
                  Xóa tất cả bộ lọc
                </button>
              )}
            </div>
          ) : (
            <>
              <ProductGrid
                products={page?.content}
                loading={products.loading}
                skeletonCount={filters.size}
                onOpenProduct={openProduct}
              />
              <Pagination
                page={page?.number ?? 0}
                totalPages={page?.totalPages ?? 0}
                onChange={changePage}
              />
            </>
          )}
        </section>
      </main>
      <UserFooter />
    </div>
  )
}
