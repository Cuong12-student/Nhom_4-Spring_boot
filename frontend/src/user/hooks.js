import { useCallback, useEffect, useState } from 'react'
import { fetchFilterOptions, fetchStoreProductDetail, fetchStoreProducts } from './api/storeApi'

// Cả hai hook lưu kết quả kèm "key" của request đã tạo ra nó, nhờ vậy
// `loading` được suy ra (key hiện tại khác key của kết quả) mà không phải
// gọi setState đồng bộ trong effect. Dữ liệu cũ vẫn giữ lại trong lúc tải
// để danh sách không bị nháy trắng.

export function useStoreProducts(query, enabled = true) {
  const [reloadCount, setReloadCount] = useState(0)
  const key = `${reloadCount}|${query}`
  const [result, setResult] = useState({ key: null, data: null, error: null })

  useEffect(() => {
    if (!enabled) return undefined

    const controller = new AbortController()
    fetchStoreProducts(query, controller.signal)
      .then((data) => setResult({ key, data, error: null }))
      .catch((error) => {
        if (error.name === 'AbortError') return
        setResult((previous) => ({ key, data: previous.data, error }))
      })
    return () => controller.abort()
  }, [enabled, key, query])

  const reload = useCallback(() => setReloadCount((count) => count + 1), [])

  return {
    data: result.data,
    error: enabled && result.key === key ? result.error : null,
    loading: enabled && result.key !== key,
    reload,
  }
}

export function useStoreProductDetail(variantId) {
  const [reloadCount, setReloadCount] = useState(0)
  const key = `${reloadCount}|${variantId?.slug}|${variantId?.sku}`
  const [result, setResult] = useState({ key: null, data: null, error: null })

  useEffect(() => {
    if (!variantId?.slug || !variantId?.sku) return undefined

    const controller = new AbortController()
    fetchStoreProductDetail(variantId.slug, variantId.sku, controller.signal)
      .then((data) => setResult({ key, data, error: null }))
      .catch((error) => {
        if (error.name === 'AbortError') return
        setResult({ key, data: null, error })
      })
    return () => controller.abort()
  }, [key, variantId])

  const reload = useCallback(() => setReloadCount((count) => count + 1), [])

  return {
    data: result.key === key ? result.data : null,
    error: result.key === key ? result.error : null,
    loading: result.key !== key,
    reload,
  }
}

export function useFilterOptions(enabled = true) {
  const [reloadCount, setReloadCount] = useState(0)
  const [result, setResult] = useState({ key: null, data: null, error: null })

  useEffect(() => {
    if (!enabled) return undefined

    const controller = new AbortController()
    fetchFilterOptions(controller.signal)
      .then((data) => setResult({ key: reloadCount, data, error: null }))
      .catch((error) => {
        if (error.name === 'AbortError') return
        setResult({ key: reloadCount, data: null, error })
      })
    return () => controller.abort()
  }, [enabled, reloadCount])

  const reload = useCallback(() => setReloadCount((count) => count + 1), [])

  return {
    options: enabled && result.key === reloadCount ? result.data : null,
    error: enabled && result.key === reloadCount ? result.error : null,
    loading: enabled && result.key !== reloadCount,
    reload,
  }
}
