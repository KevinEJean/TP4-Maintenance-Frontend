import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { MessageErreur } from '../components/EtatsAffichage';

export default function CreerIncident() {
  const navigate = useNavigate();
  const [postes, setPostes] = useState([]);
  const [description, setDescription] = useState('');
  const [priorite, setPriorite] = useState('MOYENNE');
  const [posteId, setPosteId] = useState('');
  const [technicienAssigne, setTechnicienAssigne] = useState('');
  const [erreur, setErreur] = useState(null);
  const [enCours, setEnCours] = useState(false);

  useEffect(() => {
    api
      .listerPostes()
      .then(setPostes)
      .catch((e) => setErreur(e.message));
  }, []);

  async function soumettre(evenement) {
    evenement.preventDefault();
    setErreur(null);
    if (!posteId) {
      setErreur('Veuillez sélectionner un poste.');
      return;
    }
    setEnCours(true);
    try {
      const incident = await api.creerIncident({
        description,
        priorite,
        posteId: Number(posteId),
        technicienAssigne: technicienAssigne || null,
      });
      navigate(`/incidents/${incident.id}`);
    } catch (e) {
      setErreur(e.message);
    } finally {
      setEnCours(false);
    }
  }

  return (
    <section>
      <h1>Signaler un incident</h1>
      {erreur && <MessageErreur message={erreur} />}
      <form className="formulaire" onSubmit={soumettre}>
        <label>
          Description du problème
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
          />
        </label>

        <label>
          Poste concerné
          <select value={posteId} onChange={(e) => setPosteId(e.target.value)} required>
            <option value="">— Sélectionner un poste —</option>
            {postes.map((poste) => (
              <option key={poste.id} value={poste.id}>
                Poste {poste.numero} ({poste.etat})
              </option>
            ))}
          </select>
        </label>

        <label>
          Priorité
          <select value={priorite} onChange={(e) => setPriorite(e.target.value)}>
            <option value="HAUTE">Haute</option>
            <option value="MOYENNE">Moyenne</option>
            <option value="BASSE">Basse</option>
          </select>
        </label>

        <label>
          Technicien assigné (optionnel)
          <input
            type="text"
            value={technicienAssigne}
            onChange={(e) => setTechnicienAssigne(e.target.value)}
          />
        </label>

        <button type="submit" className="bouton bouton--principal" disabled={enCours}>
          {enCours ? 'Envoi…' : 'Signaler l’incident'}
        </button>
      </form>
    </section>
  );
}
