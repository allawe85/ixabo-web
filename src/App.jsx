import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './pages/Landing';
import JoinUs from './pages/JoinUs'; 
import ContactUs from './pages/ContactUs';
import Pricing from './pages/Pricing';
import Dictionary from './pages/Dictionary';
import { useDirection } from './hooks/useDirection';

function App() {
  useDirection(); 

  return (
    <BrowserRouter>
      <Navbar />
      {/* Define the Routes here */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/join-us" element={<JoinUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/dictionary" element={<Dictionary />} />
      </Routes>
      <Footer />

    </BrowserRouter>
  );
}
export default App;