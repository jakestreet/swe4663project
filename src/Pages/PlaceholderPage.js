import logo from '../assets/logo.svg';
import { useAuth } from "../contexts/AuthContext";

export default function PlaceholderPage() {
  const {logout} = useAuth();
    return (
        <div className="App">
        <header className="App-header">
          <h1>Home</h1>
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            onClick={logout}
            href="/"
            >
              Log Out
            </a>
        </header>
      </div>
    )
}
