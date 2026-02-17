interface HelloPageProps {
  onLogout: () => void;
}

export function HelloPage({ onLogout }: HelloPageProps) {
  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
  };

  return (
    <div className="page">
      <div className="hello-card">
        <h1>Hello, World!</h1>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
