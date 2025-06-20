'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { copyToClipboard, incrementCopyCount } from '@/lib/supabase'

interface CopyButtonProps {
  text: string
  scriptId?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'ghost' | 'outline'
}

export default function CopyButton({ 
  text, 
  scriptId, 
  className = '', 
  size = 'md',
  variant = 'default'
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation() // 防止触发父元素的点击事件
    
    if (isLoading) return
    
    setIsLoading(true)
    
    try {
      const success = await copyToClipboard(text)
      
      if (success) {
        setCopied(true)
        
        // 如果提供了 scriptId，增加复制计数
        if (scriptId) {
          try {
            await incrementCopyCount(scriptId)
          } catch (error) {
            console.error('Failed to increment copy count:', error)
            // 不影响复制功能，只是统计失败
          }
        }
        
        // 2秒后重置状态
        setTimeout(() => setCopied(false), 2000)
      } else {
        throw new Error('复制失败')
      }
    } catch (error) {
      console.error('Copy failed:', error)
      // 可以在这里添加错误提示
    } finally {
      setIsLoading(false)
    }
  }

  // 尺寸样式
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  }

  // 图标尺寸
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  // 变体样式
  const variantClasses = {
    default: copied 
      ? 'bg-green-500 text-white border-green-500' 
      : 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600',
    ghost: copied
      ? 'text-green-600 hover:bg-green-50'
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
    outline: copied
      ? 'border-green-500 text-green-600 bg-green-50'
      : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
  }

  return (
    <button
      onClick={handleCopy}
      disabled={isLoading}
      className={`
        inline-flex items-center justify-center gap-2 
        border rounded-lg font-medium transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
      title={copied ? '已复制' : '复制内容'}
    >
      {isLoading ? (
        <div className={`loading-spinner border-2 border-current border-t-transparent rounded-full ${iconSizes[size]}`} />
      ) : copied ? (
        <Check className={iconSizes[size]} />
      ) : (
        <Copy className={iconSizes[size]} />
      )}
      
      {size !== 'sm' && (
        <span>
          {copied ? '已复制' : '复制'}
        </span>
      )}
    </button>
  )
}