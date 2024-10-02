import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TinyUrlRedirect from '../components/TinyUrlRedirect';
import TinyUrl from '../components/TinyUrl';
import NotFoundPage from '../components/PageNotFound';

function AppRouting() {
  return (
    <Router>
      <Routes>
        <Route path='' element={<TinyUrl />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="/:urlId" element={<TinyUrlRedirect />} />
      </Routes>
    </Router>
  );
}

export default AppRouting;
