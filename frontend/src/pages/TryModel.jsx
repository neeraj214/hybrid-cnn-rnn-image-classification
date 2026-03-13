import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Trash2, PlayCircle, CheckCircle, AlertCircle } from 'lucide-react'
import api from '../services/api'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

const CLASS_NAMES = [
  'Airplane',
  'Automobile',
  'Bird',
  'Cat',
  'Deer',
  'Dog',
  'Frog',
  'Horse',
  'Ship',
  'Truck',
]

export default function TryModel() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [predicting, setPredicting] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const fileInputRef = useRef(null)

  const onBrowseClick = () => fileInputRef.current?.click()

  const onFileSelected = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (!f.type.startsWith('image/')) {
      setError('Please select a valid image file')
      return
    }
    const url = URL.createObjectURL(f)
    setFile(f)
    setPreview(url)
    setError(null)
    setResult(null)
  }

  const onDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)
    const f = e.dataTransfer.files?.[0]
    if (!f) return
    if (!f.type.startsWith('image/')) {
      setError('Please drop a valid image file')
      return
    }
    const url = URL.createObjectURL(f)
    setFile(f)
    setPreview(url)
    setError(null)
    setResult(null)
  }

  const removeImage = () => {
    if (preview) URL.revokeObjectURL(preview)
    setFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
  }

  const getTopK = (probs, k = 5) => {
    if (!Array.isArray(probs)) return []
    const idxs = probs.map((p, i) => [p, i]).sort((a, b) => b[0] - a[0]).slice(0, k)
    return idxs.map(([p, i]) => ({ name: CLASS_NAMES[i] ?? `Class ${i}`, prob: p }))
  }

  const runPrediction = async () => {
    if (!file) return
    setPredicting(true)
    setError(null)
    setResult(null)
    try {
      const form = new FormData()
      form.append('file', file)
      const { data } = await api.post('/predict', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const probabilities =
        data?.probabilities ||
        data?.probs ||
        (Array.isArray(data) ? data : null) ||
        []
      const top5 = data?.top5 || getTopK(probabilities, 5)
      const predIndex =
        typeof data?.predicted_class_index === 'number'
          ? data.predicted_class_index
          : top5?.[0]
          ? CLASS_NAMES.indexOf(top5[0].name)
          : probabilities.indexOf(Math.max(...probabilities))
      const confidence =
        typeof data?.confidence === 'number'
          ? data.confidence
          : probabilities?.[predIndex] ?? top5?.[0]?.prob ?? null
      const predictedClass =
        data?.predicted_class ||
        CLASS_NAMES[predIndex] ||
        'Unknown'
      const chartData = probabilities.map((p, i) => ({
        label: CLASS_NAMES[i],
        value: Math.max(0, Math.min(1, p)) * 100,
      }))
      setResult({
        predictedClass,
        confidence,
        top5,
        chartData,
      })
    } catch (err) {
      setError('Prediction failed. Ensure backend /predict endpoint is running.')
    } finally {
      setPredicting(false)
    }
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Try the Model</h2>

      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          setDragging(false)
        }}
        onDrop={onDrop}
        className={`rounded-xl border-2 border-dashed p-6 bg-white shadow-soft transition ${
          dragging ? 'border-primary bg-primary/5' : 'border-gray-300'
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
            <Upload className="text-primary" />
          </div>
          <div className="flex-1">
            <div className="font-medium">Drag & drop an image here</div>
            <div className="text-sm text-gray-600">or</div>
            <button
              onClick={onBrowseClick}
              className="mt-2 px-3 py-2 rounded-lg bg-primary text-white hover:brightness-105"
            >
              Click to browse files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileSelected}
            />
          </div>
          {preview && (
            <div className="relative">
              <img
                src={preview}
                alt="preview"
                className="w-32 h-32 object-cover rounded-lg ring-1 ring-black/5"
              />
              <button
                className="absolute -top-2 -right-2 p-2 rounded-full bg-white shadow hover:bg-soft.gray"
                onClick={removeImage}
                aria-label="Remove image"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={runPrediction}
          disabled={!file || predicting}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg shadow-soft transition ${
            !file || predicting
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-primary text-white hover:brightness-105'
          }`}
        >
          {predicting ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
              Predicting...
            </>
          ) : (
            <>
              <PlayCircle size={18} />
              Run Prediction
            </>
          )}
        </button>
        {error && (
          <div className="inline-flex items-center gap-2 text-red-600">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-white shadow-soft p-6 ring-1 ring-black/5"
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="text-primary" size={20} />
            <h3 className="text-lg font-semibold">Prediction Result</h3>
          </div>
          {predicting && (
            <div className="mt-4 space-y-3">
              <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-28 bg-gray-200 rounded animate-pulse" />
              <div className="h-20 w-full bg-gray-200 rounded animate-pulse" />
            </div>
          )}
          {!predicting && result && (
            <div className="mt-4 space-y-3">
              <div className="text-sm text-gray-600">Predicted Class</div>
              <div className="text-2xl font-bold">{result.predictedClass}</div>
              {result.confidence != null && (
                <div className="text-sm text-gray-700">
                  Confidence: {(result.confidence * 100).toFixed(2)}%
                </div>
              )}
              <div className="mt-3">
                <div className="text-sm font-medium">Top 5 Predictions</div>
                <ul className="mt-2 space-y-1">
                  {result.top5?.map((t, idx) => (
                    <li
                      key={`${t.name}-${idx}`}
                      className="flex justify-between rounded-lg px-3 py-2 bg-soft.gray hover:bg-gray-200 transition"
                    >
                      <span>{t.name}</span>
                      <span className="text-gray-700">{(t.prob * 100).toFixed(2)}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: result ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-xl bg-white shadow-soft p-6 ring-1 ring-black/5"
        >
          <div className="text-lg font-semibold mb-2">Class Probabilities</div>
          {predicting && (
            <div className="h-48 w-full bg-gray-200 rounded animate-pulse" />
          )}
          {!predicting && result && (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={result.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
