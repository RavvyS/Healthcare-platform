import { useState, useEffect } from 'react';
import { FiCalendar, FiVideo, FiActivity, FiArrowRight, FiShield, FiFileText, FiStar, FiMail, FiPhone, FiMapPin, FiCheckCircle, FiHeart } from 'react-icons/fi';
import { RiHospitalLine } from 'react-icons/ri';
import { ThemeToggle } from './UI';

export default function HomePage({ onGetStarted, theme, toggleTheme }) {
  const [activeSection, setActiveSection] = useState('home');

  // Sync scroll position to active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'features', 'about', 'testimonials', 'contact'];
      let current = 'home';
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If the section is scrolled into the top half of the viewport
          if (rect.top <= 200) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };

    // Attach to window since we are letting the document scroll naturally now
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      // Offset by 80px to account for the fixed navbar
      const y = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const navLinkStyle = (section) => ({
    cursor: 'pointer',
    position: 'relative',
    color: activeSection === section ? 'var(--accent-primary)' : 'inherit',
    fontWeight: activeSection === section ? 700 : 600,
    transition: 'all 0.2s',
    paddingBottom: '4px'
  });

  const getUnderlineStyle = (section) => ({
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: activeSection === section ? '100%' : '0%',
    height: '2px',
    background: 'var(--accent-primary)',
    transition: 'width 0.3s ease-out'
  });

  return (
    <div className="landing-screen" style={{ display: 'block', overflowX: 'hidden' }}>
      <div className="landing-bg-orb landing-bg-orb-1" />
      <div className="landing-bg-orb landing-bg-orb-2" />

      {/* STICKY NAVBAR */}
      <nav style={{ 
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, 
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        background: theme === 'dark' ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.85)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', padding: '16px 40px', alignItems: 'center' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)', cursor: 'pointer' }} onClick={() => scrollTo('home')}>
          <RiHospitalLine size={28} color="#0284c7" />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Medi<em>Care</em></h2>
        </div>
        
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center', color: 'var(--text-secondary)' }} className="hide-mobile">
          <span style={navLinkStyle('home')} onClick={() => scrollTo('home')}>
            Home
            <div style={getUnderlineStyle('home')} />
          </span>
          <span style={navLinkStyle('features')} onClick={() => scrollTo('features')}>
            Features
            <div style={getUnderlineStyle('features')} />
          </span>
          <span style={navLinkStyle('about')} onClick={() => scrollTo('about')}>
            About Us
            <div style={getUnderlineStyle('about')} />
          </span>
          <span style={navLinkStyle('testimonials')} onClick={() => scrollTo('testimonials')}>
            Reviews
            <div style={getUnderlineStyle('testimonials')} />
          </span>
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          <button className="btn btn-primary shadow-colored" onClick={onGetStarted}>
            Sign In <FiArrowRight />
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '100px', paddingBottom: '80px' }}>
        
        {/* HERO SECTION */}
        <section id="home" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px', padding: '40px 20px 100px' }}>
          <div style={{ flex: '1 1 500px', textAlign: 'left' }}>
            <div className="hero-kicker" style={{ marginBottom: '16px', display: 'inline-block' }}>
              <FiActivity style={{ marginRight: '6px' }} /> Premium Health Platform
            </div>
            <h1 style={{ fontSize: '3.8rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-0.03em' }}>
              Healthcare, <br />
              <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Whenever You Need It.
              </span>
            </h1>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '540px', marginBottom: '40px', lineHeight: 1.6 }}>
              Consult top specialists, securely manage your medical reports, and receive AI-powered health insights from the absolute comfort of your home.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button className="btn btn-primary btn-lg shadow-colored" onClick={onGetStarted} style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
                Book an Appointment <FiCalendar style={{ marginLeft: '8px' }} />
              </button>
            </div>
          </div>

          <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '520px', aspectRatio: '1/1', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 30px 60px -15px rgba(2, 132, 199, 0.25)', border: '6px solid var(--bg-card)' }}>
              <img src="/assets/medical_hero.png" alt="Medical Professional using Tablet" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top right, rgba(2, 132, 199, 0.1), transparent)' }} />
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section id="features" style={{ padding: '40px 20px 80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px' }}>What We Offer</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>A unified platform to handle every aspect of your ongoing medical journey.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            <div className="card" style={{ padding: '36px', borderRadius: '24px', border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
              <div style={{ width: 56, height: 56, borderRadius: '16px', background: 'var(--accent-glow)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <FiVideo size={28} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>Telemedicine Sessions</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>Connect with leading healthcare professionals securely via immersive video consultations without leaving your room.</p>
            </div>

            <div className="card" style={{ padding: '36px', borderRadius: '24px', border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
              <div style={{ width: 56, height: 56, borderRadius: '16px', background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <FiActivity size={28} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>AI Symptom Checker</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>Enter your symptoms and let our advanced AI engine provide preliminary clinical guidance and specialist routing.</p>
            </div>

            <div className="card" style={{ padding: '36px', borderRadius: '24px', border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
              <div style={{ width: 56, height: 56, borderRadius: '16px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <FiFileText size={28} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>Digital Prescriptions</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>Receive instantly issued digital prescriptions from your doctors and securely maintain a lifelong digital health record.</p>
            </div>
          </div>
        </section>

        {/* ABOUT US */}
        <section id="about" style={{ padding: '80px 20px' }}>
          <div className="hero-panel" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '40px', padding: '50px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '32px' }}>
            <div style={{ flex: '1 1 400px' }}>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '20px' }}>Bridging the Distance in Healthcare.</h2>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '20px' }}>
                Our mission is to eliminate the barriers between patients and world-class doctors. Since 2026, MediCare has successfully connected thousands of patients with specialized physicians across the country.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)', fontWeight: 600 }}>
                  <FiCheckCircle color="#10b981" /> 100% Verified Medical Professionals
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)', fontWeight: 600 }}>
                  <FiCheckCircle color="#10b981" /> Bank-grade Health Data Security
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)', fontWeight: 600 }}>
                  <FiCheckCircle color="#10b981" /> 24/7 Appointment Availability
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CUSTOMER EXPERIENCE / TESTIMONIALS */}
        <section id="testimonials" style={{ padding: '80px 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px' }}>Patient Experiences</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>Don't just take our word for it—see what our community has to say.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {[
              { name: 'Sarah Jenkins', role: 'Patient', review: 'The telemedicine session was incredibly smooth! I connected with a pediatrician within hours without exposing my child to clinic germs.' },
              { name: 'Dr. Ramesh Silva', role: 'Cardiologist', review: 'MediCare has entirely transformed my private practice. The digital prescriptions feature saves me hours every single week.' },
              { name: 'Michael T.', role: 'Patient', review: 'I used the AI Symptom Checker when I developed a strange rash. It accurately suggested I see a dermatologist, which I booked instantly.' },
            ].map((item, i) => (
              <div key={i} className="card" style={{ padding: '30px', borderRadius: '24px', background: 'var(--bg-input)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', gap: '4px', color: '#fbbf24', marginBottom: '16px' }}>
                  <FiStar fill="currentColor" /><FiStar fill="currentColor" /><FiStar fill="currentColor" /><FiStar fill="currentColor" /><FiStar fill="currentColor" />
                </div>
                <p style={{ fontStyle: 'italic', color: 'var(--text-primary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '24px' }}>"{item.review}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--accent-gradient)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{item.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* FOOTER */}
      <footer id="contact" style={{ background: theme === 'dark' ? '#0f172a' : '#f8fafc', borderTop: '1px solid var(--border)', padding: '60px 40px 40px', color: 'var(--text-secondary)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginBottom: '40px' }}>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)', marginBottom: '20px' }} onClick={() => scrollTo('home')}>
              <RiHospitalLine size={24} color="#0284c7" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, cursor: 'pointer' }}>Medi<em>Care</em></h2>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>
              Pioneering the future of digital health. Fast, secure, and intuitive healthcare for everybody.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ padding: '10px', background: 'var(--bg-card)', borderRadius: '50%', cursor: 'pointer', border: '1px solid var(--border)' }}><FiHeart size={18} color="var(--accent-primary)" /></div>
              <div style={{ padding: '10px', background: 'var(--bg-card)', borderRadius: '50%', cursor: 'pointer', border: '1px solid var(--border)' }}><FiShield size={18} color="var(--accent-primary)" /></div>
            </div>
          </div>

          <div>
            <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: '20px' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <li style={{ cursor: 'pointer' }} onClick={() => scrollTo('home')}>Patient Login</li>
              <li style={{ cursor: 'pointer' }} onClick={() => scrollTo('home')}>Doctor Portal</li>
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: '20px' }}>Contact Details</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.9rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><FiPhone size={16} /> 011 234 5678</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><FiMail size={16} /> support@medicare.lk</li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}><FiMapPin size={16} style={{ marginTop: '3px' }}/> No 123, Galle Road, <br/>Colombo 03</li>
            </ul>
          </div>

        </div>
        <div style={{ textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: '24px', fontSize: '0.85rem' }}>
          &copy; {new Date().getFullYear()} MediCare Digital Platforms. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
