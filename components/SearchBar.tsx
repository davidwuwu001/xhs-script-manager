'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X, Plus, ChevronDown } from 'lucide-react'

interface SearchBarProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  availableTags: string[]
}

export default function SearchBar({
  searchTerm,
  onSearchChange,
  selectedTags,
  onTagsChange,
  availableTags
}: SearchBarProps) {
  const [showTagDropdown, setShowTagDropdown] = useState(false)
  const [tagSearchTerm, setTagSearchTerm] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // 过滤可用标签（排除已选择的）
  const filteredAvailableTags = availableTags
    .filter(tag => !selectedTags.includes(tag))
    .filter(tag => tag.toLowerCase().includes(tagSearchTerm.toLowerCase()))

  // 处理标签选择
  const handleTagSelect = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      onTagsChange([...selectedTags, tag])
    }
    setTagSearchTerm('')
    setShowTagDropdown(false)
  }

  // 处理标签移除
  const handleTagRemove = (tagToRemove: string) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagToRemove))
  }

  // 清除搜索
  const handleClearSearch = () => {
    onSearchChange('')
    searchInputRef.current?.focus()
  }

  // 清除所有标签
  const handleClearAllTags = () => {
    onTagsChange([])
  }

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowTagDropdown(false)
        setTagSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="p-4">
        {/* 搜索输入框 */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="搜索话术标题、内容或模块..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="
              block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              placeholder-gray-500 text-sm search-input
            "
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* 已选择的标签 */}
        {selectedTags.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">已选择标签:</span>
              <button
                onClick={handleClearAllTags}
                className="text-xs text-gray-500 hover:text-red-600 transition-colors"
              >
                清除全部
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {tag}
                  <button
                    onClick={() => handleTagRemove(tag)}
                    className="ml-2 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 添加标签 */}
        {availableTags.length > 0 && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowTagDropdown(!showTagDropdown)}
              className="
                inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg
                text-sm text-gray-700 bg-white hover:bg-gray-50
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                transition-colors
              "
            >
              <Plus className="h-4 w-4 mr-2" />
              添加标签
              <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${
                showTagDropdown ? 'rotate-180' : ''
              }`} />
            </button>

            {/* 标签下拉框 */}
            {showTagDropdown && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="p-3">
                  {/* 标签搜索 */}
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="搜索标签..."
                      value={tagSearchTerm}
                      onChange={(e) => setTagSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* 标签列表 */}
                  <div className="max-h-40 overflow-y-auto">
                    {filteredAvailableTags.length === 0 ? (
                      <div className="text-sm text-gray-500 text-center py-2">
                        {tagSearchTerm ? '没有找到匹配的标签' : '没有可用标签'}
                      </div>
                    ) : (
                      filteredAvailableTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => handleTagSelect(tag)}
                          className="
                            w-full text-left px-3 py-2 text-sm text-gray-700
                            hover:bg-gray-100 rounded-md transition-colors
                          "
                        >
                          {tag}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 当前搜索状态显示 */}
        {(searchTerm || selectedTags.length > 0) && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-600">
              <span className="font-medium">当前筛选:</span>
              {searchTerm && (
                <span className="ml-2">
                  关键词: <span className="font-medium text-gray-900">"{searchTerm}"</span>
                </span>
              )}
              {selectedTags.length > 0 && (
                <span className="ml-2">
                  标签: <span className="font-medium text-gray-900">{selectedTags.join(', ')}</span>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}