import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface IntroAnimationProps {
  onComplete: () => void
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [animationStage, setAnimationStage] = useState(0)

  useEffect(() => {
    const playAnimation = async () => {
      // Play audio (you can replace the src with your own audio file)
      if (audioRef.current) {
        audioRef.current.volume = 0.5
        audioRef.current.play().catch(e => console.log('Audio play failed:', e))
      }

      // Stage 1: Logo appears with glow
      await new Promise(resolve => setTimeout(resolve, 500))
      setAnimationStage(1)

      // Stage 2: Logo scales and rotates
      await new Promise(resolve => setTimeout(resolve, 1000))
      setAnimationStage(2)

      // Stage 3: Particles burst
      await new Promise(resolve => setTimeout(resolve, 800))
      setAnimationStage(3)

      // Stage 4: Fade out and complete
      await new Promise(resolve => setTimeout(resolve, 1000))
      setAnimationStage(4)

      await new Promise(resolve => setTimeout(resolve, 800))
      onComplete()
    }

    playAnimation()
  }, [onComplete])

  const logoVariants = {
    hidden: { scale: 0, opacity: 0, rotate: -180 },
    stage1: { 
      scale: 0.8, 
      opacity: 1, 
      rotate: 0,
      transition: { duration: 0.8, type: 'spring', bounce: 0.5 }
    },
    stage2: { 
      scale: 1.2, 
      rotate: 360,
      transition: { duration: 1, ease: 'easeInOut' }
    },
    stage3: {
      scale: 1,
      rotate: 360,
      transition: { duration: 0.5 }
    },
    stage4: {
      scale: 0.5,
      opacity: 0,
      transition: { duration: 0.8, ease: 'easeInOut' }
    }
  }

  const glowVariants = {
    hidden: { boxShadow: '0 0 0 rgba(212, 175, 55, 0)', scale: 1 },
    stage1: {
      boxShadow: '0 0 40px rgba(212, 175, 55, 0.6), 0 0 80px rgba(212, 175, 55, 0.4)',
      scale: [1, 1.05, 1],
      transition: {
        scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
        boxShadow: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
      }
    },
    stage4: {
      boxShadow: '0 0 0 rgba(212, 175, 55, 0)',
      scale: 0.5,
      opacity: 0,
      transition: { duration: 0.8 }
    }
  }

  const particleVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (i: number) => ({
      opacity: [0, 1, 0],
      scale: [0, 1.5, 0],
      x: Math.cos(i * 45) * 150,
      y: Math.sin(i * 45) * 150,
      transition: { duration: 0.8, ease: 'easeOut' }
    })
  }

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    stage1: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.3 } },
    stage4: { opacity: 0, y: -30, transition: { duration: 0.5 } }
  }

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900"
      initial={{ opacity: 1 }}
      animate={{ opacity: animationStage === 4 ? 0 : 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Audio element - you can replace the src with your own audio file */}
      <audio 
        ref={audioRef} 
        src="https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3" 
        preload="auto"
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* Burst particles */}
        <AnimatePresence>
          {animationStage >= 3 && [...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-amber-400 rounded-full"
              custom={i}
              variants={particleVariants}
              initial="hidden"
              animate="visible"
            />
          ))}
        </AnimatePresence>

        {/* Logo */}
        <motion.div
          className="relative mb-6"
          variants={glowVariants}
          initial="hidden"
          animate={animationStage >= 1 ? (animationStage === 4 ? 'stage4' : 'stage1') : 'hidden'}
        >
          <motion.img
            src="/lumen-logo.png"
            alt="Lumen Logo"
            className="w-40 h-40 object-contain"
            variants={logoVariants}
            initial="hidden"
            animate={`stage${animationStage}`}
          />
        </motion.div>

        {/* Text */}
        <motion.h1
          className="text-4xl font-bold bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent"
          variants={textVariants}
          initial="hidden"
          animate={animationStage >= 1 ? (animationStage === 4 ? 'stage4' : 'stage1') : 'hidden'}
        >
          LUMEN
        </motion.h1>

        <motion.p
          className="mt-2 text-gray-400 text-lg"
          variants={textVariants}
          initial="hidden"
          animate={animationStage >= 1 ? (animationStage === 4 ? 'stage4' : 'stage1') : 'hidden'}
          style={{ transitionDelay: animationStage >= 1 ? '0.5s' : '0s' }}
        >
          Smart Shopping Assistant
        </motion.p>
      </div>
    </motion.div>
  )
}

export default IntroAnimation
