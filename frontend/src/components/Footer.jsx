import { Github } from 'lucide-react'

const badges = ['React', 'Vite', 'Tailwind', 'Framer Motion', 'Recharts', 'Lucide', 'Axios']

export default function Footer() {
  return (
    <footer className="mt-12 border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">Hybrid CNN-RNN Image Classification System</div>
            <div className="text-sm text-gray-600">Author: Neeraj</div>
          </div>
          <a
            href="https://github.com/neeraj214/hybrid-cnn-rnn-image-classification"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-soft.gray"
          >
            <Github size={18} />
            <span>GitHub</span>
          </a>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {badges.map((b) => (
            <span key={b} className="text-xs px-2 py-1 rounded-full bg-soft.gray">
              {b}
            </span>
          ))}
        </div>
      </div>
    </footer>
  )
}
