import { createRoot } from 'react-dom/client';
import App from './App';
import { loadScheduleData } from './lib/schedule';
import './styles.css';

const root = createRoot(document.getElementById('root'));
loadScheduleData()
  .then(() => root.render(<App />))
  .catch(err => root.render(<div className="error">⚠️ {err.message}</div>));
