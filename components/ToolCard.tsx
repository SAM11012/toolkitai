import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { LucideIcon, ArrowRight, Sparkles, Zap, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ToolCardProps {
  name: string
  description: string
  icon: LucideIcon
  href: string
  featured?: boolean
  onClick?: (href: string) => void
  index?: number
}

const colorVariants = [
  {
    border: 'hover:border-blue-500/50',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    gradient: 'from-blue-500 to-cyan-400',
    shadow: 'hover:shadow-blue-500/10'
  },
  {
    border: 'hover:border-purple-500/50',
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    gradient: 'from-purple-500 to-pink-400',
    shadow: 'hover:shadow-purple-500/10'
  },
  {
    border: 'hover:border-pink-500/50',
    bg: 'bg-pink-50',
    text: 'text-pink-600',
    gradient: 'from-pink-500 to-rose-400',
    shadow: 'hover:shadow-pink-500/10'
  },
  {
    border: 'hover:border-amber-500/50',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    gradient: 'from-amber-500 to-orange-400',
    shadow: 'hover:shadow-amber-500/10'
  },
  {
    border: 'hover:border-emerald-500/50',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    gradient: 'from-emerald-500 to-green-400',
    shadow: 'hover:shadow-emerald-500/10'
  },
  {
    border: 'hover:border-indigo-500/50',
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
    gradient: 'from-indigo-500 to-violet-400',
    shadow: 'hover:shadow-indigo-500/10'
  }
]

export function ToolCard({ name, description, icon: Icon, href, featured = false, onClick, index = 0 }: ToolCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(href)
    }
  }

  const variant = colorVariants[index % colorVariants.length]

  return (
    <div onClick={handleClick} className="group cursor-pointer h-full">
      <Card className={cn(
        "relative h-full overflow-hidden transition-all duration-300 ease-out bg-white border-2 border-transparent p-0 gap-0",
        "hover:-translate-y-1.5",
        variant.border,
        variant.shadow,
        "shadow-sm hover:shadow-xl"
      )}>
        {/* Left Color Border */}
        <div className={cn(
          "absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b transition-all duration-300",
          variant.gradient
        )} />

        <CardHeader className="pb-4 pt-6 px-6">
          <div className="flex justify-between items-start mb-2">
            <div className={cn(
              "p-3 rounded-xl transition-all duration-300 group-hover:scale-110",
              variant.bg,
              variant.text
            )}>
              <Icon className="w-6 h-6" strokeWidth={2} />
            </div>
            {featured && (
              <span className={cn(
                "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r text-white shadow-sm",
                variant.gradient
              )}>
                <Sparkles className="w-3 h-3" />
                New
              </span>
            )}
            {!featured && index % 3 === 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                <Zap className="w-3 h-3" />
                Popular
              </span>
            )}
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-1">
            {name}
          </h3>
        </CardHeader>

        <CardContent className="px-6 pb-6">
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-6 h-10">
            {description}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>4.9</span>
              <span className="text-gray-300">•</span>
              <span>AI Powered</span>
            </div>

            <div className={cn(
              "flex items-center gap-1 text-sm font-semibold transition-all duration-300 transform translate-x-0 group-hover:translate-x-1",
              variant.text
            )}>
              Try now
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

