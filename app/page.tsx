'use client'

import { useState, useEffect } from 'react'
import { Script, Module, getScripts, moduleService } from '@/lib/supabase'
import { filterScripts, buildModuleTree } from '@/lib/utils'
import SearchBar from '@/components/SearchBar'
import ScriptCard from '@/components/ScriptCard'
import ModuleNav from '@/components/ModuleNav'
import ScriptModal from '@/components/ScriptModal'
import { Search, Grid, List, Plus, Settings } from 'lucide-react'

export default function Home() {
  // 状态管理
  const [scripts, setScripts] = useState<Script[]>([])
  const [modules, setModules] = useState<Module[]>([])
  const [filteredScripts, setFilteredScripts] = useState<Script[]>([])
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedScript, setSelectedScript] = useState<Script | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [error, setError] = useState<string | null>(null)

  // 获取所有标签
  const allTags = Array.from(
    new Set(
      scripts.flatMap(script => script.tags || [])
    )
  ).sort()

  // 加载数据
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const [scriptsData, modulesData] = await Promise.all([
        getScripts(),
        moduleService.getModules()
      ])
      
      setScripts(scriptsData)
      setModules(modulesData)
    } catch (error) {
      console.error('Error loading data:', error)
      setError('加载数据失败，请刷新页面重试')
    } finally {
      setIsLoading(false)
    }
  }

  // 过滤话术
  useEffect(() => {
    let filtered = scripts

    // 按模块过滤
    if (selectedModule) {
      filtered = filtered.filter(script => script.module_id === selectedModule)
    }

    // 按搜索词和标签过滤
    filtered = filterScripts(filtered, searchTerm, selectedTags)

    setFilteredScripts(filtered)
  }, [scripts, selectedModule, searchTerm, selectedTags])

  // 处理模块选择
  const handleModuleSelect = (moduleId: string | null) => {
    setSelectedModule(moduleId)
  }

  // 处理话术点击
  const handleScriptClick = (script: Script) => {
    setSelectedScript(script)
  }

  // 关闭模态框
  const handleCloseModal = () => {
    setSelectedScript(null)
  }

  // 刷新数据
  const handleRefresh = () => {
    loadData()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            重新加载
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* 头部 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">话</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">小红书话术管理</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* 视图切换 */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="网格视图"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="列表视图"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              
              {/* 操作按钮 */}
              <button
                onClick={handleRefresh}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="刷新"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 左侧导航 */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <ModuleNav
                modules={buildModuleTree(modules)}
                selectedModule={selectedModule}
                onModuleSelect={handleModuleSelect}
                scripts={scripts}
              />
            </div>
          </div>

          {/* 主内容区 */}
          <div className="flex-1 min-w-0">
            {/* 搜索栏 */}
            <div className="mb-6">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedTags={selectedTags}
                onTagsChange={setSelectedTags}
                availableTags={allTags}
              />
            </div>

            {/* 结果统计 */}
            <div className="mb-6 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                共找到 <span className="font-medium text-gray-900">{filteredScripts.length}</span> 条话术
                {selectedModule && (
                  <span className="ml-2">
                    · 模块: <span className="font-medium">
                      {modules.find(m => m.id === selectedModule)?.name || '未知模块'}
                    </span>
                  </span>
                )}
              </div>
            </div>

            {/* 话术列表 */}
            {filteredScripts.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到相关话术</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || selectedTags.length > 0
                    ? '尝试调整搜索条件或清除筛选'
                    : '暂无话术数据'}
                </p>
                {(searchTerm || selectedTags.length > 0) && (
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedTags([])
                      setSelectedModule(null)
                    }}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    清除所有筛选
                  </button>
                )}
              </div>
            ) : (
              <div className={`${
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
              }`}>
                {filteredScripts.map((script) => (
                  <ScriptCard
                    key={script.id}
                    script={script}
                    onClick={() => handleScriptClick(script)}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 话术详情模态框 */}
      {selectedScript && (
        <ScriptModal
          script={selectedScript}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}