import './PageNotFound.scss'

const NotFoundPage = () => {
    const returnToHome = () => {
        window.location.href = 'http://localhost:3000';
    }

  return (
    <div className="Page-not-found">
      <h1>404 - La page n'a pas été trouvé</h1>
      <p>Le code utilisé ne correspond à aucune page sauvegardée.</p>
      <button className="Not-found-button" onClick={() => returnToHome()}>Retour</button>
    </div>
  );
};

export default NotFoundPage;
