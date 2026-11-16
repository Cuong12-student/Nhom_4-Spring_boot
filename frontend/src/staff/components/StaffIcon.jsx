const paths = {
  orders: <><path d="M7 3.75h10a2 2 0 0 1 2 2v14.5l-3.5-2-3.5 2-3.5-2-3.5 2V5.75a2 2 0 0 1 2-2Z" /><path d="M8.5 8h7M8.5 11.5h7M8.5 15h4" /></>,
  inventory: <><path d="m3.5 8 8.5-4.5L20.5 8v8L12 20.5 3.5 16V8Z" /><path d="m3.5 8 8.5 4.5L20.5 8M12 12.5v8M7.75 5.75l8.5 4.5" /></>,
  statistics: <><path d="M4 20h16M6.5 16V11M12 16V5M17.5 16V8" /><circle cx="6.5" cy="8" r="1" /><circle cx="17.5" cy="5" r="1" /></>,
  check: <><circle cx="12" cy="12" r="8.5" /><path d="m8.5 12 2.4 2.4 4.8-5" /></>,
  cancel: <><circle cx="12" cy="12" r="8.5" /><path d="m9 9 6 6M15 9l-6 6" /></>,
  pending: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  book: <><path d="M4 5.5c2.8-1 5.5-.6 8 1.1 2.5-1.7 5.2-2.1 8-1.1v12.7c-2.8-1-5.5-.6-8 1.1-2.5-1.7-5.2-2.1-8-1.1V5.5Z" /><path d="M12 6.6v12.7" /></>,
}

export default function StaffIcon({ name, className = '' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {paths[name]}
  </svg>
}
