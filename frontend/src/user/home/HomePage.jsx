import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchHomeProducts } from '../api/storeApi'
import { formatPrice } from '../format'
import UserFooter from '../UserFooter'
import UserNavBar from '../UserNavBar'
import '../userTheme.css'
import '../customerPages.css'

function chooseRandom(items, count) {
  const shuffled = [...items]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]]
  }
  return shuffled.slice(0, count)
}

function productPath(product) {
  return `/store/${encodeURIComponent(product.slug)}/${encodeURIComponent(product.sku)}`
}

function HomeProductCard({ product, onOpen }) {
  return (
    <a className="cp-product" href={productPath(product)} onClick={(event) => onOpen(event, product)}>
      <div className="cp-product__image">
        {product.mainImage ? (
          <img src={product.mainImage} alt={product.name} loading="lazy" />
        ) : (
          <span aria-hidden="true">✎</span>
        )}
        <span className="cp-product__category">{product.categoryName}</span>
      </div>
      <div className="cp-product__body">
        <h3>{product.name}</h3>
        <p>{product.sku}</p>
        <strong>{formatPrice(product.price)}</strong>
        <span className="cp-product__link">Xem thông tin sản phẩm →</span>
      </div>
    </a>
  )
}

function makeCategoryGroups(products) {
  const categories = new Map()
  products.forEach((product) => {
    const key = product.idCategory ?? product.categoryName
    if (!categories.has(key)) categories.set(key, [])
    categories.get(key).push(product)
  })
  return chooseRandom(
    [...categories.values()].filter((items) => items.length > 0),
    2,
  ).map((items) => ({
    name: items[0].categoryName,
    idCategory: items[0].idCategory,
    products: chooseRandom(items, 3),
  }))
}

export default function HomePage() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [featured, setFeatured] = useState([])
  const [featuredIndex, setFeaturedIndex] = useState(0)
  const [categoryGroups, setCategoryGroups] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    fetchHomeProducts(controller.signal)
      .then((page) => {
        const available = page.content ?? []
        setProducts(available)
        setFeatured(chooseRandom(available, 7))
        setFeaturedIndex(0)
        setCategoryGroups(makeCategoryGroups(available))
        setError('')
      })
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') {
          console.error('Không thể tải sản phẩm trang chủ:', requestError)
          setError('Chưa thể tải danh sách sản phẩm. Vui lòng thử lại.')
        }
      })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [reload])

  useEffect(() => {
    if (featured.length < 2) return undefined
    const timer = window.setInterval(() => {
      setFeaturedIndex((index) => (index + 1) % featured.length)
    }, 5000)
    return () => window.clearInterval(timer)
  }, [featured.length])

  useEffect(() => {
    if (products.length < 2) return undefined
    const timer = window.setInterval(() => {
      setFeatured(chooseRandom(products, 7))
      setFeaturedIndex(0)
    }, 120000)
    return () => window.clearInterval(timer)
  }, [products])

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
    navigate(productPath(product))
  }

  function search(event) {
    event.preventDefault()
    navigate(`/store${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`)
  }

  function retryProducts() {
    setError('')
    setLoading(true)
    setReload((count) => count + 1)
  }

  const currentProduct = featured[featuredIndex]

  return (
    <div className="cp-page">
      <UserNavBar activeKey="home" />

      <main>
        <section className="cp-home-hero">
          <div className="cp-home-hero__content">
            <span className="cp-eyebrow">GÓC HỌC TẬP CỦA BẠN</span>
            <h1>Mỗi ngày đến lớp, thêm một niềm vui.</h1>
            <p>
              Tìm những món dụng cụ học tập thiết thực, từ cuốn vở đầu tiên
              đến chiếc bút giúp bạn ghi lại ý tưởng hay.
            </p>
            <form className="cp-search" role="search" onSubmit={search}>
              <label className="cp-sr" htmlFor="home-search">Tìm sản phẩm</label>
              <input
                id="home-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Bạn đang cần tìm gì?"
              />
              <button className="cp-button" type="submit">Tìm sản phẩm</button>
            </form>
            <a className="cp-text-link" href="/store">Khám phá cửa hàng <span aria-hidden="true">→</span></a>
          </div>

          <div className="cp-featured" aria-live="polite">
            <div className="cp-featured__top">
              <span>Gợi ý ngẫu nhiên</span>
              <span>{featured.length ? `${featuredIndex + 1} / ${featured.length}` : 'Hôm nay'}</span>
            </div>
            {currentProduct ? (
              <a className="cp-featured__product" href={productPath(currentProduct)} onClick={(event) => openProduct(event, currentProduct)}>
                <div className="cp-featured__image">
                  {currentProduct.mainImage
                    ? <img src={currentProduct.mainImage} alt={currentProduct.name} />
                    : <span aria-hidden="true">✎</span>}
                </div>
                <div className="cp-featured__info">
                  <span>{currentProduct.categoryName}</span>
                  <h2>{currentProduct.name}</h2>
                  <strong>{formatPrice(currentProduct.price)}</strong>
                  <span className="cp-featured__cta">Xem chi tiết sản phẩm →</span>
                </div>
              </a>
            ) : (
              <div className="cp-featured__empty">
                {loading ? 'Đang tìm sản phẩm phù hợp...' : 'Chưa có sản phẩm để giới thiệu.'}
              </div>
            )}
            <div className="cp-featured__dots" aria-label="Chọn sản phẩm gợi ý">
              {featured.map((product, index) => (
                <button
                  key={product.idVariant}
                  type="button"
                  aria-label={`Xem gợi ý ${index + 1}: ${product.name}`}
                  aria-current={index === featuredIndex ? 'true' : undefined}
                  onClick={() => setFeaturedIndex(index)}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="cp-shortcuts cp-container" aria-label="Truy cập nhanh">
          <a href="/store" className="cp-shortcut">
            <span className="cp-shortcut__icon" aria-hidden="true">▤</span>
            <span><strong>Mua sắm</strong><small>Khám phá toàn bộ cửa hàng</small></span>
            <span aria-hidden="true">→</span>
          </a>
          <a href="/cart" className="cp-shortcut">
            <span className="cp-shortcut__icon" aria-hidden="true">🛒</span>
            <span><strong>Giỏ hàng</strong><small>Xem món đồ bạn đã chọn</small></span>
            <span aria-hidden="true">→</span>
          </a>
          <a href="/profile" className="cp-shortcut">
            <span className="cp-shortcut__icon" aria-hidden="true">♡</span>
            <span><strong>Tài khoản</strong><small>Thông tin và đơn hàng của bạn</small></span>
            <span aria-hidden="true">→</span>
          </a>
        </section>

        <section className="cp-categories cp-container">
          <div className="cp-section-heading">
            <div>
              <span className="cp-eyebrow">GỢI Ý DÀNH CHO BẠN</span>
              <h2>Khám phá theo danh mục</h2>
              <p>Mỗi lần ghé thăm, một vài danh mục và sản phẩm được chọn ngẫu nhiên.</p>
            </div>
            <a className="cp-text-link" href="/store">Xem tất cả sản phẩm →</a>
          </div>

          {error ? (
            <div className="cp-message cp-message--error" role="alert">
              <span>{error}</span>
              <button className="cp-button cp-button--light" type="button" onClick={retryProducts}>
                Thử lại
              </button>
            </div>
          ) : loading ? (
            <div className="cp-message">Đang tải gợi ý sản phẩm...</div>
          ) : categoryGroups.length ? (
            <div className="cp-category-groups">
              {categoryGroups.map((group) => (
                <section className="cp-category-group" key={group.name}>
                  <div className="cp-category-group__heading">
                    <h3>{group.name}</h3>
                    <a href={group.idCategory ? `/store?categoryId=${group.idCategory}` : '/store'}>
                      Xem danh mục <span aria-hidden="true">→</span>
                    </a>
                  </div>
                  <div className="cp-product-grid">
                    {group.products.map((product) => (
                      <HomeProductCard key={product.idVariant} product={product} onOpen={openProduct} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="cp-message">Danh mục sẽ xuất hiện khi cửa hàng có sản phẩm.</div>
          )}
        </section>

        <section className="cp-promise">
          <div className="cp-container cp-promise__inner">
            <div><strong>Chọn đúng món cần dùng</strong><span>Bộ lọc rõ ràng, thông tin sản phẩm minh bạch.</span></div>
            <div><strong>Giá cả dễ theo dõi</strong><span>Tạm tính và số lượng được cập nhật trong giỏ.</span></div>
            <div><strong>Đơn hàng trong tầm tay</strong><span>Kiểm tra lịch sử mua hàng ngay trong hồ sơ.</span></div>
          </div>
        </section>
      </main>

      <UserFooter />
    </div>
  )
}
