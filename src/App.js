import './App.css';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoutes from "./components/utils/PrivateRoutes";
import PlaceholderPage from './Pages/PlaceholderPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<PlaceholderPage />}></Route>
          <Route element={<PrivateRoutes />}>
            {/*Private Routes go here*/}
            <Route path="home" element={<PlaceholderPage />} /> {/*Example Private Route*/}
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
