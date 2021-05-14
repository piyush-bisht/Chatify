import React, { Component } from 'react';
import  "./Landing.css";
import firebase from 'firebase/app';
import { Link } from 'react-router-dom';
import Register from './Register';
class Landing extends Component {
    constructor()
    {
        super();
        this.handleToggle=this.handleToggle.bind(this);
    }
    state={
        login:true,
        register:false
        
    }
    handleToggle(){
        this.setState({
            login:!this.state.login,
            register:!this.state.register
        })
    }
    render() { 
        return (
            <div className="landing-body postion-relative">
                <div className="landing-container">
                <div className="row">
                    <div className="col-sm">
                        <p class="text-lg-start lead landing-subtext">
                            Your all in one need for messaging
                        </p>
                        <h1 class="landing-heading">Chatify</h1>
                    </div>
                    
                </div>
                </div>
                <div class="landing-container-2">
                    {!this.state.login &&
                    <Login history={this.props.history} toggle={this.handleToggle}/>
                    }
                    {!this.state.register &&
                    <Register history={this.props.history} toggle={this.handleToggle}/>
                    }    
                 <div class="footer">
                    <div className="row footer-row">
                        <div className="col footer-col">
                            <h1 class="footer-title display-6">Contact us at</h1>
                            <hr/>
                            <p class="lead">
                                Piyush Bisht
                            </p>
                            <p class="lead">Dehradun,Uttarakhand (248001)</p>
                            <p class="lead">
                                +91-8979966169
                            </p>
                            <p class="lead">
                                piyush.bisht3@gmail.com
                            </p>
                            
                        </div>
                        <div className="col footer-col">
                            <h1 class="footer-title display-6">Connect with us at</h1>
                            <hr/>
                            <p class="lead">
                                <a class="footer-links" href="https://www.facebook.com/piyush.bisht.184" target="_blank"><i class="fab fa-facebook"></i></a>
                                <a class="footer-links" href="https://www.linkedin.com/in/piyush-bisht-0ab61b1a9/" target="_blank"><i class="fab fa-linkedin-in"></i></a>
                                <a class="footer-links" href="https://twitter.com/thatspiyush" target="_blank"><i class=" fab fa-twitter"></i></a>


                            </p>
                        </div>
                    </div>
                    <div className="row">
                    
                        <div class="links footer-copyright text-center py-3">© 2021 
                            <a class="links" href="https://mdbootstrap.com/"> Chatify.firebaseapp.com</a>
                        </div>
                        
                    </div>
               </div>             
                </div>
               
            </div>
        );
    }
}


class  Login extends Component {
    state={
        username:"",
        password:"",
        error:""
    }
    handleClick(){
        firebase.auth().signInWithEmailAndPassword(this.state.username,this.state.password)
        .then((userCred)=>{
            console.log("Signed In successfully");
            console.log(userCred);
            localStorage.setItem('user',JSON.stringify(this.state.username));
            this.props.history.push("/homepage");
          }
        )
        .catch(error=>{
            console.log(error.message);
            this.setState({error:error.message});
        })
        
      }
    render() {
        return (
            <div class="card login-card">
                {this.state.error!="" &&
                    <div class="alert alert-danger" role="alert">
                       {this.state.error}
                    </div>
                }
                <div class="card-title display-6">
                    Login
                </div>
                <div class="form-floating mb-3">
                    <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com" value={this.state.username} onChange={(e)=>(this.setState({username:e.target.value}))}/>
                    <label for="floatingInput ">Email</label>
                    </div>
                    <div class="form-floating">
                    <input type="password" class="form-control" id="floatingPassword" placeholder="Password" value={this.state.password} onChange={(e)=>(this.setState({password:e.target.value}))}/>
                    <label for="floatingPassword">Password</label>
                    <button type="button" class="btn btn-dark login-button" onClick={()=>{this.handleClick()}}>Login</button>
                    <p className="lead register-link">or <Link onClick={this.props.toggle} id="register-link" className="register-link">Register</Link> yourself</p>
                </div>
            </div>           
        )
    }
}

export default Landing;