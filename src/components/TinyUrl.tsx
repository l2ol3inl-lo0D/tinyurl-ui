import { useState } from 'react';
import './TinyUrl.scss';

const TinyUrl = () => {
  const [targetUrl, setTargetUrl] = useState<string | null>(null)
  const [sourceUrl, setSourceUrl] = useState('')
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleShortenUrl = (data: any) => {
    setTargetUrl(null)
    setLoading(true)
    setError(null)
    const body = new URLSearchParams();
    body.append('url', data);

    fetch('http://localhost:8080/shorten', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body
    }).then((response) => {
      if (!response.ok) {
        setError("Erreur de chargement.")
        console.error("Error status: " + response.status + " Message: " + data.message)
      }
      return response.text();
    }).then((textData) => {
      setTargetUrl("http://localhost:3000/" + textData)
      setLoading(false)
    }).catch(err => {
      console.error(err)
      setLoading(false)
      setError(err)
    });

  }

  return (
    <div className="TinyUrl">
      <header className="TinyUrl-header">

        <label className="Tinyurl-label">
          <p>Réduire URL</p>
          <input value={sourceUrl} className='Url-input' name='url' onChange={e => setSourceUrl(e.target.value)} />
          <button className='Button-tinyurl' onClick={() => handleShortenUrl(sourceUrl)} type="submit" disabled={loading}>{loading ? <span className="spinner"></span> : 'Envoyer'}</button>
        </label>

        {error ? <label className="error-label">Erreur lors de la requète</label> : <a
          className="TinyUrl-link"
          href={targetUrl ? targetUrl : ''}
          target={targetUrl ? targetUrl : ''}
        >
          {targetUrl}
        </a>}
      </header>
    </div>
  );
}

export default TinyUrl;
