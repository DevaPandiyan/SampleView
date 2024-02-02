import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ConfiguratorProvider } from './contexts/Configurator.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <ConfiguratorProvider>
     <App />
     </ConfiguratorProvider>
   
  </React.StrictMode>
)
