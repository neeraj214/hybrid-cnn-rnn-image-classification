import { motion } from 'framer-motion'
import {
  Layers,
  Cpu,
  ArrowDown,
  Activity,
  Zap,
  Box,
  Repeat,
  Trophy,
  Search,
  Database,
} from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
}

const flowSteps = [
  { title: 'Input Image', icon: <Database className="w-6 h-6" />, color: 'bg-blue-100 text-blue-600' },
  { title: 'CNN Feature Extraction', icon: <Layers className="w-6 h-6" />, color: 'bg-indigo-100 text-indigo-600' },
  { title: 'Feature Map', icon: <Box className="w-6 h-6" />, color: 'bg-purple-100 text-purple-600' },
  { title: 'Sequence Conversion', icon: <Activity className="w-6 h-6" />, color: 'bg-pink-100 text-pink-600' },
  { title: 'RNN / LSTM', icon: <Repeat className="w-6 h-6" />, color: 'bg-orange-100 text-orange-600' },
  { title: 'Fully Connected Layer', icon: <Cpu className="w-6 h-6" />, color: 'bg-teal-100 text-teal-600' },
  { title: 'Final Prediction', icon: <Trophy className="w-6 h-6" />, color: 'bg-green-100 text-green-600' },
]

export default function Architecture() {
  return (
    <div className="space-y-12 pb-12">
      {/* 1. Architecture Overview */}
      <section>
        <motion.div {...fadeInUp} className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Architecture Overview</h1>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            Our hybrid model combines the spatial awareness of Convolutional Neural Networks with the sequential processing power of LSTMs.
          </p>
        </motion.div>

        <div className="flex flex-col items-center space-y-4">
          {flowSteps.map((step, index) => (
            <div key={step.title} className="flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center p-4 rounded-xl shadow-soft ${step.color} w-64 md:w-80`}
              >
                <div className="p-2 rounded-lg bg-white/50 mr-4">{step.icon}</div>
                <span className="font-semibold text-gray-800">{step.title}</span>
              </motion.div>
              {index < flowSteps.length - 1 && (
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: 16 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.1 }}
                  className="w-px bg-gray-300 my-2 relative"
                >
                  <ArrowDown className="w-4 h-4 text-gray-400 absolute -bottom-4 -left-2" />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 2. CNN Section */}
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <motion.div {...fadeInUp} className="order-2 md:order-1">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-100 text-indigo-600 mb-4">
            <Layers className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">CNN: The Visual Eye</h2>
          <div className="space-y-4 text-gray-700">
            <div className="flex items-start">
              <div className="mt-1 mr-3 p-1 bg-indigo-50 rounded-full text-indigo-500">
                <Search className="w-4 h-4" />
              </div>
              <p>
                <span className="font-semibold">Convolutional Layers:</span> These layers apply mathematical filters to the image, automatically learning to detect edges, textures, and complex shapes.
              </p>
            </div>
            <div className="flex items-start">
              <div className="mt-1 mr-3 p-1 bg-indigo-50 rounded-full text-indigo-500">
                <Search className="w-4 h-4" />
              </div>
              <p>
                <span className="font-semibold">Feature Extraction:</span> Instead of looking at raw pixels, the model identifies high-level features like eyes, wheels, or wings depending on the dataset.
              </p>
            </div>
            <div className="flex items-start">
              <div className="mt-1 mr-3 p-1 bg-indigo-50 rounded-full text-indigo-500">
                <Search className="w-4 h-4" />
              </div>
              <p>
                <span className="font-semibold">Spatial Patterns:</span> CNNs maintain the relative positions of features, which is crucial for recognizing objects regardless of where they appear in the image.
              </p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="order-1 md:order-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-xl flex items-center justify-center h-64"
        >
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">32x32</div>
            <div className="text-indigo-100 opacity-80 uppercase tracking-widest text-sm">Input Resolution</div>
          </div>
        </motion.div>
      </section>

      {/* 3. RNN / LSTM Section */}
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl p-8 text-white shadow-xl flex items-center justify-center h-64"
        >
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">1x16</div>
            <div className="text-orange-100 opacity-80 uppercase tracking-widest text-sm">Feature Sequence</div>
          </div>
        </motion.div>
        <motion.div {...fadeInUp}>
          <div className="inline-flex p-3 rounded-2xl bg-orange-100 text-orange-600 mb-4">
            <Repeat className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">RNN/LSTM: Contextual Learning</h2>
          <div className="space-y-4 text-gray-700">
            <div className="flex items-start">
              <div className="mt-1 mr-3 p-1 bg-orange-50 rounded-full text-orange-500">
                <Activity className="w-4 h-4" />
              </div>
              <p>
                <span className="font-semibold">Sequential Learning:</span> By treating the feature map as a sequence, the model can learn patterns that emerge from scanning the image in a specific order.
              </p>
            </div>
            <div className="flex items-start">
              <div className="mt-1 mr-3 p-1 bg-orange-50 rounded-full text-orange-500">
                <Activity className="w-4 h-4" />
              </div>
              <p>
                <span className="font-semibold">Feature Relationships:</span> LSTM cells have "memory" that helps them understand how features in one part of the image relate to those in another.
              </p>
            </div>
            <div className="flex items-start">
              <div className="mt-1 mr-3 p-1 bg-orange-50 rounded-full text-orange-500">
                <Activity className="w-4 h-4" />
              </div>
              <p>
                <span className="font-semibold">Contextual Depth:</span> This adds a second layer of abstraction beyond spatial features, focusing on the logical structure of the object.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 4. Hybrid Model Advantage */}
      <section>
        <motion.div {...fadeInUp} className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Hybrid Model Advantages</h2>
          <p className="mt-2 text-gray-600">Why combine CNNs and RNNs?</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: 'Better Pattern Learning',
              desc: 'Combines local spatial detection with global sequential understanding.',
              icon: <Zap className="w-6 h-6" />,
              color: 'border-blue-200 bg-blue-50',
            },
            {
              title: 'Sequence Modeling',
              desc: 'Exploits the ordered nature of feature maps for deeper insights.',
              icon: <Activity className="w-6 h-6" />,
              color: 'border-purple-200 bg-purple-50',
            },
            {
              title: 'Improved Accuracy',
              desc: 'Higher robustness and precision on complex image classification tasks.',
              icon: <Trophy className="w-6 h-6" />,
              color: 'border-green-200 bg-green-50',
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-2xl border-2 ${item.color} shadow-sm`}
            >
              <div className="mb-4 text-gray-800">{item.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-700">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
