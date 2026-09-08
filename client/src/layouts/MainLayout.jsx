import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';

export default function MainLayout({ children }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
