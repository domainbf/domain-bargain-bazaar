import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/dashboard');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">欢迎回来</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#4F46E5',
                  brandAccent: '#4338CA',
                }
              }
            }
          }}
          providers={[]}
          localization={{
            variables: {
              sign_in: {
                email_label: '邮箱',
                password_label: '密码',
                button_label: '登录',
                loading_button_label: '登录中...',
                social_provider_text: '使用 {{provider}} 登录',
                link_text: '已有账号？立即登录',
              },
              sign_up: {
                email_label: '邮箱',
                password_label: '密码',
                button_label: '注册',
                loading_button_label: '注册中...',
                social_provider_text: '使用 {{provider}} 注册',
                link_text: '没有账号？立即注册',
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Login;