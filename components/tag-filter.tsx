"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface TagFilterProps {
  tags: string[]
  activeTag: string
  onTagChange: (tag: string) => void
}

export function TagFilter({ tags, activeTag, onTagChange }: TagFilterProps) {
  const allTags = ["all", ...tags]

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-white mb-4">Filter by tag</h3>
      <div className="flex flex-wrap gap-2">
        {allTags.map((tag, index) => (
          <motion.div
            key={tag}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Button
              variant={activeTag === tag ? "default" : "outline"}
              size="sm"
              onClick={() => onTagChange(tag)}
              className={`
                capitalize transition-all duration-200
                ${
                  activeTag === tag
                    ? "bg-blue-500 text-white shadow-lg hover:bg-blue-600"
                    : "bg-gray-800 text-gray-200 border-gray-600 hover:bg-gray-700 hover:text-white"
                }
              `}
            >
              {tag === "all" ? "All Images" : tag}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
