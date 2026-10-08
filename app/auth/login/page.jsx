'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { email, password } = formData

      if (!email || !password) {
        setError('Email e senha são obrigatórios')
        setLoading(false)
        return
      }

      const supabase = await createClient()

      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (loginError) {
        setError('Email ou senha inválidos')
        setLoading(false)
        return
      }

      setSuccess(true)
      setError('')

      // Redirecionar após 2s
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 2000)

    } catch (err) {
      console.error('Login error:', err)
      setError('Erro ao fazer login: ' + (err?.message || 'desconhecido'))
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">OrthoFácil</h1>
          <p className="text-gray-600 mt-2">Sistema de Gestão Ortodôntica</p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            ✅ Login realizado com sucesso! Redirecionando...
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Não tem conta?{' '}
            <Link href="/auth/signup" className="text-blue-600 hover:underline font-medium">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
