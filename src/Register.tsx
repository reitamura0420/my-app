import { useState } from 'react'
import './Register.css'

interface FormData {
  username: string
  email: string
  postalCode: string
  address: string
  password: string
  confirmPassword: string
}

export default function Register() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    postalCode: '',
    address: '',
    password: '',
    confirmPassword: '',
  })

  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddressSearch = async () => {
    if (!formData.postalCode) {
      setError('郵便番号を入力してください')
      return
    }
    try {
      const res = await fetch(
        `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${formData.postalCode}`
      )
      const data = await res.json()
      if (data.results && data.results.length > 0) {
        const address = `${data.results[0].address1}${data.results[0].address2}${data.results[0].address3}`
        setFormData((prev) => ({ ...prev, address }))
        setError('')
      } else {
        setError('住所が見つかりません')
      }
    } catch {
      setError('住所の取得に失敗しました')
    }
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
        郵便番号
        <div className="postal-group">
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            required
          />
          <button type="button" onClick={handleAddressSearch}>
            住所検索
          </button>
        </div>
      </label>
      <label>
        住所
        <input
          type="text"
          name="address"
          value={formData.address}
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
