import React from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  
  const handleClick = () => {
    router.push('/login');
  };
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>Travel Planner App</h1>
      <p>Welcome to your travel planning application!</p>
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={handleClick}
          style={{
            backgroundColor: '#4CAF50',
            border: 'none',
            color: 'white',
            padding: '15px 32px',
            textAlign: 'center',
            textDecoration: 'none',
            display: 'inline-block',
            fontSize: '16px',
            margin: '4px 2px',
            cursor: 'pointer',
            borderRadius: '8px'
          }}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}