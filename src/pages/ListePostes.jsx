import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';
import Chargement, { MessageErreur } from '../components/EtatsAffichage';

export default function ListePostes() {
  const { localId } = useParams();
  const [local, setLocal] = useState(null);
  const [postes, setPostes] = useState(null);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    Promise.all([api.trouverLocal(localId), api.listerPostes(localId)])
      .then(([localCharge, postesCharges]) => {
        setLocal(localCharge);
        setPostes(postesCharges);
      })
      .catch((e) => setErreur(e.message));
  }, [localId]);

  if (erreur) return <MessageErreur message={erreur} />;
  if (!postes || !local) return <Chargement />;

  return (
    <section>
      <Link to="/" className="lien-retour">
        ← Retour aux locaux
      </Link>
      <h1>Postes — {local.nom}</h1>
      {postes.length === 0 && <p className="etat-info">Aucun poste enregistré pour ce local.</p>}
      <ul className="liste-cartes">
        {postes.map((poste) => (
          <li key={poste.id} className="carte">
            <h2>Poste {poste.numero}</h2>
            <p className={`badge badge--${poste.etat === 'HORS_SERVICE' ? 'danger' : 'succes'}`}>
              {poste.etat}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
