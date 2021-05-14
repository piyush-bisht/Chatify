import {Switch,Route, BrowserRouter } from 'react-router-dom';
import './App.css';
import Homepage from './Homepage';
import Landing from './Landing';
import Register from './Register';

function App() {

  return (
    <BrowserRouter>
        <Switch>
          <Route path="/homepage" component={Homepage}></Route>
          <Route path="/register" component={Register}></Route>
          <Route path="/" component={Landing}></Route>
          
        </Switch>
    </BrowserRouter>
    
  );
}

export default App;
