export default function Chargement() {
  return <p className="etat-info">Chargement…</p>;
}

export function MessageErreur({ message }) {
  return <p className="etat-erreur" role="alert">⚠ {message}</p>;
}
