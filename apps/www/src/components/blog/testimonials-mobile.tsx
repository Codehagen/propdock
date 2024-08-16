"use client"

import { useRef, useState } from "react"

interface Testimonial {
  id: number
  content: string
}

export default function TestimonialsMobile({
  testimonials,
}: {
  testimonials: Testimonial[]
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="flex flex-col justify-center space-y-4 pt-8 sm:hidden">
      <div ref={ref} className="space-y-6">
        {testimonials.slice(0, expanded ? undefined : 4).map((testimonial) => (
          <div key={testimonial.id} className="rounded-lg border p-4">
            <p>{testimonial.content}</p>
          </div>
        ))}
      </div>
      {!expanded && (
        <button
          className="mx-5 rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium shadow-sm"
          onClick={() => setExpanded(true)}
        >
          Vis mer
        </button>
      )}
      {expanded && (
        <button
          className="sticky inset-x-0 bottom-4 mx-5 rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium shadow-sm"
          onClick={() => setExpanded(false)}
        >
          Vis mindre
        </button>
      )}
    </div>
  )
}
