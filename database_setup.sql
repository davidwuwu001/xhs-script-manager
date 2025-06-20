-- 创建模块表
CREATE TABLE IF NOT EXISTS modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建话术表
CREATE TABLE IF NOT EXISTS scripts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  module_id UUID REFERENCES modules(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  copy_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 添加缺失的列（如果不存在）
DO $$ 
BEGIN
  -- 检查并添加 copy_count 列
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scripts' AND column_name = 'copy_count') THEN
    ALTER TABLE scripts ADD COLUMN copy_count INTEGER DEFAULT 0;
  END IF;
  
  -- 检查并添加 tags 列
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scripts' AND column_name = 'tags') THEN
    ALTER TABLE scripts ADD COLUMN tags TEXT[] DEFAULT '{}';
  END IF;
END $$;

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_scripts_module_id ON scripts(module_id);
CREATE INDEX IF NOT EXISTS idx_scripts_created_at ON scripts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_modules_parent_id ON modules(parent_id);
CREATE INDEX IF NOT EXISTS idx_scripts_tags ON scripts USING GIN(tags);

-- 插入一些初始数据
INSERT INTO modules (name, description) VALUES 
('销售话术', '各种销售场景下的话术模板'),
('客服话术', '客户服务相关的话术'),
('营销推广', '营销和推广活动的话术')
ON CONFLICT DO NOTHING;

-- 插入一些示例话术
INSERT INTO scripts (title, content, module_id, tags) 
SELECT 
  '欢迎新客户',
  '您好！欢迎来到我们的店铺，我是您的专属客服小助手。如果您有任何问题，随时可以咨询我哦～',
  m.id,
  ARRAY['欢迎', '客服', '新客户']
FROM modules m WHERE m.name = '客服话术'
ON CONFLICT DO NOTHING;

INSERT INTO scripts (title, content, module_id, tags)
SELECT 
  '产品介绍开场',
  '这款产品是我们的明星产品，已经帮助了上千位客户解决了问题。它的主要特点是...',
  m.id,
  ARRAY['产品介绍', '销售', '开场']
FROM modules m WHERE m.name = '销售话术'
ON CONFLICT DO NOTHING;

-- 创建RPC函数用于增加复制计数
CREATE OR REPLACE FUNCTION increment_copy_count(script_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE scripts 
  SET copy_count = copy_count + 1 
  WHERE id = script_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;