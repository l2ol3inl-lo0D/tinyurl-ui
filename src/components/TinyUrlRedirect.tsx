import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import config from '../config'


const TinyUrlRedirect = () => {
  const { urlId } = useParams<{ urlId: string }>()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUrl = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}${config.endpoints.findUrl}?key=${urlId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        })

        if (response.status === 404) {
          navigate('/404', { replace: true });
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch the URL')
        }

        const textData = await response.text();
        const targetUrl = textData.startsWith("http") ? textData : JSON.parse(textData).targetUrl;

        window.location.href = targetUrl;
      } catch (error) {
        console.error('Error fetching or redirecting:', error)
      }
    };

    if (urlId) {
      fetchUrl()
    }
  }, [urlId, navigate])

  return <div className="redirect-div">Redirecting...</div>
}

export default TinyUrlRedirect
