import { useCallback, useEffect, useState } from 'react'
import { fetchFilterOptions, fetchStoreProducts } from './api/storeApi'

// Cả hai hook lưu kết quả kèm "key" của request đã tạo ra nó, nhờ vậy
// `loading` được suy ra (key hiện tại khác key của kết quả) mà không phải
// gọi setState đồng bộ trong effect. Dữ liệu cũ vẫn giữ lại trong lúc tải
// để danh sách không bị nháy trắng.

export function useStoreProducts(query) {
  const [reloadCount, setReloadCount] = useState(0)
  const key = `${reloadCount}|${query}`
  const [result, setResult] = useState({ key: null, data: null, error: null })

  useEffect(() => {
    const controller = new AbortController()
    fetchStoreProducts(query, controller.signal)
      .then((data) => setResult({ key, data, error: null }))
      .catch((error) => {
        if (error.name === 'AbortError') return
        setResult((previous) => ({ key, data: previous.data, error }))
      })
    return () => controller.abort()
  }, [key, query])

  const reload = useCallback(() => setReloadCount((count) => count + 1), [])

  return {
    data: result.data,
    error: result.key === key ? result.error : null,
    loading: result.key !== key,
    reload,
  }
}

export function useFilterOptions() {
  const [reloadCount, setReloadCount] = useState(0)
  const [result, setResult] = useState({ key: null, data: null, error: null })

  useEffect(() => {
    const controller = new AbortController()
    fetchFilterOptions(controller.signal)
      .then((data) => setResult({ key: reloadCount, data, error: null }))
      .catch((error) => {
        if (error.name === 'AbortError') return
        setResult({ key: reloadCount, data: null, error })
      })
    return () => controller.abort()
  }, [reloadCount])

  const reload = useCallback(() => setReloadCount((count) => count + 1), [])

  return {
    options: result.key === reloadCount ? result.data : null,
    error: result.key === reloadCount ? result.error : null,
    loading: result.key !== reloadCount,
    reload,
  }
}
