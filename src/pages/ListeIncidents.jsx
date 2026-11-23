import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import Chargement, { MessageErreur } from '../components/EtatsAffichage';

export default function ListeIncidents() {
  const [incidents, setIncidents] = useState(null);
  const [erreur, setErreur] = useState(null);
  const [filtreStatut, setFiltreStatut] = useState('TOUS');
  const [filtrePriorite, setFiltrePriorite] = useState('TOUTES');

  useEffect(() => {
    api
      .listerIncidents()
      .then(setIncidents)
      .catch((e) => setErreur(e.message));
  }, []);

  const incidentsFiltres = useMemo(() => {
    if (!incidents) return [];
    return incidents.filter((incident) => {
      const okStatut = filtreStatut === 'TOUS' || incident.statut === filtreStatut;
      const okPriorite = filtrePriorite === 'TOUTES' || incident.priorite === filtrePriorite;
      return okStatut && okPriorite;
    });
  }, [incidents, filtreStatut, filtrePriorite]);

  if (erreur) return <MessageErreur message={erreur} />;
  if (!incidents) return <Chargement />;

  return (
    <section>
      <div className="entete-page">
        <h1>Incidents</h1>
        <Link className="bouton bouton--principal" to="/incidents/nouveau">
          + Signaler un incident
        </Link>
      </div>

      <div className="barre-filtres">
        <label>
          Statut
          <select value={filtreStatut} onChange={(e) => setFiltreStatut(e.target.value)}>
            <option value="TOUS">Tous</option>
            <option value="OUVERT">Ouvert</option>
            <option value="ASSIGNE">Assigné</option>
            <option value="EN_COURS">En cours</option>
            <option value="RESOLU">Résolu</option>
            <option value="FERME">Fermé</option>
          </select>
        </label>
        <label>
          Priorité
          <select value={filtrePriorite} onChange={(e) => setFiltrePriorite(e.target.value)}>
            <option value="TOUTES">Toutes</option>
            <option value="HAUTE">Haute</option>
            <option value="MOYENNE">Moyenne</option>
            <option value="BASSE">Basse</option>
          </select>
        </label>
      </div>

      {incidentsFiltres.length === 0 && (
        <p className="etat-info">Aucun incident ne correspond aux filtres sélectionnés.</p>
      )}

      <ul className="liste-cartes">
        {incidentsFiltres.map((incident) => (
          <li key={incident.id} className="carte">
            <Link to={`/incidents/${incident.id}`}>
              <h2>{incident.description}</h2>
              <p>
                <span className={`badge badge--priorite-${incident.priorite?.toLowerCase()}`}>
                  {incident.priorite}
                </span>{' '}
                <span className="badge">{incident.statut}</span>
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
