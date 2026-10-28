import { useEffect, useRef, useState } from 'react'

export default function StoreSelect({ value, options, onChange, ariaLabel, fullWidth = false }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const selectedIndex = options.findIndex((option) => String(option.value) === String(value))
  const selectedOption = options[selectedIndex]

  useEffect(() => {
    if (!open) return undefined

    function closeOnOutsideClick(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }

    document.addEventListener('pointerdown', closeOnOutsideClick)
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick)
  }, [open])

  function moveFocus(event, index) {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    event.preventDefault()
    const direction = event.key === 'ArrowDown' ? 1 : -1
    const nextIndex = (index + direction + options.length) % options.length
    rootRef.current?.querySelector(`[data-option-index="${nextIndex}"]`)?.focus()
  }

  function handleTriggerKeyDown(event) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!open) {
        setOpen(true)
        return
      }
      moveFocus(event, selectedIndex >= 0 ? selectedIndex : 0)
    } else if (event.key === 'Escape' && open) {
      setOpen(false)
    }
  }

  function selectOption(option) {
    onChange(option.value)
    setOpen(false)
    triggerRef.current?.focus()
  }

  return (
    <div className={`us-dropdown${fullWidth ? ' us-dropdown--full' : ''}`} ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className="us-select"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleTriggerKeyDown}
      >
        {selectedOption?.label ?? ''}
      </button>
      {open && (
        <div className="us-select__menu" role="listbox" aria-label={ariaLabel}>
          {options.map((option, index) => {
            const selected = String(option.value) === String(value)
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected}
                data-option-index={index}
                className={`us-select__option${selected ? ' is-selected' : ''}`}
                onClick={() => selectOption(option)}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') {
                    setOpen(false)
                    triggerRef.current?.focus()
                  } else {
                    moveFocus(event, index)
                  }
                }}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
