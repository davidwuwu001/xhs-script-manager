import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 模块接口
export interface Module {
  id: string
  name: string
  description?: string
  parent_id?: string
  sort_order: number
  created_at: string
}

// 话术接口
export interface Script {
  id: string
  title: string
  content: string
  tags?: string[]
  module_id?: string
  module?: Module
  copy_count: number
  created_at: string
}

// 管理员接口
export interface Admin {
  id: string
  username: string
  password_hash: string
  created_at: string
}

// 话术服务
export const scriptService = {
  // 获取所有话术
  async getScripts() {
    const { data, error } = await supabase
      .from('scripts')
      .select(`
        *,
        module:modules(*)
      `)
      .order('created_at', { ascending: false })
    
    return { data: data as Script[], error }
  },

  // 根据模块获取话术
  async getScriptsByModule(moduleId: string) {
    const { data, error } = await supabase
      .from('scripts')
      .select(`
        *,
        module:modules(*)
      `)
      .eq('module_id', moduleId)
      .order('created_at', { ascending: false })
    
    return { data: data as Script[], error }
  },

  // 增加复制次数
  async incrementCopyCount(scriptId: string) {
    const { error } = await supabase
      .rpc('increment_copy_count', { script_id: scriptId })
    
    if (error) throw error
  },

  // 创建话术
  async createScript(script: Omit<Script, 'id' | 'created_at' | 'copy_count'>) {
    const { data, error } = await supabase
      .from('scripts')
      .insert([{ ...script, copy_count: 0 }])
      .select()
      .single()
    
    if (error) throw error
    return data as Script
  },

  // 更新话术
  async updateScript(id: string, updates: Partial<Omit<Script, 'id' | 'created_at'>>) {
    const { data, error } = await supabase
      .from('scripts')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Script
  },

  // 删除话术
  async deleteScript(id: string) {
    const { error } = await supabase
      .from('scripts')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// 模块服务
export const moduleService = {
  // 获取所有模块
  async getModules() {
    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .order('sort_order', { ascending: true })
    
    return { data: data as Module[], error }
  },

  // 创建模块
  async createModule(module: Omit<Module, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('modules')
      .insert([module])
      .select()
      .single()
    
    if (error) throw error
    return data as Module
  },

  // 更新模块
  async updateModule(id: string, updates: Partial<Omit<Module, 'id' | 'created_at'>>) {
    const { data, error } = await supabase
      .from('modules')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Module
  },

  // 删除模块
  async deleteModule(id: string) {
    const { error } = await supabase
      .from('modules')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// 管理员服务
export const adminService = {
  // 验证管理员登录
  async verifyAdmin(username: string, password: string) {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('username', username)
      .single()
    
    if (error) throw error
    
    // 这里应该使用bcrypt等库来验证密码哈希
    // 为了简化，这里直接比较（生产环境中不要这样做）
    if (data.password_hash !== password) {
      throw new Error('密码错误')
    }
    
    return data as Admin
  }
}