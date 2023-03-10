import * as ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { apolloProvider } from './apolloProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(apolloProvider);

reportWebVitals();
