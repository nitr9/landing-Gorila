'use client'

import { FC, useRef } from 'react'
import { HTMLMotionProps, motion, useInView } from 'motion/react'

import { cn } from '@/lib/utils'

type AnimationType =
  | 'fadeIn'
  | 'fadeInUp'
  | 'popIn'
  | 'shiftInUp'
  | 'rollIn'
  | 'whipIn'
  | 'whipInUp'
  | 'calmInUp'

interface Props extends HTMLMotionProps<'div'> {
  text: string
  type?: AnimationType
  delay?: number
  duration?: number
}

const animationVariants = {
  fadeIn: {
    container: {
      hidden: { opacity: 0 },
      visible: (i: number = 1) => ({
        opacity: 1,
        transition: { staggerChildren: 0.05, delayChildren: i * 0.3 },
      }),
    },
    child: {
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: 'spring' as const,
          damping: 12,
          stiffness: 100,
        },
      },
      hidden: { opacity: 0, y: 10 },
    },
  },
  fadeInUp: {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 },
      },
    },
    child: {
      visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
      hidden: { opacity: 0, y: 20 },
    },
  },
  popIn: {
    container: {
      hidden: { scale: 0 },
      visible: {
        scale: 1,
        transition: { staggerChildren: 0.05, delayChildren: 0.2 },
      },
    },
    child: {
      visible: {
        opacity: 1,
        scale: 1.1,
        transition: { type: 'spring' as const, damping: 15, stiffness: 400 },
      },
      hidden: { opacity: 0, scale: 0 },
    },
  },
  calmInUp: {
    container: {
      hidden: {},
      visible: (i: number = 1) => ({
        transition: { staggerChildren: 0.01, delayChildren: 0.2 * i },
      }),
    },
    child: {
      hidden: {
        y: '200%',
        transition: {
          ease: [0.455, 0.03, 0.515, 0.955] as const,
          duration: 0.85,
        },
      },
      visible: {
        y: 0,
        transition: {
          ease: [0.125, 0.92, 0.69, 0.975] as const,
          duration: 0.75,
        },
      },
    },
  },
  shiftInUp: {
    container: {
      hidden: {},
      visible: (i: number = 1) => ({
        transition: { staggerChildren: 0.01, delayChildren: 0.2 * i },
      }),
    },
    child: {
      hidden: {
        y: '100%',
        transition: {
          ease: [0.75, 0, 0.25, 1] as const,
          duration: 0.6,
        },
      },
      visible: {
        y: 0,
        transition: {
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1] as const,
        },
      },
    },
  },
  whipInUp: {
    container: {
      hidden: {},
      visible: (i: number = 1) => ({
        transition: { staggerChildren: 0.01, delayChildren: 0.2 * i },
      }),
    },
    child: {
      hidden: {
        y: '200%',
        transition: {
          ease: [0.455, 0.03, 0.515, 0.955] as const,
          duration: 0.45,
        },
      },
      visible: {
        y: 0,
        transition: {
          ease: [0.5, -0.15, 0.25, 1.05] as const,
          duration: 0.75,
        },
      },
    },
  },
  rollIn: {
    container: {
      hidden: {},
      visible: {},
    },
    child: {
      hidden: {
        opacity: 0,
        y: `0.25em`,
      },
      visible: {
        opacity: 1,
        y: `0em`,
        transition: {
          duration: 0.65,
          ease: [0.65, 0, 0.75, 1] as const,
        },
      },
    },
  },
  whipIn: {
    container: {
      hidden: {},
      visible: {},
    },
    child: {
      hidden: {
        opacity: 0,
        y: `0.35em`,
      },
      visible: {
        opacity: 1,
        y: `0em`,
        transition: {
          duration: 0.45,
          ease: [0.85, 0.1, 0.9, 1.2] as const,
        },
      },
    },
  },
}

const TextAnimate: FC<Props> = ({
  text,
  type = 'whipInUp',
  className,
  ...props
}: Props) => {
  const ref = useRef(null)
  /* El original animaba al montar, así que en una sección a mitad de página
     el efecto ya había pasado cuando se llegaba. Acá dispara al entrar en
     pantalla, una sola vez. */
  const isInView = useInView(ref, { once: true, amount: 0.4 })

  const letters = Array.from(text)
  const { container, child } = animationVariants[type]

  if (type === 'rollIn' || type === 'whipIn') {
    return (
      <h2 ref={ref} className={className}>
        {text.split(' ').map((word, index) => {
          return (
            <motion.span
              className="mr-[0.25em] inline-block whitespace-nowrap"
              aria-hidden="true"
              key={index}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              variants={container}
              transition={{
                delayChildren: index * 0.13,
                staggerChildren: 0.025,
              }}
            >
              {word.split('').map((character, index) => {
                return (
                  <motion.span
                    aria-hidden="true"
                    key={index}
                    variants={child}
                    className="-mr-[0.01em] inline-block"
                  >
                    {character}
                  </motion.span>
                )
              })}
            </motion.span>
          )
        })}
      </h2>
    )
  }

  /* Las variantes que suben desde abajo (y: '200%') necesitan que cada letra
     tenga su propia máscara que la recorte mientras sube. El original ponía
     un solo overflow:hidden en el contenedor, que solo funciona si el texto
     entra en una línea: con dos, las letras quedan desplazadas fuera de
     lugar en vez de emerger. */
  const subeDesdeAbajo =
    type === 'calmInUp' || type === 'whipInUp' || type === 'shiftInUp'

  return (
    <motion.h2
      ref={ref}
      role="heading"
      variants={container}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      /* Las clases de tipografía las pone quien lo usa: el original traía
         font-black y colores fijos que no son los de este proyecto. */
      className={cn('flex flex-wrap', className)}
      {...props}
    >
      {letters.map((letter, index) =>
        subeDesdeAbajo ? (
          <span
            key={index}
            className="inline-block overflow-hidden align-bottom"
          >
            <motion.span className="inline-block" variants={child}>
              {letter === ' ' ? ' ' : letter}
            </motion.span>
          </span>
        ) : (
          <motion.span key={index} variants={child}>
          {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
        )
      )}
    </motion.h2>
  )
}

export { TextAnimate }
export default TextAnimate
