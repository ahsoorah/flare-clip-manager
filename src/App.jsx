import React, { useState, useEffect } from 'react';

export default function App() {
  const [clips, setClips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedClip, setSelectedClip] = useState(null);

  const [apiKey, setApiKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  const WORKER_URL = 'https://api.suriyah.dev';

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');
    try {
      const res = await fetch(`${WORKER_URL}/api/clips`, {
        headers: { 'x-api-key': apiKey }
      });

      if (res.status === 401) {
        setAuthError('invalid password');
        setLoading(false);
        return;
      }

      const data = await res.json();
      setClips(data);
      if (data.length > 0) {
        setSelectedClip(data[0]);
      }
      setIsAuthenticated(true);
    } catch (err) {
      console.error('failed to load clips:', err);
      setAuthError('connection error');
    } finally {
      setLoading(false);
    }
  };

  const fetchClips = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await fetch(`${WORKER_URL}/api/clips`, {
        headers: { 'x-api-key': apiKey }
      });
      const data = await res.json();
      setClips(data);
      if (data.length > 0 && !selectedClip) {
        setSelectedClip(data[0]);
      }
    } catch (err) {
      console.error('failed to load clips:', err);
    }
  };

  const handleDelete = async (filename) => {
    if (!confirm(`are you sure you want to delete ${filename}?`)) return;
    try {
      await fetch(`${WORKER_URL}/api/clips/${filename}`, {
        method: 'DELETE',
        headers: { 'x-api-key': apiKey }
      });
      const updatedClips = clips.filter(c => c.name !== filename);
      setClips(updatedClips);
      if (selectedClip?.name === filename) {
        setSelectedClip(updatedClips.length > 0 ? updatedClips[0] : null);
      }
    } catch (err) {
      console.error('delete failed:', err);
      alert('failed to delete clip');
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    alert('link copied to clipboard');
  };

  const totalBytesUsed = clips.reduce((acc, clip) => acc + clip.size, 0);
  const totalGBUsed = (totalBytesUsed / (1024 * 1024 * 1024)).toFixed(2);
  const storagePercentage = Math.min((totalGBUsed / 10) * 100, 100);

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#000000', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
      <form onSubmit={handleLogin} style={{ backgroundColor: '#050000', padding: '2.5rem', border: '1px solid #450a0a', borderRadius: '0.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '320px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
      <div style={{ textAlign: 'center' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '0.05em', color: '#dc2626', margin: 0 }}>
      flare <span style={{ color: '#7f1d1d' }}>clip manager</span>
      </h1>
      <div style={{ fontSize: '0.75rem', color: '#b91c1c', marginTop: '0.25rem' }}>restricted</div>
      </div>

      <input
      type="password"
      placeholder="enter password"
      value={apiKey}
      onChange={(e) => setApiKey(e.target.value)}
      style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #450a0a', backgroundColor: '#0a0a0a', color: '#fef2f2', outline: 'none', fontSize: '0.875rem' }}
      />

      <button type="submit" style={{ padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #991b1b', backgroundColor: '#7f1d1d', color: '#fef2f2', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 'bold', transition: 'background-color 0.2s' }}>
      {loading ? 'authenticating...' : 'login'}
      </button>

      {authError && <div style={{ color: '#ef4444', fontSize: '0.75rem', textAlign: 'center' }}>{authError}</div>}
      </form>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000000', color: '#fef2f2', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>
    <header style={{ borderBottom: '1px solid #450a0a', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '0.05em', color: '#dc2626', margin: 0 }}>
    flare <span style={{ color: '#7f1d1d' }}>clip manager</span>
    </h1>
    <span style={{ fontSize: '0.75rem', color: '#b91c1c' }}>
    by suriyah
    </span>
    </header>

    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', flex: 1, height: 'calc(100vh - 65px)' }}>
    <aside style={{ borderRight: '1px solid #450a0a', backgroundColor: '#050000', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <h2 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#991b1b', margin: 0, fontWeight: '600' }}>
    cloud clips ({clips.length})
    </h2>
    <button
    onClick={fetchClips}
    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.75rem' }}
    >
    refresh ↻
    </button>
    </div>

    <div style={{ backgroundColor: '#0a0a0a', border: '1px solid #450a0a', borderRadius: '0.5rem', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#fca5a5' }}>
    <span>storage used</span>
    <span>{totalGBUsed} gb / 10 gb</span>
    </div>
    <div style={{ width: '100%', height: '6px', backgroundColor: '#1a0505', borderRadius: '3px', overflow: 'hidden' }}>
    <div style={{ width: `${storagePercentage}%`, height: '100%', backgroundColor: totalGBUsed > 8 ? '#ef4444' : '#dc2626', transition: 'width 0.3s' }} />
    </div>
    </div>

    {loading ? (
      <div style={{ fontSize: '0.875rem', color: '#7f1d1d' }}>loading clips...</div>
    ) : clips.length === 0 ? (
      <div style={{ fontSize: '0.875rem', color: '#7f1d1d' }}>no clips found in bucket</div>
    ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {clips.map((clip) => (
        <div
        key={clip.name}
        onClick={() => setSelectedClip(clip)}
        style={{
          padding: '0.75rem',
          borderRadius: '0.375rem',
          cursor: 'pointer',
          backgroundColor: selectedClip?.name === clip.name ? '#450a0a' : '#0a0a0a',
          border: '1px solid',
          borderColor: selectedClip?.name === clip.name ? '#dc2626' : '#260505',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'all 0.2s'
        }}
        >
        <span style={{ fontSize: '0.875rem', color: selectedClip?.name === clip.name ? '#fef2f2' : '#fca5a5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {clip.name}
        </span>
        </div>
      ))}
      </div>
    )}
    </aside>

    <main style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: '#000000' }}>
    {selectedClip ? (
      <>
      <div style={{ width: '1000px', height: '560px', backgroundColor: '#050000', border: '1px solid #450a0a', borderRadius: '0.75rem', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <video
      key={selectedClip.url}
      controls
      src={selectedClip.url}
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
      </div>

      <div style={{ backgroundColor: '#050000', border: '1px solid #450a0a', borderRadius: '0.75rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', width: '1000px' }}>
      <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#dc2626', margin: 0 }}>
      {selectedClip.name}
      </h3>
      <div style={{ fontSize: '0.75rem', color: '#b91c1c', display: 'flex', gap: '2rem' }}>
      <span>size: {(selectedClip.size / (1024 * 1024)).toFixed(2)} mb</span>
      <span>uploaded: {new Date(selectedClip.uploaded).toLocaleString().toLowerCase()}</span>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
      <button
      onClick={() => copyToClipboard(selectedClip.url)}
      style={{ backgroundColor: '#7f1d1d', border: '1px solid #991b1b', color: '#fef2f2', padding: '0.5rem 1.25rem', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.875rem' }}
      >
      copy public link
      </button>
      <a
      href={selectedClip.url}
      target="_blank"
      rel="noreferrer"
      style={{ backgroundColor: '#1a0505', border: '1px solid #7f1d1d', color: '#fca5a5', padding: '0.5rem 1.25rem', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
      >
      open in new tab ↗
      </a>
      <button
      onClick={() => handleDelete(selectedClip.name)}
      style={{ marginLeft: 'auto', backgroundColor: '#450a0a', border: '1px solid #dc2626', color: '#fca5a5', padding: '0.5rem 1.25rem', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.875rem' }}
      >
      delete clip
      </button>
      </div>
      </div>
      </>
    ) : (
      <div style={{ color: '#7f1d1d', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      select a clip from the sidebar to preview and manage
      </div>
    )}
    </main>
    </div>
    </div>
  );
}
