import { useState } from 'react'
import { Box, Button, TextField, Typography } from '@mui/material'

interface FormData {
  username: string
  email: string
  postalCode: string
  address: string
  birthdate: string
  password: string
  confirmPassword: string
}

export default function Register() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    postalCode: '',
    address: '',
    birthdate: '',
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

    if (formData.password.length < 8) {
      setError('パスワードは8文字以上にしてください')
      return
    }

    if (!/[A-Za-z]/.test(formData.password) || !/\d/.test(formData.password)) {
      setError('パスワードは英字と数字を含めてください')
      return
    }

    const birthDigits = formData.birthdate.replace(/-/g, '')
    if (birthDigits && formData.password.includes(birthDigits)) {
      setError('パスワードに生年月日を含めないでください')
      return
    }

    setError('')
    console.log('Registered:', formData)
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 400,
        mx: 'auto',
        mt: 4,
      }}
    >
      <Typography variant="h5" component="h2" textAlign="center">
        新規登録
      </Typography>
      <TextField
        label="ユーザー名"
        name="username"
        value={formData.username}
        onChange={handleChange}
        required
      />
      <TextField
        label="メールアドレス"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          label="郵便番号"
          name="postalCode"
          value={formData.postalCode}
          onChange={handleChange}
          required
        />
        <Button variant="outlined" onClick={handleAddressSearch}>
          住所検索
        </Button>
      </Box>
      <TextField
        label="住所"
        name="address"
        value={formData.address}
        onChange={handleChange}
        required
      />
      <TextField
        label="生年月日"
        type="date"
        name="birthdate"
        value={formData.birthdate}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        required
      />
      <TextField
        label="パスワード"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <TextField
        label="パスワード（確認）"
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
      />
      {error && (
        <Typography color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
      <Button type="submit" variant="contained">
        登録
      </Button>
    </Box>
  )
}
