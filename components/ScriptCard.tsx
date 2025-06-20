'use client'

import { Script } from '@/lib/supabase'
import { formatDate, truncateText, generateTagColor } from '@/lib/utils'
import CopyButton from './CopyButton'
import { Eye, Copy, Calendar, Hash } from 'lucide-react'

interface ScriptCardProps {
  script: Script
  onClick: () => void
  viewMode?: 'grid' | 'list'
}

export default function ScriptCard({ script, onClick, viewMode = 'grid' }: ScriptCardProps) {
  const handleCardClick = () => {
    onClick()
  }

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 script-card">
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 cursor-pointer" onClick={handleCardClick}>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-medium text-gray-900 truncate pr-4">
                  {script.title}
                </h3>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    onClick={handleCardClick}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="查看详情"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <CopyButton
                    text={script.content}
                    scriptId={script.id}
                    size="sm"
                    variant="ghost"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                {script.module && (
                  <span className="flex items-center">
                    <Hash className="w-3 h-3 mr-1" />
                    {script.module.name}
                  </span>
                )}
                <span className="flex items-center">
                  <Copy className="w-3 h-3 mr-1" />
                  {script.copy_count} 次复制
                </span>
                <span className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDate(script.created_at)}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {truncateText(script.content, 120)}
              </p>
              
              {script.tags && script.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {script.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 text-xs rounded-full ${generateTagColor(tag)}`}
                    >
                      {tag}
                    </span>
                  ))}
                  {script.tags.length > 3 && (
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                      +{script.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 script-card overflow-hidden">
      <div className="p-6">
        {/* 头部 */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0 cursor-pointer" onClick={handleCardClick}>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {script.title}
            </h3>
            {script.module && (
              <div className="flex items-center text-sm text-gray-600 mb-3">
                <Hash className="w-3 h-3 mr-1" />
                <span>{script.module.name}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* 内容预览 */}
        <div className="cursor-pointer" onClick={handleCardClick}>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {truncateText(script.content, 100)}
          </p>
        </div>
        
        {/* 标签 */}
        {script.tags && script.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {script.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className={`px-2 py-1 text-xs rounded-full ${generateTagColor(tag)}`}
              >
                {tag}
              </span>
            ))}
            {script.tags.length > 3 && (
              <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                +{script.tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        {/* 底部信息和操作 */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span className="flex items-center">
              <Copy className="w-3 h-3 mr-1" />
              {script.copy_count}
            </span>
            <span className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(script.created_at)}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCardClick}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="查看详情"
            >
              <Eye className="w-4 h-4" />
            </button>
            <CopyButton
              text={script.content}
              scriptId={script.id}
              size="sm"
              variant="ghost"
            />
          </div>
        </div>
      </div>
    </div>
  )
}