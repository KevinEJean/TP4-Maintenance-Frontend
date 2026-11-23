import { Route, Routes } from 'react-router-dom';
import BarreNavigation from './components/BarreNavigation';
import ListeLocaux from './pages/ListeLocaux';
import ListePostes from './pages/ListePostes';
import ListeIncidents from './pages/ListeIncidents';
import CreerIncident from './pages/CreerIncident';
import DetailIncident from './pages/DetailIncident';

export default function App() {
  return (
    <div className="application">
      <BarreNavigation />
      <main className="contenu-principal">
        <Routes>
          <Route path="/" element={<ListeLocaux />} />
          <Route path="/locaux/:localId/postes" element={<ListePostes />} />
          <Route path="/incidents" element={<ListeIncidents />} />
          <Route path="/incidents/nouveau" element={<CreerIncident />} />
          <Route path="/incidents/:id" element={<DetailIncident />} />
        </Routes>
      </main>
    </div>
  );
}
