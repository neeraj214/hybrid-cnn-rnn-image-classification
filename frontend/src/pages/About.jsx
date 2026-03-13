import { motion } from 'framer-motion'
import {
  Github,
  BookOpen,
  Target,
  Cpu,
  User,
  ExternalLink,
  Code2,
  Terminal,
  Layers,
  Globe,
  Monitor,
} from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
}

const techStack = [
  { name: 'Python', icon: <Terminal className="w-4 h-4" />, color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { name: 'PyTorch', icon: <Cpu className="w-4 h-4" />, color: 'bg-orange-50 text-orange-600 border-orange-100' },
  { name: 'Deep Learning', icon: <Layers className="w-4 h-4" />, color: 'bg-purple-50 text-purple-600 border-purple-100' },
  { name: 'Computer Vision', icon: <Target className="w-4 h-4" />, color: 'bg-green-50 text-green-600 border-green-100' },
  { name: 'React', icon: <Monitor className="w-4 h-4" />, color: 'bg-sky-50 text-sky-600 border-sky-100' },
  { name: 'Tailwind', icon: <Code2 className="w-4 h-4" />, color: 'bg-cyan-50 text-cyan-600 border-cyan-100' },
]

export default function About() {
  return (
    <div className="max-w-4xl mx-auto space-y-16 pb-12">
      {/* Hero Section */}
      <motion.section {...fadeInUp} className="text-center pt-8">
        <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-6">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Research Project</h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          A Hybrid Deep Learning Approach for Image Classification using CNN and RNN
        </p>
      </motion.section>

      {/* 1 & 2. Motivation & Problem Statement */}
      <div className="grid md:grid-cols-2 gap-12">
        <motion.section {...fadeInUp} className="space-y-4">
          <div className="flex items-center space-x-3 mb-2">
            <Target className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-gray-900">Project Motivation</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            While Convolutional Neural Networks (CNNs) are the gold standard for spatial feature extraction, they often treat image data as isolated snapshots. 
            <span className="block mt-4">
              Hybrid CNN-RNN architectures are useful because they allow us to model the <strong>sequential dependencies</strong> between different parts of an image, treating the extracted feature maps as a meaningful temporal or logical sequence.
            </span>
          </p>
        </motion.section>

        <motion.section {...fadeInUp} className="space-y-4">
          <div className="flex items-center space-x-3 mb-2">
            <Layers className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-gray-900">Problem Statement</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            Traditional CNN models capture local spatial features excellently but may miss broader <strong>sequential relationships</strong> inherent in complex visual data. 
            <span className="block mt-4">
              Our research focuses on how hybrid models improve <strong>representation learning</strong> by processing spatial feature sequences, leading to more robust classification performance on datasets like CIFAR-10.
            </span>
          </p>
        </motion.section>
      </div>

      {/* 3. Technology Stack */}
      <motion.section {...fadeInUp} className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Technology Stack</h2>
          <p className="text-gray-600">Built with modern tools for machine learning and web visualization.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {techStack.map((tech) => (
            <div
              key={tech.name}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full border ${tech.color} font-semibold shadow-sm`}
            >
              {tech.icon}
              <span>{tech.name}</span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 4. Author Section */}
      <motion.section 
        {...fadeInUp} 
        className="bg-white rounded-3xl p-8 shadow-soft border border-gray-100 flex flex-col md:flex-row items-center gap-8"
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center text-white shadow-lg">
          <User className="w-12 h-12" />
        </div>
        <div className="flex-grow text-center md:text-left space-y-2">
          <h3 className="text-2xl font-bold text-gray-900">Author Information</h3>
          <div className="space-y-1 text-gray-600">
            <p className="text-lg font-medium text-gray-800">Neeraj Negi</p>
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <Globe className="w-4 h-4" />
              <p>University Research Program</p>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <BookOpen className="w-4 h-4" />
              <p>Advanced Deep Learning & Computer Vision</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 5. GitHub Repository */}
      <motion.section {...fadeInUp} className="text-center">
        <a
          href="https://github.com/neeraj214/hybrid-cnn-rnn-image-classification"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-3 px-8 py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold transition-all transform hover:scale-105 shadow-xl group"
        >
          <Github className="w-6 h-6" />
          <span>Explore Repository</span>
          <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
        </a>
      </motion.section>
    </div>
  )
}
