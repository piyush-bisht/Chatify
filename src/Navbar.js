import React, { Component } from 'react'
import firebase from 'firebase/app';
import moment from 'moment';
export default class Navbar extends Component {
    
    state={
        profilePicture:this.props.loggedInUser.profilePicture,
        loading:false
    }
    constructor(props)
    {
        super(props);
        this.changeProfilePicture=this.changeProfilePicture.bind(this);
    }
    handleLogout(){

        firebase.auth().signOut()
        .then(()=>{
            console.log("SIGNED OUT");
            this.props.history.push("/");
        })
        .catch(e=>{
            console.log(e);
        })
    }
    changeProfilePicture(e){
        var db=firebase.firestore();
        var storage=firebase.storage();
        var storageRef=storage.ref();
        var picRef=storageRef.child(e.target.value);
        var downloadURL;
        var {loggedInUser}=this.props;

        var loading=0; 
        var uploadTask=picRef.put(e.target.files[0])
        uploadTask.on('state_changed',
        (snapshot)=>{
            
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                  console.log('Upload is paused');
                  break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                  console.log('Upload is running');
                  
                  if(loading==0)
                    {
                        loading=1;
                        this.setState({loading:true})
                    }
                  break;
            }
        }
        ,(error)=>{console.log(error)}
        ,()=>{
                loading=0;
                console.log("Uploaded I guess");
                uploadTask.snapshot.ref.getDownloadURL().then((url)=>{
                    downloadURL=url;
                    var user = firebase.auth().currentUser;
                    user.updateProfile({
                        photoURL: downloadURL
                      }).then(function() {
                        console.log("USER UPDATED")
                        db.collection("users").doc(loggedInUser.id)
                        .set({
                            profilePicture:downloadURL
                        },{merge:true})
                        
                      }).catch(function(error) {
                        console.log(error);
                      });
                    this.setState({profilePicture:downloadURL,loading:false})
                    console.log(this.state.profilePicture);
                })
                
            }
        )
    }

   
    render() {
        var {loggedInUser}=this.props;
        return (
            <div>
                <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
                    <div class="container-fluid">
                        <a class="navbar-brand mb-0 h1 ">Chatify</a>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse flex-row-reverse" id="navbarNavAltMarkup">
                            <div class="navbar-nav ">
                                <li class="nav-item ms-1">
                                    <a class="nav-link lead" href="#">Logged In as {this.props.loggedInUser.name}</a>
                                </li>
                                <button class=" d-flex btn btn-outline-success ms-2"data-bs-toggle="modal" data-bs-target="#editProfile" >Edit Profile</button>
                                <button class=" d-flex btn btn-outline-danger ms-2" onClick={()=>(this.handleLogout())} >Logout</button>
                            </div>
                        </div>
                    </div>
                </nav>
                {
loggedInUser.joinedDate!= undefined &&
<div class="modal fade" id="editProfile" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
<div class=" modal-dialog justify-content-center">
    <div class="modal-content">
    <div  class="profile-modal">    
        <div class="d-flex justify-content-center">
            <input id="dpchange" accept="image/*" style={{display:"none"}} type="file" onChange={(e)=>{this.changeProfilePicture(e)}}></input>
            {!this.state.loading && <img id="dp"  onClick={()=>{document.getElementById("dpchange").click()}}src={this.state.profilePicture}  style={{borderRadius:"50%"}} height="200vh" width="200vh"/>}
            {this.state.loading && 
                <div class="spinner-border text-secondary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            }
        </div>
        <div class="d-flex justify-content-center">
            <h5 class="modal-title" id="exampleModalLabel">{loggedInUser.name}<br/></h5>
        </div>
        <div class="d-flex justify-content-center"><p class="lead">{loggedInUser.username}</p></div>
        <div class="modal-body">
        
         { <p>Joined {moment(loggedInUser.joinedDate.toDate()).format('LL') }</p> }
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
    </div>
    </div>
</div>
</div>


                }
            </div>
        )
    }
}
