import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Script } from './supabase'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 复制文本到剪贴板
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // 降级方案
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      const result = document.execCommand('copy')
      textArea.remove()
      return result
    }
  } catch (error) {
    console.error('Failed to copy text:', error)
    return false
  }
}

// 格式化日期
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return '刚刚'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes}分钟前`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours}小时前`
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days}天前`
  } else {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
}

// 截断文本
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text
  }
  return text.slice(0, maxLength) + '...'
}

// 生成标签颜色
export function generateTagColor(tag: string): string {
  const colors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-yellow-100 text-yellow-800',
    'bg-red-100 text-red-800',
    'bg-purple-100 text-purple-800',
    'bg-pink-100 text-pink-800',
    'bg-indigo-100 text-indigo-800',
    'bg-gray-100 text-gray-800'
  ]
  
  // 基于标签名称生成一致的颜色
  let hash = 0
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
}

// 过滤和搜索话术
export function filterScripts(
  scripts: Script[],
  searchTerm: string,
  selectedTags: string[]
): Script[] {
  return scripts.filter(script => {
    // 搜索词过滤
    const matchesSearch = !searchTerm || 
      script.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      script.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (script.module?.name && script.module.name.toLowerCase().includes(searchTerm.toLowerCase()))
    
    // 标签过滤
    const matchesTags = selectedTags.length === 0 || 
      (script.tags && selectedTags.every(tag => script.tags!.includes(tag)))
    
    return matchesSearch && matchesTags
  })
}

// 构建模块树结构
export function buildModuleTree(modules: any[]): any[] {
  const moduleMap = new Map()
  const rootModules: any[] = []
  
  // 创建模块映射
  modules.forEach(module => {
    moduleMap.set(module.id, { ...module, children: [] })
  })
  
  // 构建树结构
  modules.forEach(module => {
    const moduleWithChildren = moduleMap.get(module.id)
    if (module.parent_id) {
      const parent = moduleMap.get(module.parent_id)
      if (parent) {
        parent.children.push(moduleWithChildren)
      }
    } else {
      rootModules.push(moduleWithChildren)
    }
  })
  
  return rootModules
}