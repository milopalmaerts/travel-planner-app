export default function Home() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column'
    }}>
      <h1>Travel Planner API</h1>
      <p>Your Next.js API is running successfully!</p>
      <p>API endpoints are available under <code>/api</code></p>
    </div>
  );
}