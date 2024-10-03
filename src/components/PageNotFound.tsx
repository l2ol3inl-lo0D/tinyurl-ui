import './PageNotFound.scss'
import config from '../config'


const NotFoundPage = () => {
    const returnToHome = () => {
        window.location.href = `${config.reactBaseUrl}`;
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
