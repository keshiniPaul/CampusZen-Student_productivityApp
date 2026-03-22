import React from 'react';
import { useNavigate } from 'react-router-dom';

function Career() {
  const navigate = useNavigate();

  const careerServices = [
    {
      title: "Job Opportunities",
      description: "Discover the latest job openings and internships tailored to your profile.",
      icon: "💼",
      color: "#60a5fa"
    },
    {
      title: "Resume Builder",
      description: "Create a professional CV using our AI-powered templates and tools.",
      icon: "📄",
      color: "#a855f7"
    },
    {
      title: "Career Guidance",
      description: "Get personalized advice and roadmaps for your dream career path.",
      icon: "🚀",
      color: "#fbbf24"
    },
    {
      title: "Mock Interviews",
      description: "Practice your skills with simulated interview sessions and feedback.",
      icon: "🎯",
      color: "#10b981"
    }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#021e37',
      backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
      backgroundSize: '40px 40px',
      fontFamily: 'Outfit, sans-serif',
      padding: '40px 20px',
      color: 'white'
    }}>
      {/* Page Header */}
      <header style={{ 
        maxWidth: '1200px', 
        margin: '0 auto 60px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0', background: 'linear-gradient(to right, #60a5fa, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Career Hub
          </h1>
          <p style={{ opacity: 0.7, fontSize: '1.1rem', marginTop: '5px' }}>Welcome back, <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>Vishwa</span></p>
        </div>
        <button 
          onClick={() => navigate('/dashboard')}
          style={{
            padding: '10px 20px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '12px',
            color: 'white',
            cursor: 'pointer',
            backdropFilter: 'blur(5px)'
          }}
        >
          ← Dashboard
        </button>
      </header>

      {/* 4 Cards Grid */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '30px'
      }}>
        {careerServices.map((service, index) => (
          <div 
            key={index}
            className="career-card"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '24px',
              padding: '40px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Background Glow */}
            <div style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '150px',
              height: '150px',
              background: service.color,
              filter: 'blur(80px)',
              opacity: 0.1,
              pointerEvents: 'none'
            }}></div>

            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '20px',
              display: 'inline-block',
              padding: '15px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '20px'
            }}>
              {service.icon}
            </div>
            
            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: 'white' }}>
              {service.title}
            </h3>
            
            <p style={{ color: '#94a3b8', lineHeight: '1.6', fontSize: '0.95rem' }}>
              {service.description}
            </p>

            <div style={{ 
              marginTop: '25px', 
              display: 'flex', 
              alignItems: 'center', 
              color: service.color,
              fontWeight: '600',
              fontSize: '0.9rem'
            }}>
              Explore Now <span style={{ marginLeft: '8px' }}>→</span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .career-card:hover {
          transform: translateY(-10px);
          background: rgba(255, 255, 255, 0.07);
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  );
}

export default Career;
