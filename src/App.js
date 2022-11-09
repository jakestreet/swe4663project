import './App.css';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoutes from "./components/utils/PrivateRoutes";
import PlaceholderPage from './Pages/PlaceholderPage';
import SignupPage from "./Pages/SignupPage";
import LoginPage from "./Pages/LoginPage";
import ForgotPage from './Pages/ForgotPage';
import SideBar from './components/SideBar';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<LoginPage />}></Route>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot" element={<ForgotPage />} />
          <Route element={[<SideBar key={"side"} />, <div key={'div'} style={{ marginLeft: 240 }}><PrivateRoutes key={"private"} /></div>]}>
            {/*Private Routes go here*/}
            <Route path="home" element={<PlaceholderPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
