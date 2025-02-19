import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="card p-4" style={{ width: '400px' }}>
          <h3 className="text-center mb-4">Login</h3>

          <form>
            <div className="form-group mb-3">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Enter your username"
              />
            </div>

            <div className="form-group mb-4">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter your password"
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
