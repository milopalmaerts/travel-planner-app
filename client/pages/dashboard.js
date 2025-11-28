import React from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const router = useRouter();
  
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
      <h1>Dashboard</h1>
      <p>Welcome to your Travel Planner Dashboard!</p>
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => router.push('/')}
          style={{
            backgroundColor: '#2196F3',
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
          Back to Home
        </button>
      </div>
    </div>
  );
}