import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Brain, Image as ImageIcon, BarChart3 } from 'lucide-react'

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="grid md:grid-cols-2 gap-10 items-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Hybrid CNN-RNN Image Classification
          </h1>
          <p className="mt-4 text-gray-700 text-lg">
            A deep learning system combining CNN feature extraction with RNN sequence modeling to
            classify images.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              to="/try-model"
              className="px-5 py-3 rounded-lg bg-primary text-white shadow-soft hover:brightness-105 transition"
            >
              Try Image Classification
            </Link>
            <Link
              to="/architecture"
              className="px-5 py-3 rounded-lg bg-white ring-1 ring-black/5 shadow-soft hover:bg-soft.gray transition"
            >
              View Model Architecture
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-xl bg-white shadow-soft h-72 md:h-80 overflow-hidden"
        >
          <motion.svg
            initial={{ y: 0 }}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            viewBox="0 0 400 300"
            className="absolute inset-0 w-full h-full"
          >
            <defs>
              <linearGradient id="grad" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.25" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="400" height="300" fill="url(#grad)" />
            {[...Array(8)].map((_, i) => {
              const x = 50 + i * 40
              const y = 70 + (i % 2) * 40
              return (
                <g key={i}>
                  <circle cx={x} cy={y} r="6" fill="#3b82f6" opacity="0.9" />
                  <circle cx={x + 30} cy={y + 30} r="6" fill="#60a5fa" opacity="0.9" />
                  <line
                    x1={x}
                    y1={y}
                    x2={x + 30}
                    y2={y + 30}
                    stroke="#3b82f6"
                    strokeWidth="2"
                    opacity="0.6"
                  />
                </g>
              )
            })}
          </motion.svg>
          <div className="absolute inset-0 pointer-events-none" />
        </motion.div>
      </section>

      <section id="features">
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Brain className="text-primary" size={24} />}
            title="Hybrid CNN-RNN Model"
            desc="Combines spatial feature extraction with sequence modeling for robust classification."
          />
          <FeatureCard
            icon={<ImageIcon className="text-primary" size={24} />}
            title="Real-time Image Prediction"
            desc="Responsive UI to try the model on sample images and view predictions instantly."
          />
          <FeatureCard
            icon={<BarChart3 className="text-primary" size={24} />}
            title="Interactive Training Metrics"
            desc="Visualize loss and accuracy across epochs with smooth, interactive charts."
          />
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, desc }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.35 }}
      className="rounded-xl bg-white shadow-soft p-6 ring-1 ring-black/5"
    >
      <div className="flex items-center gap-3">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
          {icon}
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="mt-3 text-gray-700">{desc}</p>
    </motion.div>
  )
}
