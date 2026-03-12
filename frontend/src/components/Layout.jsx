import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24">
        <div className="mx-auto max-w-7xl px-4">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}
