import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';
import Chargement, { MessageErreur } from '../components/EtatsAffichage';

const STATUTS = ['OUVERT', 'ASSIGNE', 'EN_COURS', 'RESOLU', 'FERME'];

export default function DetailIncident() {
  const { id } = useParams();
  const [incident, setIncident] = useState(null);
  const [poste, setPoste] = useState(null);
  const [erreur, setErreur] = useState(null);

  const charger = useCallback(() => {
    api
      .trouverIncident(id)
      .then((incidentCharge) => {
        setIncident(incidentCharge);
        return api.trouverPoste(incidentCharge.posteId);
      })
      .then(setPoste)
      .catch((e) => setErreur(e.message));
  }, [id]);

  useEffect(() => {
    charger();
  }, [charger]);

  async function changerStatut(nouveauStatut) {
    try {
      const miseAJour = await api.changerStatutIncident(id, nouveauStatut);
      setIncident(miseAJour);
    } catch (e) {
      setErreur(e.message);
    }
  }

  if (erreur) return <MessageErreur message={erreur} />;
  if (!incident) return <Chargement />;

  return (
    <section>
      <Link to="/incidents" className="lien-retour">
        ← Retour aux incidents
      </Link>
      <h1>Incident #{incident.id}</h1>
      <p className="description-incident">{incident.description}</p>

      <dl className="fiche-details">
        <dt>Priorité</dt>
        <dd>{incident.priorite}</dd>
        <dt>Statut</dt>
        <dd>{incident.statut}</dd>
        <dt>Poste</dt>
        <dd>{poste ? `Poste ${poste.numero} (${poste.etat})` : '—'}</dd>
        <dt>Signalé le</dt>
        <dd>{new Date(incident.dateSignalement).toLocaleString('fr-CA')}</dd>
        <dt>Technicien assigné</dt>
        <dd>{incident.technicienAssigne || 'Aucun'}</dd>
      </dl>

      <div className="actions-statut">
        <p>Changer le statut :</p>
        {STATUTS.map((statut) => (
          <button
            key={statut}
            className="bouton"
            disabled={statut === incident.statut}
            onClick={() => changerStatut(statut)}
          >
            {statut}
          </button>
        ))}
      </div>
    </section>
  );
}
