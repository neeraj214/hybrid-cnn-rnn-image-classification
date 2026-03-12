import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'

const data = Array.from({ length: 10 }, (_, i) => ({ epoch: i + 1, acc: 50 + i }))

export default function Metrics() {
  return (
    <div className="rounded-xl bg-white shadow-soft p-6">
      <h2 className="text-xl font-semibold">Metrics</h2>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="epoch" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="acc" stroke="#3b82f6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
