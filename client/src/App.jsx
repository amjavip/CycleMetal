import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/home';


function App() {
  return (
      <BrowserRouter>
      <Routes>
      <Route path="/inicio" element={<Home />} />

      </Routes>
      </BrowserRouter>
  );
}

export default App
