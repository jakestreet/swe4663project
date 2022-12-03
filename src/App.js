import './App.css';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoutes from "./components/utils/PrivateRoutes";
import SignupPage from "./Pages/SignupPage";
import LoginPage from "./Pages/LoginPage";
import ForgotPage from './Pages/ForgotPage';
import SideBar from './components/SideBar';
import ProjectListPage from './Pages/ProjectListPage';
import ProjectOverviewPage from './Pages/ProjectOverviewPage';
import ReportsPage from './Pages/ReportsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<LoginPage />}></Route>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot" element={<ForgotPage />} />
          <Route element={[<SideBar key={"side"} />, <div key={'div'} style={{ marginLeft: 300 }}><PrivateRoutes key={"private"} /></div>]}>
            <Route path="/home" element={<ProjectListPage />}/>
            <Route path="/home/project-overview" element={<ProjectOverviewPage />} />
            <Route path="/reports" element={<ReportsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
