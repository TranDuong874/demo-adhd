import './App.css';
import NavBar from './components/NavBar/NavBar';
import MainLayout from './layout/MainLayout/MainLayout';
import Home from './pages/Home/Home';
import { BrowserRouter as Router, Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout header={<NavBar />} children={<Home />} />} />
        <Route path="/about" element={<MainLayout/>}></Route>
      </Routes>
    </Router>

  );
}

export default App;
