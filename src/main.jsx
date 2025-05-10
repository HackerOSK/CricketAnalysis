import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Layout from './layout/layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Match_analysis from './pages/Match_analysis.jsx'
import Players_stats from './pages/Players_stats.jsx'
import Team_comparison from './pages/Team_comparison.jsx'
import Tournament_overview from './pages/Tournament_overview.jsx'
import Predictive_Analysis from './pages/Predictive_Analysis.jsx'
import Profile from './pages/Profile.jsx'
import Help from './pages/Help.jsx'
import Chatbot from './pages/Chatbot.jsx'


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <Layout>
    <Routes>
      <Route path='/' element={<App/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/analytics' element={<Match_analysis/>}/>
      <Route path='/email' element={<Players_stats/>}/>
      <Route path='/manual-reply' element={<Team_comparison/>}/>
      <Route path='/account-settings' element={<Tournament_overview/>}/>
      <Route path='/predictive-analysis' element={<Predictive_Analysis/>}/>
      <Route path='/profile' element={<Profile/>}/>
      <Route path='/support' element={<Help/>}/>
      <Route path='/chatbot' element={<Chatbot/>}/>
    </Routes>
  </Layout>
  `</BrowserRouter>
)
