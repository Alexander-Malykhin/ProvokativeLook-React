import { createRoot } from 'react-dom/client'
import App from './App.tsx'
//styles
import '@scss/main.scss';

createRoot(document.getElementById('root')!).render(
    <App />
)
