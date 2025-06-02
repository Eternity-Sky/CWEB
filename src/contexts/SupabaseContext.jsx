import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// ✅ 使用 ANON_KEY（前端专用密钥）
const supabase = createClient(
  'https://hgkkqngqownhqoitdohh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhna2txbmdxb3duaHFvaXRkb2hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NTUwNTUsImV4cCI6MjA2NDIzMTA1NX0.aRjDaQzkVH-3TkDyNSunQsbJU865aElvLFVBCo4weZ8'  // 替换成你的 ANON_KEY
);

// 创建上下文
const SupabaseContext = createContext();

// 提供者组件
export function SupabaseProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 检查用户登录状态
  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);

      // 监听认证状态变化
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

      return () => subscription.unsubscribe();
    };

    initializeAuth();
  }, []);

  // 登录功能
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      return { user: data.user, error: null };
    } catch (error) {
      return { user: null, error: error.message };
    }
  };

  // 注册功能
  const signUp = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      if (error) throw error;
      return { user: data.user, error: null };
    } catch (error) {
      return { user: null, error: error.message };
    }
  };

  // 登出功能
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  };

  // 检查用户是否为管理员
  const isAdmin = async (userId) => {
    if (!user) return false;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data?.role === 'admin';
    } catch (error) {
      console.error('检查管理员权限失败:', error);
      return false;
    }
  };

  // 设置用户为管理员
  const setUserAsAdmin = async (userId) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', userId);
      
      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
    
      
  };
  setUserAsAdmin('2a6f83e8-45af-4a7e-b677-373fec1e81a1');
  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin,
    setUserAsAdmin
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}

// 自定义钩子
export function useSupabase() {
  return useContext(SupabaseContext);
}
