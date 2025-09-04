import { useState } from 'react'
import './Register.css'

interface FormData {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export default function Register() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setError('パスワードが一致しません')
      return
    }
    setError('')
    console.log('Registered:', formData)
  }

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>新規登録</h2>
      <label>
        ユーザー名
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        メールアドレス
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        パスワード
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        パスワード（確認）
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </label>
      {error && <p className="error">{error}</p>}
      <button type="submit">登録</button>
    </form>
  )
}
