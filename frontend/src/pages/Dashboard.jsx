import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/useAuth';

export default function Dashboard() {
  const { logout } = useAuth();
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      const res = await api.get('/feedback/my');
      if (res.data.length > 0) {
        const fb = res.data[0];
        setText(fb.message);
        setEditingId(fb.id);
      }
    } catch (err) {
      setError('Could not load feedback');
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await api.put(`/feedback/${editingId}`, { message: text, rating: 5 });
      } else {
        await api.post('/feedback', { message: text, rating: 5 });
      }
      alert('Feedback saved!');
    } catch (err) {
      setError('Something went wrong');
    }
  };

  const switchToAdd = () => {
    setEditingId(null);
    setText('');
    setError('');
  };

  const switchToEdit = async () => {
    setError('');
    await loadFeedback();
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', fontFamily: 'Arial', padding: 20 }}>
      <div style={{ background: '#fff', padding: 35, borderRadius: 8, boxShadow: '0 2px 12px rgba(248, 239, 239, 0.08)', width: 520 }}>
        <h2 style={{ textAlign: 'center', margin: '0 0 25px', color: '#333' }}>Feedback</h2>

        <div style={{ display: 'flex', gap: 15, marginBottom: 22 }}>
          <button onClick={switchToAdd}
            style={{ flex: 1, padding: 10, background: '#e0e0e0', border: !editingId ? '2px solid #666' : '1px solid #bbb', borderRadius: 4, fontSize: 14, cursor: 'pointer', color: '#333' }}>
            Add Feedback
          </button>
          <button onClick={switchToEdit}
            style={{ flex: 1, padding: 10, background: '#e0e0e0', border: editingId ? '2px solid #666' : '1px solid #bbb', borderRadius: 4, fontSize: 14, cursor: 'pointer', color: '#333' }}>
            Edit Feedback
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', fontSize: 14, marginBottom: 8, color: '#333' }}>Your Feedback:</label>
          {error && <p style={{ color: 'red', fontSize: 13, margin: '0 0 8px' }}>{error}</p>}
          <textarea
            style={{ width: '100%', minHeight: 130, padding: 12, border: '1px solid #ccc', borderRadius: 4, fontSize: 14, resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit', outline: 'none' }}
            placeholder="Write your feedback here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
          <button type="submit"
            style={{ width: '100%', padding: 12, background: '#e0e0e0', border: '1px solid #bbb', borderRadius: 4, fontSize: 15, cursor: 'pointer', marginTop: 20, color: '#333' }}>
            Submit
          </button>
        </form>

        <button onClick={logout}
          style={{ display: 'block', margin: '20px auto 0', background: 'none', border: 'none', color: '#2563eb', textDecoration: 'underline', cursor: 'pointer', fontSize: 13 }}>
          Log Out
        </button>
      </div>
    </div>
  );
}