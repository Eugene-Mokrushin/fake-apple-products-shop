import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '../scss/globals.scss'
import { BrowserRouter as Router } from 'react-router-dom'
import { ShoppingCartProvider } from './context/ShoppingCartContext'
import { IsSectionSelectedProvider } from './context/IsSectionSelectedContext'
import { IsMobileLangProvider } from './context/IsMobileLangContext'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ShoppingCartProvider>
      <IsSectionSelectedProvider>
        <IsMobileLangProvider>
          <Router>
            <App />
          </Router>
        </IsMobileLangProvider>
      </IsSectionSelectedProvider>
    </ShoppingCartProvider>
  </React.StrictMode>
  
)
