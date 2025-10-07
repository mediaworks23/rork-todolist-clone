# Supabase Kurulum Rehberi

Bu proje Supabase ile entegre edilmiştir. Aşağıdaki adımları takip ederek kurulumu tamamlayabilirsiniz.

## 1. Supabase Hesabı Oluşturma

1. [supabase.com](https://supabase.com) adresine gidin
2. "Start your project" butonuna tıklayın
3. GitHub hesabınızla giriş yapın
4. Yeni bir organizasyon oluşturun (ücretsiz)
5. "New Project" butonuna tıklayın
6. Proje adı, veritabanı şifresi ve bölge seçin
7. "Create new project" butonuna tıklayın (kurulum 2-3 dakika sürer)

## 2. Veritabanı Tablolarını Oluşturma

Supabase Dashboard'da SQL Editor'e gidin ve aşağıdaki SQL komutlarını çalıştırın:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  due_date TIMESTAMPTZ,
  category_id TEXT NOT NULL,
  priority_id TEXT NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  tags JSONB DEFAULT '[]'::jsonb,
  reminder JSONB,
  recurrence JSONB DEFAULT '{"type": "none", "enabled": false}'::jsonb,
  subtasks JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Create projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  color TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Create categories table
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Create tags table
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_tags_user_id ON tags(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tasks
CREATE POLICY "Users can view their own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" ON tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" ON tasks
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for projects
CREATE POLICY "Users can view their own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" ON projects
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for categories
CREATE POLICY "Users can view their own categories" ON categories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own categories" ON categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories" ON categories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories" ON categories
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for tags
CREATE POLICY "Users can view their own tags" ON tags
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tags" ON tags
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tags" ON tags
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tags" ON tags
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 3. Environment Variables Ayarlama

Projenizin root dizininde `.env` dosyası oluşturun:

```env
EXPO_PUBLIC_SUPABASE_URL=your-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Bu bilgileri Supabase Dashboard'dan alabilirsiniz:
1. Project Settings > API
2. "Project URL" ve "anon public" key'i kopyalayın

## 4. Authentication Ayarlama (Opsiyonel)

Supabase Dashboard'da Authentication > Providers bölümünden:
- Email/Password authentication'ı aktif edin
- Veya Google, GitHub gibi OAuth provider'ları ekleyin

## 5. Realtime Özelliklerini Aktifleştirme (Opsiyonel)

Database > Replication bölümünden tablolarınız için realtime'ı aktifleştirebilirsiniz:
1. `tasks` tablosunu seçin
2. "Enable Replication" butonuna tıklayın
3. Diğer tablolar için tekrarlayın

## 6. Storage Ayarlama (Opsiyonel - Dosya yükleme için)

Storage bölümünden yeni bir bucket oluşturabilirsiniz:
1. "New bucket" butonuna tıklayın
2. Bucket adı girin (örn: "task-attachments")
3. Public veya Private seçin
4. RLS policies ekleyin

## Kullanım

Artık uygulamanızda Supabase kullanabilirsiniz:

```typescript
import { supabase } from '@/lib/supabase';

// Kullanıcı kaydı
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
});

// Giriş yapma
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
});

// Task ekleme
const { data, error } = await supabase
  .from('tasks')
  .insert({
    title: 'Yeni görev',
    category_id: 'work',
    priority_id: 'high',
    user_id: user.id,
  });

// Task'ları getirme
const { data, error } = await supabase
  .from('tasks')
  .select('*')
  .eq('user_id', user.id);
```

## Önemli Notlar

1. **Row Level Security (RLS)**: Tüm tablolarda RLS aktiftir. Bu, kullanıcıların sadece kendi verilerine erişebilmesini sağlar.

2. **Authentication**: Veritabanı işlemleri için kullanıcının giriş yapmış olması gerekir.

3. **Offline Support**: Şu anki implementasyon online çalışır. Offline support için ek kütüphaneler gerekir.

4. **Migration**: Mevcut AsyncStorage verilerinizi Supabase'e taşımak için migration script'i yazabilirsiniz.

## Yardım ve Destek

- [Supabase Dokümantasyonu](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [React Native ile Supabase](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)
