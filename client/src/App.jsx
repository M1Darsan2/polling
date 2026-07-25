import { BrowserRouter as Router } from 'react-router-dom'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import PollPage from './pages/PollPage'
import CreatePage from './pages/CreatePage'

const App = () => {
  return (
    <Router>
  <Navbar />
  <main className="min-h-screen bg-zinc-950">
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/poll/:id" element={<PollPage />} />
      <Route path="/create" element={<CreatePage />} />
    </Routes>
  </main>
</Router>
  )
}

export default App