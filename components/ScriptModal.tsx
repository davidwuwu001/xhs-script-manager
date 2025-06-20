'use client'

import { useEffect } from 'react'
import { Script } from '@/lib/supabase'
import { formatDate, generateTagColor } from '@/lib/utils'
import CopyButton from './CopyButton'
import { X, Hash, Copy, Calendar } from 'lucide-react'

interface ScriptModalProps {
  script: Script
  onClose: () => void
}

export default function ScriptModal({ script, onClose }: ScriptModalProps) {
  // 处理 ESC 键关闭
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onClose])

  // 阻止背景滚动
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* 背景遮罩 */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 modal-overlay"
        onClick={onClose}
      />
      
      {/* 模态框内容 */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden modal-content">
          {/* 头部 */}
          <div className="flex items-start justify-between p-6 border-b border-gray-200">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {script.title}
              </h2>
              {script.module && (
                <div className="flex items-center text-sm text-gray-600">
                  <Hash className="w-4 h-4 mr-1" />
                  <span>{script.module.name}</span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="关闭"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* 内容区域 */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {/* 话术内容 */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">话术内容</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {script.content}
                </p>
              </div>
            </div>
            
            {/* 标签 */}
            {script.tags && script.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">标签</h3>
                <div className="flex flex-wrap gap-2">
                  {script.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 text-sm rounded-full ${generateTagColor(tag)}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* 统计信息 */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center text-sm text-gray-600">
                <Copy className="w-4 h-4 mr-2" />
                <span>复制次数: <span className="font-medium text-gray-900">{script.copy_count}</span></span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>创建时间: <span className="font-medium text-gray-900">{formatDate(script.created_at)}</span></span>
              </div>
            </div>
          </div>
          
          {/* 底部操作栏 */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-500">
              💡 提示: 点击复制按钮可以快速复制话术内容
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                关闭
              </button>
              <CopyButton
                text={script.content}
                scriptId={script.id}
                size="md"
                variant="default"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}