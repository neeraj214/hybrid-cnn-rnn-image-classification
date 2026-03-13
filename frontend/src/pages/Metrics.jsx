import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
  Legend,
} from 'recharts'
import { Activity, TrendingUp, Grid, BarChart3, Info } from 'lucide-react'
import api from '../services/api'

const CLASS_NAMES = [
  'Airplane', 'Automobile', 'Bird', 'Cat', 'Deer',
  'Dog', 'Frog', 'Horse', 'Ship', 'Truck'
]

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const MetricCard = ({ title, icon: Icon, children, explanation, delay = 0 }) => (
  <motion.div
    variants={fadeInUp}
    initial="initial"
    animate="animate"
    transition={{ delay }}
    className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100 flex flex-col h-full"
  >
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-primary/10 rounded-lg text-primary">
        <Icon size={20} />
      </div>
      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
    </div>
    <div className="flex-grow min-h-[300px]">
      {children}
    </div>
    <div className="mt-4 pt-4 border-t border-gray-50 flex gap-2 items-start text-sm text-gray-500 italic">
      <Info size={16} className="mt-0.5 flex-shrink-0 text-primary/60" />
      <p>{explanation}</p>
    </div>
  </motion.div>
)

export default function Metrics() {
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState({
    epochs: [],
    train_loss: [],
    val_accuracy: [],
    confusion_matrix: [],
    class_dist: []
  })

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // In a real app, this would be: const { data } = await api.get('/metrics')
        // For now, we simulate the API response
        setTimeout(() => {
          const mockData = {
            epochs: Array.from({ length: 20 }, (_, i) => i + 1),
            train_loss: Array.from({ length: 20 }, (_, i) => 1.5 * Math.exp(-i / 8) + Math.random() * 0.1),
            val_accuracy: Array.from({ length: 20 }, (_, i) => 0.4 + 0.5 * (1 - Math.exp(-i / 10)) + Math.random() * 0.05),
            confusion_matrix: Array.from({ length: 10 }, () => 
              Array.from({ length: 10 }, () => Math.floor(Math.random() * 50))
            ),
            class_dist: CLASS_NAMES.map(name => ({
              name,
              count: 5000 // CIFAR-10 has 5000 images per class in training
            }))
          }
          
          // Diagonal should be higher for a "trained" model
          for(let i=0; i<10; i++) mockData.confusion_matrix[i][i] = 80 + Math.floor(Math.random() * 20)

          setMetrics(mockData)
          setLoading(false)
        }, 800)
      } catch (err) {
        console.error('Failed to fetch metrics', err)
        setLoading(false)
      }
    }
    fetchMetrics()
  }, [])

  const lossData = metrics.epochs.map((e, i) => ({
    epoch: e,
    loss: metrics.train_loss[i]
  }))

  const accuracyData = metrics.epochs.map((e, i) => ({
    epoch: e,
    accuracy: metrics.val_accuracy[i] * 100
  }))

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-12">
      <motion.div {...fadeInUp} className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Training Metrics</h1>
        <p className="mt-2 text-gray-600">Performance analysis of the Hybrid CNN-RNN Model</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 1. Training Loss */}
        <MetricCard 
          title="Training Loss vs Epoch" 
          icon={Activity}
          explanation="Measures how well the model is learning. A decreasing curve indicates the model is successfully minimizing prediction errors over time."
          delay={0.1}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lossData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="epoch" label={{ value: 'Epoch', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Loss', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="loss" 
                stroke="#3b82f6" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#3b82f6' }}
                activeDot={{ r: 6 }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </MetricCard>

        {/* 2. Validation Accuracy */}
        <MetricCard 
          title="Validation Accuracy" 
          icon={TrendingUp}
          explanation="The percentage of correct predictions on unseen data. This helps identify if the model is generalizing well or overfitting."
          delay={0.2}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={accuracyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="epoch" label={{ value: 'Epoch', position: 'insideBottom', offset: -5 }} />
              <YAxis domain={[0, 100]} label={{ value: 'Accuracy (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="accuracy" 
                stroke="#10b981" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#10b981' }}
                activeDot={{ r: 6 }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </MetricCard>

        {/* 3. Confusion Matrix */}
        <MetricCard 
          title="Confusion Matrix" 
          icon={Grid}
          explanation="A grid showing the relationship between actual and predicted classes. High values along the diagonal indicate strong classification performance."
          delay={0.3}
        >
          <div className="grid grid-cols-11 gap-1 h-full">
            <div className="col-span-1"></div>
            {CLASS_NAMES.map(name => (
              <div key={name} className="text-[10px] font-medium text-gray-400 rotate-45 origin-bottom-left truncate h-8">
                {name}
              </div>
            ))}
            
            {metrics.confusion_matrix.map((row, i) => (
              <>
                <div key={`label-${i}`} className="text-[10px] font-medium text-gray-400 flex items-center justify-end pr-2">
                  {CLASS_NAMES[i]}
                </div>
                {row.map((val, j) => {
                  const opacity = val / 100
                  return (
                    <motion.div
                      key={`${i}-${j}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + (i * 10 + j) * 0.005 }}
                      className="aspect-square rounded-sm flex items-center justify-center text-[10px] text-white font-bold"
                      style={{ backgroundColor: `rgba(59, 130, 246, ${opacity + 0.1})` }}
                      title={`Actual: ${CLASS_NAMES[i]}, Pred: ${CLASS_NAMES[j]} - ${val}`}
                    >
                      {val > 20 ? val : ''}
                    </motion.div>
                  )
                })}
              </>
            ))}
          </div>
        </MetricCard>

        {/* 4. Class Distribution */}
        <MetricCard 
          title="Class Distribution" 
          icon={BarChart3}
          explanation="Shows the number of samples per class in the dataset. Balanced distribution ensures the model doesn't become biased towards specific classes."
          delay={0.4}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metrics.class_dist} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} animationDuration={1500}>
                {metrics.class_dist.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(${210 + index * 5}, 70%, 60%)`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </MetricCard>
      </div>
    </div>
  )
}
