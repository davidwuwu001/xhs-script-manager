import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 类型定义
export interface Module {
  id: string
  name: string
  description?: string
  parent_id?: string
  created_at: string
  children?: Module[]
}

export interface Script {
  id: string
  title: string
  content: string
  module_id?: string
  module?: Module
  tags?: string[]
  copy_count: number
  created_at: string
}

export interface Admin {
  id: string
  email: string
  created_at: string
}

// 获取所有话术
export async function getScripts() {
  const { data, error } = await supabase
    .from('scripts')
    .select(`
      *,
      module:modules(*)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching scripts:', error)
    throw error
  }

  return data as Script[]
}

// 根据模块获取话术
export async function getScriptsByModule(moduleId: string) {
  const { data, error } = await supabase
    .from('scripts')
    .select(`
      *,
      module:modules(*)
    `)
    .eq('module_id', moduleId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching scripts by module:', error)
    throw error
  }

  return data as Script[]
}

// 增加复制计数
export async function incrementCopyCount(scriptId: string) {
  const { error } = await supabase.rpc('increment_copy_count', {
    script_id: scriptId
  })

  if (error) {
    console.error('Error incrementing copy count:', error)
    throw error
  }
}

// 话术相关操作
export const scriptService = {
  // 创建话术
  async createScript(script: Omit<Script, 'id' | 'created_at' | 'copy_count' | 'module'>) {
    const { data, error } = await supabase
      .from('scripts')
      .insert([script])
      .select(`
        *,
        module:modules(*)
      `)
      .single()

    if (error) {
      console.error('Error creating script:', error)
      throw error
    }

    return data as Script
  },

  // 更新话术
  async updateScript(id: string, updates: Partial<Omit<Script, 'id' | 'created_at' | 'module'>>) {
    const { data, error } = await supabase
      .from('scripts')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        module:modules(*)
      `)
      .single()

    if (error) {
      console.error('Error updating script:', error)
      throw error
    }

    return data as Script
  },

  // 删除话术
  async deleteScript(id: string) {
    const { error } = await supabase
      .from('scripts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting script:', error)
      throw error
    }
  }
}

// 模块相关操作
export const moduleService = {
  // 获取所有模块
  async getModules() {
    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching modules:', error)
      throw error
    }

    return data as Module[]
  },

  // 创建模块
  async createModule(module: Omit<Module, 'id' | 'created_at' | 'children'>) {
    const { data, error } = await supabase
      .from('modules')
      .insert([module])
      .select()
      .single()

    if (error) {
      console.error('Error creating module:', error)
      throw error
    }

    return data as Module
  },

  // 更新模块
  async updateModule(id: string, updates: Partial<Omit<Module, 'id' | 'created_at' | 'children'>>) {
    const { data, error } = await supabase
      .from('modules')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating module:', error)
      throw error
    }

    return data as Module
  },

  // 删除模块
  async deleteModule(id: string) {
    const { error } = await supabase
      .from('modules')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting module:', error)
      throw error
    }
  }
}