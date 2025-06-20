'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, ChevronRight, Folder, FolderOpen, Hash } from 'lucide-react'
import { Module, Script } from '@/lib/supabase'

interface ModuleNavProps {
  modules: Module[]
  selectedModule: string | null
  onModuleSelect: (moduleId: string | null) => void
  scripts: Script[]
}

interface ModuleTreeNodeProps {
  module: Module
  selectedModule: string | null
  onModuleSelect: (moduleId: string | null) => void
  scripts: Script[]
  level: number
  expandedModules: Set<string>
  onToggleExpand: (moduleId: string) => void
}

// 递归渲染模块树节点
function ModuleTreeNode({ 
  module, 
  selectedModule, 
  onModuleSelect, 
  scripts, 
  level,
  expandedModules,
  onToggleExpand
}: ModuleTreeNodeProps) {
  const hasChildren = module.children && module.children.length > 0
  const isExpanded = expandedModules.has(module.id)
  const isSelected = selectedModule === module.id
  
  // 计算该模块下的话术数量（包括子模块）
  const getScriptCount = (mod: Module): number => {
    let count = scripts.filter(script => script.module_id === mod.id).length
    if (mod.children) {
      count += mod.children.reduce((sum, child) => sum + getScriptCount(child), 0)
    }
    return count
  }
  
  const scriptCount = getScriptCount(module)
  
  const handleClick = () => {
    onModuleSelect(module.id)
  }
  
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleExpand(module.id)
  }

  return (
    <div>
      <div
        className={`
          flex items-center px-3 py-2 text-sm cursor-pointer transition-colors
          hover:bg-gray-50 group
          ${isSelected ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500' : 'text-gray-700'}
        `}
        style={{ paddingLeft: `${12 + level * 16}px` }}
        onClick={handleClick}
      >
        {/* 展开/收起按钮 */}
        {hasChildren ? (
          <button
            onClick={handleToggle}
            className="mr-1 p-0.5 hover:bg-gray-200 rounded transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </button>
        ) : (
          <div className="w-4 mr-1" /> // 占位符保持对齐
        )}
        
        {/* 文件夹图标 */}
        <div className="mr-2">
          {hasChildren ? (
            isExpanded ? (
              <FolderOpen className="w-4 h-4 text-blue-500" />
            ) : (
              <Folder className="w-4 h-4 text-gray-500" />
            )
          ) : (
            <Hash className="w-4 h-4 text-gray-400" />
          )}
        </div>
        
        {/* 模块名称 */}
        <span className="flex-1 truncate">{module.name}</span>
        
        {/* 话术数量 */}
        {scriptCount > 0 && (
          <span className={`
            ml-2 px-2 py-0.5 text-xs rounded-full
            ${isSelected 
              ? 'bg-blue-100 text-blue-700' 
              : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
            }
          `}>
            {scriptCount}
          </span>
        )}
      </div>
      
      {/* 子模块 */}
      {hasChildren && isExpanded && (
        <div>
          {module.children!.map((child) => (
            <ModuleTreeNode
              key={child.id}
              module={child}
              selectedModule={selectedModule}
              onModuleSelect={onModuleSelect}
              scripts={scripts}
              level={level + 1}
              expandedModules={expandedModules}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function ModuleNav({ modules, selectedModule, onModuleSelect, scripts }: ModuleNavProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  
  // 初始化时展开所有顶级模块
  useEffect(() => {
    if (modules.length > 0) {
      const topLevelIds = modules.map(module => module.id)
      setExpandedModules(new Set(topLevelIds))
      setIsLoading(false)
    }
  }, [modules])
  
  const handleToggleExpand = (moduleId: string) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev)
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId)
      } else {
        newSet.add(moduleId)
      }
      return newSet
    })
  }
  
  const totalScripts = scripts.length
  
  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full">
      {/* 头部 */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h2 className="font-medium text-gray-900">话术分类</h2>
      </div>
      
      {/* 全部话术选项 */}
      <div
        className={`
          flex items-center px-3 py-3 text-sm cursor-pointer transition-colors
          hover:bg-gray-50 border-b border-gray-100
          ${selectedModule === null ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500' : 'text-gray-700'}
        `}
        onClick={() => onModuleSelect(null)}
      >
        <div className="mr-2">
          <FolderOpen className="w-4 h-4 text-blue-500" />
        </div>
        <span className="flex-1">全部话术</span>
        <span className={`
          ml-2 px-2 py-0.5 text-xs rounded-full
          ${selectedModule === null 
            ? 'bg-blue-100 text-blue-700' 
            : 'bg-gray-100 text-gray-600'
          }
        `}>
          {totalScripts}
        </span>
      </div>
      
      {/* 模块树 */}
      <div className="flex-1 overflow-y-auto">
        {modules.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            暂无分类模块
          </div>
        ) : (
          modules.map((module) => (
            <ModuleTreeNode
              key={module.id}
              module={module}
              selectedModule={selectedModule}
              onModuleSelect={onModuleSelect}
              scripts={scripts}
              level={0}
              expandedModules={expandedModules}
              onToggleExpand={handleToggleExpand}
            />
          ))
        )}
      </div>
    </div>
  )
}