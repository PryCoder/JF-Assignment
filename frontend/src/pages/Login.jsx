import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/useAuth';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', form);
      login(res.data);
      navigate(res.data.role === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f5f5f5', fontFamily:'Arial' }}>
      <form onSubmit={handleSubmit} style={{ background:'#fff', padding:40, borderRadius:8, boxShadow:'0 2px 12px rgba(0,0,0,.08)', display:'flex', flexDirection:'column', gap:14, width:380 }}>
        <h2 style={{ textAlign:'center', margin:'0 0 10px', color:'#333' }}>Login</h2>
        {error && <p style={{ color:'red', fontSize:13, textAlign:'center', margin:0 }}>{error}</p>}
        <input style={input} placeholder="Username" value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })} required />
        <input style={input} type="password" placeholder="Password" value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <button style={btn} type="submit">Log In</button>
        <p style={{ textAlign:'center', fontSize:13, color:'#666', margin:0 }}>
          Don't have an account? <Link to="/register" style={{ color:'#333', fontWeight:'bold' }}>Sign Up</Link>
        </p>
      </form>
    </div>
  );
}

const input = { padding:'12px 14px', border:'1px solid #ccc', borderRadius:4, fontSize:14, outline:'none' };
const btn = { padding:12, background:'#e0e0e0', border:'1px solid #bbb', borderRadius:4, fontSize:15, cursor:'pointer', color:'#333' };