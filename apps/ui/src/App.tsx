import { CreateUserForm } from './components/CreateUserForm';
import './App.css';

function App() {
  return (
    <div className="app">
      <header>
        <h1>Turborepo + TypeScript Project</h1>
      </header>
      <main>
        <CreateUserForm />
      </main>
    </div>
  );
}

export default App;
