import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import Chargement, { MessageErreur } from '../components/EtatsAffichage';

export default function ListeLocaux() {
  const [locaux, setLocaux] = useState(null);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    api
      .listerLocaux()
      .then(setLocaux)
      .catch((e) => setErreur(e.message));
  }, []);

  if (erreur) return <MessageErreur message={erreur} />;
  if (!locaux) return <Chargement />;

  return (
    <section>
      <h1>Locaux</h1>
      <p className="sous-titre">Sélectionnez un local pour consulter ses postes informatiques.</p>
      <ul className="liste-cartes">
        {locaux.map((local) => (
          <li key={local.id} className="carte">
            <Link to={`/locaux/${local.id}/postes`}>
              <h2>{local.nom}</h2>
              <p>{local.batiment}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
