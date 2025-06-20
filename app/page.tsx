'use client'

import { useState, useEffect } from 'react'
import { Script, Module, scriptService, moduleService } from '@/lib/supabase'
import { filterScripts, buildModuleTree } from '@/lib/utils'
import SearchBar from '@/components/SearchBar'
import ScriptCard from '@/components/ScriptCard'
import ModuleNav from '@/components/ModuleNav'
import ScriptModal from '@/components/ScriptModal'
import { Settings, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [scripts, setScripts] = useState<Script[]>([])
  const [filteredScripts, setFilteredScripts] = useState<Script[]>([])
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedScript, setSelectedScript] = useState<Script | null>(null)
  const [loading, setLoading] = useState(true)
  const [modules, setModules] = useState<Module[]>([])
  const [moduleTree, setModuleTree] = useState<any[]>([])

  // 获取脚本数据
  const fetchScripts = async () => {
    try {
      setLoading(true)
      const data = selectedModuleId 
        ? await scriptService.getScriptsByModule(selectedModuleId)
        : await scriptService.getScripts()
      setScripts(data)
    } catch (error) {
      console.error('获取脚本失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 获取模块数据
  const fetchModules = async () => {
    try {
      const data = await moduleService.getModules()
      setModules(data)
      setModuleTree(buildModuleTree(data))
    } catch (error) {
      console.error('获取模块失败:', error)
    }
  }

  // 处理模块选择
  const handleModuleSelect = async (moduleId: string | null) => {
    setSelectedModuleId(moduleId)
    try {
      setLoading(true)
      const data = moduleId 
        ? await scriptService.getScriptsByModule(moduleId)
        : await scriptService.getScripts()
      setScripts(data)
    } catch (error) {
      console.error('获取脚本失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 处理搜索和筛选
  const handleSearch = (term: string, tags: string[]) => {
    setSearchTerm(term)
    setSelectedTags(tags)
  }

  // 获取所有标签
  const getAllTags = () => {
    const tagSet = new Set<string>()
    scripts.forEach(script => {
      script.tags.forEach(tag => tagSet.add(tag))
    })
    return Array.from(tagSet)
  }

  // 初始化数据
  useEffect(() => {
    fetchScripts()
    fetchModules()
  }, [])

  // 应用筛选
  useEffect(() => {
    const filtered = filterScripts(scripts, searchTerm, selectedTags)
    setFilteredScripts(filtered)
  }, [scripts, searchTerm, selectedTags])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 顶部导航 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                小红书话术管理器
              </h1>
            </div>
            <Link 
              href="/admin" 
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>管理后台</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* 左侧模块导航 */}
          <div className="w-64 flex-shrink-0">
            <ModuleNav 
              modules={moduleTree}
              selectedModuleId={selectedModuleId}
              onModuleSelect={handleModuleSelect}
            />
          </div>

          {/* 右侧内容区域 */}
          <div className="flex-1">
            {/* 搜索栏 */}
            <div className="mb-6">
              <SearchBar 
                onSearch={handleSearch}
                availableTags={getAllTags()}
              />
            </div>

            {/* 脚本列表 */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredScripts.map((script) => (
                  <ScriptCard
                    key={script.id}
                    script={script}
                    onClick={() => setSelectedScript(script)}
                  />
                ))}
              </div>
            )}

            {/* 空状态 */}
            {!loading && filteredScripts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">暂无脚本</h3>
                <p className="text-gray-500">
                  {searchTerm || selectedTags.length > 0 
                    ? '没有找到匹配的脚本，请尝试调整搜索条件' 
                    : '还没有添加任何脚本，请前往管理后台添加'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 脚本详情弹窗 */}
      {selectedScript && (
        <ScriptModal
          script={selectedScript}
          onClose={() => setSelectedScript(null)}
        />
      )}
    </div>
  )
}
