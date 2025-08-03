import './App.css';
import { Outlet } from 'react-router-dom';
import { Navbar, Footer } from './components';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* <Navbar /> */}
      <main className="flex-grow px-6 py-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;