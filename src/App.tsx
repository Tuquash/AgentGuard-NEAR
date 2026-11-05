import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

function App() {
  const [status, setStatus] = useState('Connecting to Supabase...')
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    async function testConnection() {
      try {
        const { error } = await supabase.auth.getSession()

        if (error) {
          throw error
        }

        setStatus('Supabase connection successful.')
        setConnected(true)
      } catch (error) {
        console.error('Supabase connection failed:', error)
        setStatus('Connection failed. Check your Supabase configuration.')
      }
    }

    testConnection()
  }, [])

  return (
    <main style={{
      minHeight: '100vh',
      background: '#0b1020',
      color: 'white',
      display: 'grid',
      placeItems: 'center',
      fontFamily: 'Arial, sans-serif',
    }}>
      <section style={{ textAlign: 'center', padding: '30px' }}>
        <h1>AgentGuard NEAR</h1>
        <p>AI Agent Security & Spending Control</p>
        <p style={{ color: connected ? '#4ade80' : '#facc15' }}>
          {status}
        </p>
      </section>
    </main>
  )
}

export default App
