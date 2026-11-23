const BASE_URL = '/api';

async function traiterReponse(reponse) {
  if (!reponse.ok) {
    let message = `Erreur ${reponse.status}`;
    try {
      const corps = await reponse.json();
      message = corps.message || message;
    } catch {
      // Le corps n'était pas du JSON, on garde le message par défaut.
    }
    throw new Error(message);
  }
  if (reponse.status === 204) {
    return null;
  }
  return reponse.json();
}

async function appel(chemin, options = {}) {
  const reponse = await fetch(`${BASE_URL}${chemin}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  return traiterReponse(reponse);
}

export const api = {
  // Locaux
  listerLocaux: () => appel('/locaux'),
  trouverLocal: (id) => appel(`/locaux/${id}`),

  // Postes
  listerPostes: (localId) => appel(localId ? `/postes?localId=${localId}` : '/postes'),
  trouverPoste: (id) => appel(`/postes/${id}`),

  // Incidents
  listerIncidents: () => appel('/incidents'),
  trouverIncident: (id) => appel(`/incidents/${id}`),
  creerIncident: (donnees) =>
    appel('/incidents', { method: 'POST', body: JSON.stringify(donnees) }),
  changerStatutIncident: (id, statut) =>
    appel(`/incidents/${id}/statut`, { method: 'PATCH', body: JSON.stringify({ statut }) }),
  assignerTechnicien: (id, technicien) =>
    appel(`/incidents/${id}/assigner`, { method: 'PATCH', body: JSON.stringify({ technicien }) }),
};
