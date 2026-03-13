import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Database,
  Image as ImageIcon,
  Layers,
  Info,
  X,
  Maximize2,
  ChevronRight,
  Plane,
  Car,
  Bird,
  Cat,
  Ghost,
  Dog,
  Gamepad2,
  Trophy,
  Ship,
  Truck,
} from 'lucide-react'

const CLASS_INFO = [
  { name: 'Airplane', icon: <Plane className="w-6 h-6" />, color: 'bg-blue-100 text-blue-600' },
  { name: 'Automobile', icon: <Car className="w-6 h-6" />, color: 'bg-indigo-100 text-indigo-600' },
  { name: 'Bird', icon: <Bird className="w-6 h-6" />, color: 'bg-sky-100 text-sky-600' },
  { name: 'Cat', icon: <Cat className="w-6 h-6" />, color: 'bg-orange-100 text-orange-600' },
  { name: 'Deer', icon: <Ghost className="w-6 h-6" />, color: 'bg-green-100 text-green-600' },
  { name: 'Dog', icon: <Dog className="w-6 h-6" />, color: 'bg-yellow-100 text-yellow-600' },
  { name: 'Frog', icon: <Gamepad2 className="w-6 h-6" />, color: 'bg-emerald-100 text-emerald-600' },
  { name: 'Horse', icon: <Trophy className="w-6 h-6" />, color: 'bg-amber-100 text-amber-600' },
  { name: 'Ship', icon: <Ship className="w-6 h-6" />, color: 'bg-cyan-100 text-cyan-600' },
  { name: 'Truck', icon: <Truck className="w-6 h-6" />, color: 'bg-slate-100 text-slate-600' },
]

const SAMPLE_IMAGES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  url: `https://picsum.photos/seed/${i + 100}/300/300`,
  label: CLASS_INFO[i % 10].name,
}))

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
}

export default function Dataset() {
  const [selectedImage, setSelectedImage] = useState(null)

  return (
    <div className="space-y-12 pb-12">
      {/* 1. Dataset Overview */}
      <section>
        <motion.div {...fadeInUp} className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Dataset Explorer</h1>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            Explore the CIFAR-10 dataset, a benchmark in computer vision for image classification.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { label: 'Dataset Name', value: 'CIFAR-10', icon: <Database />, color: 'text-blue-600' },
            { label: 'Total Images', value: '60,000', icon: <ImageIcon />, color: 'text-purple-600' },
            { label: 'Classes', value: '10 Categories', icon: <Layers />, color: 'text-green-600' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100 flex items-center space-x-4"
            >
              <div className={`p-3 rounded-xl bg-gray-50 ${stat.color}`}>{stat.icon}</div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 2. Class Labels */}
      <section>
        <motion.div {...fadeInUp} className="flex items-center space-x-2 mb-6">
          <Info className="text-primary w-6 h-6" />
          <h2 className="text-2xl font-bold text-gray-900">Class Labels</h2>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {CLASS_INFO.map((cls, i) => (
            <motion.div
              key={cls.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -5 }}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-3"
            >
              <div className={`p-4 rounded-full ${cls.color} mb-1`}>
                {cls.icon}
              </div>
              <span className="font-semibold text-gray-800">{cls.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Image Gallery */}
      <section>
        <motion.div {...fadeInUp} className="flex items-center space-x-2 mb-6">
          <ImageIcon className="text-primary w-6 h-6" />
          <h2 className="text-2xl font-bold text-gray-900">Sample Gallery</h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {SAMPLE_IMAGES.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedImage(img)}
              className="relative group cursor-pointer aspect-square rounded-xl overflow-hidden shadow-sm"
            >
              <img
                src={img.url}
                alt={img.label}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="text-white text-center p-2">
                  <p className="text-xs font-bold uppercase tracking-wider mb-1">{img.label}</p>
                  <Maximize2 className="w-5 h-5 mx-auto" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Lightbox Preview */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors z-10"
              >
                <X className="w-6 h-6 text-gray-800" />
              </button>
              
              <div className="flex flex-col md:flex-row h-full">
                <div className="md:w-2/3 bg-gray-100 aspect-square md:aspect-auto">
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.label}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="md:w-1/3 p-8 flex flex-col justify-center">
                  <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-6 w-fit">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Sample Image</h3>
                  <div className="flex items-center text-gray-500 mb-6">
                    <span className="font-semibold text-gray-900 mr-2">Label:</span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-bold text-primary uppercase">
                      {selectedImage.label}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    This is a representative 32x32 image from the CIFAR-10 dataset, scaled up for better visibility. The dataset contains 6,000 images per class.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
