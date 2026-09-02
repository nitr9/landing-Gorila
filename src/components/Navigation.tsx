import { Button } from '@/components/ui/button'

const NAV_LINKS = [
  { label: 'Home', href: '#', active: true },
  { label: 'Studio', href: '#', active: false },
  { label: 'About', href: '#', active: false },
  { label: 'Journal', href: '#', active: false },
  { label: 'Reach Us', href: '#', active: false },
]

export function Navigation() {
  return (
    <nav className="text-over-video relative z-10 mx-auto flex w-full max-w-7xl flex-row items-center justify-between px-8 py-6">
      <a
        href="#"
        className="shrink-0 text-3xl tracking-tight text-foreground"
        style={{ fontFamily: "'Instrument Serif', serif" }}
      >
        NicoNT<sup className="text-xs">®</sup>
      </a>

      <div className="hidden flex-1 items-center justify-center gap-6 px-6 md:flex lg:gap-8">
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            aria-current={link.active ? 'page' : undefined}
            className={
              link.active
                ? 'text-sm text-foreground transition-colors'
                : 'text-sm text-white/70 transition-colors hover:text-foreground'
            }
          >
            {link.label}
          </a>
        ))}
      </div>

      <Button variant="glass" size="nav" className="shrink-0">
        Begin Journey
      </Button>
    </nav>
  )
}
