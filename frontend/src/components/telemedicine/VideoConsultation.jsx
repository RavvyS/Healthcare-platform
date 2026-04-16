import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createTelemedicineSession } from '../../api/appointmentApi';
import Loading from '../common/Loading';

export default function VideoConsultation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jitsiUrl, setJitsiUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function initSession() {
      try {
        const data = await createTelemedicineSession(id);
        setJitsiUrl(data.jitsiUrl);
      } catch (err) {
        setError('Failed to securely connect to the consultation room. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    if (id) {
        initSession();
    }
  }, [id]);

  if (loading) return <Loading />;
  
  if (error) return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
          <div className="text-red-500 font-bold text-xl">{error}</div>
          <button onClick={() => navigate(-1)} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Go Back</button>
      </div>
  );

  return (
    <div className="w-full h-screen bg-neutral-900 flex flex-col">
      <div className="bg-neutral-800 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-lg font-bold">🩺 RavvyCare Telemedicine Consultation #{id}</h1>
        <button 
          onClick={() => navigate(-1)} 
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          Leave Session
        </button>
      </div>
      <div className="flex-grow">
        <iframe
          src={jitsiUrl}
          allow="camera; microphone; fullscreen; display-capture; autoplay"
          style={{ width: '100%', height: '100%', border: 'none' }}
          title={`Consultation Session ${id}`}
        ></iframe>
      </div>
    </div>
  );
}
