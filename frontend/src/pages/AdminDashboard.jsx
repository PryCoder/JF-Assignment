import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/useAuth';

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');
  const [viewId, setViewId] = useState(null);

  useEffect(() => { loadFeedbacks(); }, []);

  const loadFeedbacks = async () => {
    const res = await api.get('/admin/feedbacks');
    setFeedbacks(res.data);
  };

  const openEdit = (fb) => {
    setEditId(fb.id);
    setEditText(fb.message);
  };

  const saveEdit = async () => {
    await api.put(`/feedback/${editId}`, { message: editText, rating: 5 });
    setEditId(null);
    loadFeedbacks();
  };

  const deleteFeedback = async (id) => {
    if (window.confirm('Delete this feedback?')) {
      await api.delete(`/feedback/${id}`);
      loadFeedbacks();
    }
  };

  const short = (m) => m.length > 50 ? m.slice(0, 50) + '...' : m;
  const th = { background: '#e0e0e0', padding: 10, textAlign: 'left', border: '1px solid #ccc', color: '#333' };
  const td = { padding: 10, border: '1px solid #ccc', color: '#333' };
  const btn = { padding: '4px 10px', marginRight: 4, background: '#e0e0e0', border: '1px solid #bbb', borderRadius: 3, fontSize: 12, cursor: 'pointer', color: '#333' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', fontFamily: 'Arial', padding: 20 }}>
      <div style={{ background: '#fff', padding: 35, borderRadius: 8, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', width: 720 }}>
        <h2 style={{ textAlign: 'center', fontSize: 22, color: '#333', margin: '0 0 25px' }}>Admin Feedback Dashboard</h2>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              <th style={th}>ID</th>
              <th style={th}>Feedback</th>
              <th style={th}>Date</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.length === 0 ? (
              <tr><td colSpan="4" style={{ ...td, textAlign: 'center' }}>No feedback yet.</td></tr>
            ) : feedbacks.map(fb => (
              <tr key={fb.id}>
                <td style={td}>{fb.id}</td>
                <td style={td}>
                  {editId === fb.id
                    ? <textarea style={{ width: '100%', minHeight: 60, padding: 8, border: '1px solid #ccc', borderRadius: 4, fontSize: 13, boxSizing: 'border-box', fontFamily: 'inherit' }}
                        value={editText} onChange={(e) => setEditText(e.target.value)} />
                    : viewId === fb.id ? fb.message : short(fb.message)}
                </td>
                <td style={td}>{new Date(fb.updatedAt).toLocaleDateString()}</td>
                <td style={{ ...td, whiteSpace: 'nowrap' }}>
                  {editId === fb.id ? (
                    <>
                      <button style={btn} onClick={saveEdit}>Save</button>
                      <button style={btn} onClick={() => setEditId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button style={btn} onClick={() => setViewId(viewId === fb.id ? null : fb.id)}>
                        {viewId === fb.id ? 'Hide' : 'View'}
                      </button>
                      <button style={btn} onClick={() => openEdit(fb)}>Edit</button>
                      <button style={btn} onClick={() => deleteFeedback(fb.id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={logout}
          style={{ display: 'block', margin: '22px auto 0', background: 'none', border: 'none', color: '#2563eb', textDecoration: 'underline', cursor: 'pointer', fontSize: 14 }}>
          Log Out
        </button>
      </div>
    </div>
  );
}