'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { TESTIMONIALS } from '@/lib/mock-data'
import Image from 'next/image'

export function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <section id="testimonials" className="section-padding bg-gradient-to-b from-background to-border/10">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-lg mb-4">
            What Our Customers Say
          </h2>
          <p className="text-body max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers 
            have to say about their experience with CastleTech.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative max-w-4xl mx-auto"
        >
          {/* Carousel Container */}
          <div 
            className="relative overflow-hidden rounded-2xl bg-border/10 border border-border/50"
            data-carousel
            role="region"
            aria-label="Customer testimonials"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="p-8 md:p-12"
              >
                <div className="text-center space-y-6">
                  {/* Quote Icon */}
                  <div className="flex justify-center">
                    <Quote className="h-8 w-8 text-accent" />
                  </div>

                  {/* Testimonial Content */}
                  <blockquote className="text-xl md:text-2xl text-foreground leading-relaxed max-w-3xl mx-auto">
                    "{TESTIMONIALS[currentIndex].quote}"
                  </blockquote>

                  {/* Customer Info */}
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-accent/20">
                      <Image
                        src={TESTIMONIALS[currentIndex].avatar}
                        alt={TESTIMONIALS[currentIndex].name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-foreground">
                        {TESTIMONIALS[currentIndex].name}
                      </div>
                      <div className="text-muted">
                        {TESTIMONIALS[currentIndex].role}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8">
            {/* Previous Button */}
            <button
              onClick={goToPrevious}
              className="p-3 rounded-full bg-border/20 hover:bg-border/40 text-muted hover:text-foreground transition-all duration-200 hover:scale-105"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Dots Indicator */}
            <div className="flex space-x-2">
              {TESTIMONIALS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentIndex
                      ? 'bg-accent scale-125'
                      : 'bg-border hover:bg-border/60'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={goToNext}
              className="p-3 rounded-full bg-border/20 hover:bg-border/40 text-muted hover:text-foreground transition-all duration-200 hover:scale-105"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

        </motion.div>
      </div>
    </section>
  )
}
