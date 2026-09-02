const NAV_LINKS = [
  { label: 'Sonido', href: '#' },
  { label: 'Diseño', href: '#' },
  { label: 'Acerca de', href: '#' },
]

export function Navigation() {
  return (
    <nav className="animate-fade-rise absolute right-8 top-8 z-20 hidden items-center gap-8 sm:flex md:right-16 lg:right-24">
      {NAV_LINKS.map((link) => (
        <a
          key={link.label}
          href={link.href}
          className="text-sm text-white/60 transition-colors hover:text-foreground"
        >
          {link.label}
        </a>
      ))}
    </nav>
  )
}
