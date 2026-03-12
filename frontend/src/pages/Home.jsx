import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div>
        <h1 className="text-3xl font-bold">Hybrid CNN-RNN Image Classification</h1>
        <p className="mt-3 text-gray-700">
          Professional AI dashboard foundation with modern UI, smooth animations, and responsive layout.
        </p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-xl bg-white shadow-soft h-64"
      />
    </div>
  )
}
