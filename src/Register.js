import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import firebase from 'firebase/app';
export default class Register extends Component {
    state={
        firstname:"",
        lastname:"",
        email:"",
        password:"",
        error:""
    }
    handleClick(e){
        e.preventDefault();
        var db=firebase.firestore();
        const{email,password,firstname,lastname}=this.state;
        console.log(email,password);
        firebase.auth().createUserWithEmailAndPassword(email,password)
        .then((userCred)=>{
            var user=userCred.user;
            var profilePicture="https://www.computerhope.com/jargon/g/guest-user.jpg";
            user.updateProfile({
                displayName:firstname+" "+lastname,
                photoURL:profilePicture
            })
            .then(
                ()=>{
                    var docref=db.collection('users').doc();
                    var rUser=firebase.auth().currentUser;
                    var USER={
                        id:docref.id,
                        name:rUser.displayName,
                        username:rUser.email,
                        profilePicture:rUser.photoURL,
                        joinedDate:firebase.firestore.FieldValue.serverTimestamp() ,
                        rooms:{}
                    }
                    console.log(USER);
                    docref.set(USER)
                    .then(()=>{
                        this.props.history.push("/homepage");
                    })
                    
                }
            )
            
        })
        .catch((error)=>{
            console.log(error);
            this.setState({error:error.message})
        })
      }
    render() {
        return (
            <div class="card login-card">
                 {this.state.error!=="" &&
                    <div class="alert alert-danger" role="alert">
                       {this.state.error}
                    </div>
                }
                <div class="card-title display-6">
                    Sign-up
                </div>
                <form>
                <div class="form-floating mb-3">
                    <input required type="text" class="form-control" id="floatingInput" placeholder="name@example.com" value={this.state.firstname} onChange={(e)=>(this.setState({firstname:e.target.value}))}/>
                    <label for="floatingInput ">First Name</label>
                </div>
                <div class="form-floating mb-3">
                    <input required type="text" class="form-control" id="floatingInput" placeholder="name@example.com" value={this.state.lastname} onChange={(e)=>(this.setState({lastname:e.target.value}))}/>
                    <label for="floatingInput ">Last Name</label>
                </div>
                <div class="form-floating mb-3">
                    <input  required type="email" class="form-control" id="floatingInput" placeholder="name@example.com"  value={this.state.email} onChange={(e)=>(this.setState({email:e.target.value}))}/>
                    <label for="floatingInput ">Email</label>
                </div>
                <div class="form-floating">
                    <input  minLength="6" required type="password" class="form-control" id="floatingPassword" placeholder="Password" value={this.state.password} onChange={(e)=>(this.setState({password:e.target.value}))}/>
                    <label for="floatingPassword">Password</label>
                    <button type="submit" class="btn btn-dark login-button" onClick={(e)=>{this.handleClick(e)}}>Register</button>
                    <p className="lead register-link">Already have an account, <Link onClick={this.props.toggle} id="register-link" className="register-link">Login Here</Link> </p>
                </div>
                </form>
                
            </div>      
        )
    }
}
