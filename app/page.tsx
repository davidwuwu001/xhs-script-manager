'use client'

import { useState, useEffect } from 'react'
import { scriptService, moduleService } from '@/lib/supabase'
import type { Script, Module } from '@/lib/supabase'
import { buildModuleTree } from '@/lib/utils'
import ScriptCard from '@/components/ScriptCard'
import SearchBar from '@/components/SearchBar'
import ModuleNav from '@/components/ModuleNav'
import { Loader2 } from 'lucide-react'

export default function Home() {
  const [scripts, setScripts] = useState<Script[]>([])
  const [modules, setModules] = useState<Module[]>([])
  const [moduleTree, setModuleTree] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null)
  const [availableTags, setAvailableTags] = useState<string[]>([])

  // 加载数据
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [scriptsResult, modulesResult] = await Promise.all([
        scriptService.getScripts(),
        moduleService.getModules()
      ])
      
      if (scriptsResult.error) {
        throw new Error(scriptsResult.error.message || '加载话术失败')
      }
      if (modulesResult.error) {
        throw new Error(modulesResult.error.message || '加载模块失败')
      }
      
      const scriptsData = scriptsResult.data || []
      const modulesData = modulesResult.data || []
      
      setScripts(scriptsData)
      setModules(modulesData)
      setModuleTree(buildModuleTree(modulesData))
      
      // 提取所有标签
      const tags = new Set<string>()
      scriptsData.forEach(script => {
        if (script.tags) {
          script.tags.forEach(tag => tags.add(tag))
        }
      })
      setAvailableTags(Array.from(tags))
      
    } catch (err) {
      console.error('加载数据失败:', err)
      setError(err instanceof Error ? err.message : '加载数据失败')
    } finally {
      setLoading(false)
    }
  }

  // 处理模块选择
  const handleModuleSelect = async (moduleId: string | null) => {
    try {
      setSelectedModuleId(moduleId)
      setLoading(true)
      setError(null)
      
      let result
      if (moduleId === null) {
        // 显示所有话术
        result = await scriptService.getScripts()
      } else {
        // 显示指定模块的话术
        result = await scriptService.getScriptsByModule(moduleId)
      }
      
      if (result.error) {
        throw new Error(result.error.message || '加载话术失败')
      }
      
      setScripts(result.data || [])
      
    } catch (err) {
      console.error('加载模块话术失败:', err)
      setError(err instanceof Error ? err.message : '加载模块话术失败')
    } finally {
      setLoading(false)
    }
  }

  // 过滤话术
  const filteredScripts = scripts.filter(script => {
    const matchesSearch = searchTerm === '' || 
      script.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      script.content.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesTags = selectedTags.length === 0 || 
      (script.tags && selectedTags.some(tag => script.tags!.includes(tag)))
    
    return matchesSearch && matchesTags
  })

  if (loading && scripts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
              <p className="text-gray-600">加载中...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            小红书话术管理系统
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            高效管理和使用您的小红书话术库，让内容创作更加便捷
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 左侧边栏 - 模块导航 */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">模块分类</h2>
              <ModuleNav 
                modules={moduleTree}
                selectedModule={selectedModuleId}
                onModuleSelect={handleModuleSelect}
                scripts={scripts}
              />
            </div>
          </div>

          {/* 主内容区 */}
          <div className="lg:col-span-3">
            {/* 搜索栏 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedTags={selectedTags}
                onTagsChange={setSelectedTags}
                availableTags={availableTags}
                placeholder="搜索话术标题或内容..."
              />
            </div>

            {/* 话术列表 */}
            {error ? (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                <p className="text-red-600">{error}</p>
                <button 
                  onClick={loadData}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  重试
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
                      <p className="text-gray-600 text-sm">加载中...</p>
                    </div>
                  </div>
                ) : filteredScripts.length === 0 ? (
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">暂无话术</h3>
                    <p className="text-gray-600 mb-6">
                      {searchTerm || selectedTags.length > 0 
                        ? '没有找到匹配的话术，请尝试调整搜索条件' 
                        : selectedModuleId 
                          ? '该模块下暂无话术'
                          : '还没有添加任何话术'
                      }
                    </p>
                    {(searchTerm || selectedTags.length > 0) && (
                      <button 
                        onClick={() => {
                          setSearchTerm('')
                          setSelectedTags([])
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        清除筛选条件
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    {/* 结果统计 */}
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm text-gray-600">
                        共找到 <span className="font-medium text-gray-900">{filteredScripts.length}</span> 条话术
                        {selectedModuleId && (
                          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                            {modules.find(m => m.id === selectedModuleId)?.name || '未知模块'}
                          </span>
                        )}
                      </p>
                    </div>
                    
                    {/* 话术卡片网格 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredScripts.map((script) => (
                        <ScriptCard 
                          key={script.id} 
                          script={script}
                          modules={modules}
                          onUpdate={loadData}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}