// בס"ד
import { StrictMode} from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

const Root = () => {  
  return (
    <StrictMode>
      <App />
    </StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(<Root />)
