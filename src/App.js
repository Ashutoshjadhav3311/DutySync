import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
         <li>names input</li>
         <li>Roles output</li>
         <li>Role Tasks</li>
         <li>Task date</li>  
         <li>Task comment</li>
         <li>Save names in db and assign roles</li>
         <li>Noifty particular user on each friday about next person role-Email.js</li>
         <li>Use SQS</li>

        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
