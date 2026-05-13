import { useState } from 'react';
import axios from 'axios';
import { 
  Video, 
  BookOpen, 
  LayoutDashboard, 
  BrainCircuit 
} from 'lucide-react';
import './App.css';
import type { StudyMaterial } from './types';
import Quiz from './components/Quiz';
import Flashcards from './components/Flashcards';

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<StudyMaterial | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    
    setLoading(true);
    setError(null);
    setData(null);
    
    try {
      const response = await axios.post('http://localhost:8080/api/analyze', {
        youtube_url: url
      });
      setData(response.data);
    } catch (err: any) {
      console.error("Full Error:", err);
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError(err.message || "Something went wrong. Make sure your backend is running and API key is set.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Standard search sub-component so we can reuse it conditionally
  const SearchBar = ({ isHeader = false }) => (
    <form 
      onSubmit={handleAnalyze} 
      className="search-container"
      style={isHeader ? {} : {
        flex: '0 1 650px',
        width: '100%',
        marginBottom: '1rem'
      }}
    >
      <input 
        type="text" 
        placeholder="Paste YouTube URL here to analyze..." 
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        disabled={loading}
        autoFocus={!isHeader}
        style={isHeader ? {} : { padding: '1rem 1.5rem', fontSize: '1.2rem' }}
      />
      <button 
        type="submit" 
        className="btn-primary" 
        disabled={loading}
        style={isHeader ? {} : { padding: '0 2.2rem' }}
      >
        <Video size={isHeader ? 20 : 24} />
      </button>
    </form>
  );

  return (
    <div className="app-container">
      <header className="header" style={{ borderBottom: data ? '1px solid #333' : 'none' }}>
        <div className="logo">
          <Video size={28} fill="#ff0000" color="#ff0000" />
          <span style={{fontWeight: 600, fontSize: '1.2rem', letterSpacing: '-0.5px'}}>YouTube Study Mode</span>
        </div>

        {/* ONLY SHOW SEARCH IN HEADER IF WE HAVE DATA */}
        {data && <SearchBar isHeader={true} />}
        
        <div style={{width: data ? '200px' : '0'}}></div>
      </header>

      <main style={{ marginTop: data ? '1.5rem' : '0' }}>
        {!data && !loading && !error && (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: 'calc(100vh - 80px)',
            padding: '0 20px',
            textAlign: 'center',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
               <Video size={56} color="#ff0000" fill="#ff0000" />
               <h1 style={{fontSize: '2.8rem', margin: 0}}>Learn Faster</h1>
            </div>
            
            <p style={{color: 'var(--text-muted)', fontSize: '1.15rem', marginBottom: '2rem', maxWidth: '550px'}}>
              Paste any YouTube educational link below to instantly generate auto-chapters, quizzes, and active recall flashcards.
            </p>

            <SearchBar isHeader={false} />
          </div>
        )}

        {loading && (
          <div style={{
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: 'calc(100vh - 80px)',
          }}>
            <div className="spinner" style={{ width: '50px', height: '50px', borderWidth: '4px' }}></div>
            <h2 style={{marginTop: '1.5rem', color: '#fff', fontSize: '1.6rem'}}>Analyzing video stream...</h2>
            <p style={{color: '#aaa', marginTop: '0.5rem', fontSize: '1rem'}}>Processing speech transcript and generating logic maps.</p>
          </div>
        )}

        {error && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 80px)' }}>
            <div className="glass-panel" style={{ padding: '2rem', maxWidth: '550px', width: '90%', background: '#2a1111', borderRadius: '12px', textAlign: 'center' }}>
               <h2 style={{color: '#ff5555', marginBottom: '1rem', fontSize: '1.6rem'}}>Something went wrong</h2>
               <p style={{fontSize: '1.1rem', color: '#ffaaaa', marginBottom: '2rem'}}>{error}</p>
               <button onClick={() => setError(null)} className="btn-primary" style={{ borderRadius: '8px', padding: '0.8rem 1.5rem' }}>Try Again</button>
            </div>
          </div>
        )}

        {data && !loading && (
          <div className="dashboard-grid">
            {/* Left Column: Video AND Summary */}
            <div>
              <div className="video-wrapper">
                <iframe 
                  src={`https://www.youtube.com/embed/${data.video_id}`}
                  title="YouTube player" 
                  allowFullScreen
                ></iframe>
              </div>
              
              <h1 style={{ fontSize: '1.6rem', margin: '1rem 0' }}>Knowledge Stream Analysis</h1>
              
              {/* Summary Box */}
              <div className="glass-panel" style={{ padding: '1.5rem', margin: '1rem 0', background: '#212121' }}>
                <div style={{fontWeight: 600, fontSize: '1.2rem', marginBottom: '1rem', color: '#fff'}}>AI Generation Summary</div>
                <p style={{lineHeight: 1.8, fontSize: '1.1rem', whiteSpace: 'pre-wrap', color: '#ddd'}}>{data.summary}</p>
              </div>
            </div>

            {/* Right Column: Chapters and Study Widgets */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Chapters list like YT UpNext/Chapters */}
              <div className="glass-panel card">
                <div className="card-title"><BookOpen size={18} /> Chapters</div>
                <div className="timeline">
                  {data.chapters.map((chapter, i) => (
                    <div key={i} className="timeline-item">
                      <div className="timestamp" style={{background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', height: 'fit-content'}}>
                        {chapter.timestamp}
                      </div>
                      <div className="chapter-content">
                        <div style={{fontWeight: 500, fontSize: '0.85rem'}}>{chapter.title}</div>
                        <div style={{color: 'var(--text-muted)', fontSize: '0.8rem'}}>{chapter.summary.substring(0, 60)}...</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Widgets stack underneath */}
              <div className="glass-panel card" style={{border: '1px solid var(--border-color)'}}>
                <div className="card-title"><BrainCircuit size={18} /> Flashcards</div>
                <Flashcards data={data.flashcards} />
              </div>

              <div className="glass-panel card" style={{border: '1px solid var(--border-color)'}}>
                <div className="card-title"><LayoutDashboard size={18} /> Quiz</div>
                <Quiz questions={data.quiz} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
