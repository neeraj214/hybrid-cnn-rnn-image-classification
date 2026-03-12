import { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home' },
  { to: '/try-model', label: 'Try Model' },
  { to: '/architecture', label: 'Architecture' },
  { to: '/metrics', label: 'Metrics' },
  { to: '/dataset', label: 'Dataset' },
  { to: '/about', label: 'About' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed top-0 w-full z-50">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mt-4 rounded-xl shadow-soft backdrop-blur bg-white/70 ring-1 ring-white/60">
          <div className="flex h-14 items-center justify-between px-4">
            <Link to="/" className="font-semibold text-primary">
              Hybrid CNN-RNN
            </Link>
            <div className="hidden md:flex items-center gap-4">
              {links.map((l) => (
                <motion.div key={l.to} whileHover={{ scale: 1.04 }}>
                  <NavLink
                    to={l.to}
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-lg transition ${
                        isActive ? 'bg-primary/10 text-primary' : 'hover:bg-soft.gray'
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}
            </div>
            <button
              className="md:hidden p-2 rounded-lg hover:bg-soft.gray"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          {open && (
            <div className="md:hidden border-t border-white/60 px-4 pb-4">
              <div className="flex flex-col gap-2 pt-2">
                {links.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="px-3 py-2 rounded-lg hover:bg-soft.gray"
                  >
                    {l.label}
                  </NavLink>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
