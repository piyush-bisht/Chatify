import React, { Component } from 'react'
import "./MessageList.css"
import firebase from 'firebase/app';
import 'firebase/storage';
import ScrollToBottom from 'react-scroll-to-bottom';
import moment from 'moment';
export default class MessageList extends Component {
    componentDidMount(){
        firebase.auth().onAuthStateChanged((user)=>this.checkUser(user));
    } 
    checkUser(user)   
    {
        var db=firebase.firestore();
            if (user) {
                var loggedInUser={
                    id:"",
                    name:user.displayName,
                    username:user.email
                }
                db.collection("users").get().then((querySnapshot=>{
                    querySnapshot.forEach((doc)=>{

                        if(doc.data().username==loggedInUser.username)
                        {
                            loggedInUser.id=doc.data().id;

                        }           
                    })
                this.setState({activePerson:this.props.activePerson,
                loggedInUser})
            }))
              
            } else {
            console.log("NOT LOGGED IN");
              this.props.history.push("/");
            }
    }
       
    
    constructor(props)
    {
        super(props);
        this.state={
            activePerson:
                this.props.activePerson
            ,
            loggedInUser:""
        }
        this.handleAddMessage=this.handleAddMessage.bind(this);
        this.checkUser=this.checkUser.bind(this);
        this.handleAddImage=this.handleAddImage.bind(this);
    }
    
    handleAddMessage(text){

        var {loggedInUser}=this.state;
        var{activePerson}=this.props;

        var date=new Date();
        console.log("HERE AT ADD MSG "+date);
        this.props.addMessage({
            senderId:loggedInUser.id,
            senderName:loggedInUser.name,
            to:activePerson.id,
            text:text,
            time:date
        })
    }
    handleAddImage(e){
        console.log(e.target.value);
        var storage=firebase.storage();
        var storageRef=storage.ref();
        var picRef=storageRef.child(e.target.value);
        var downloadURL;
        var {loggedInUser}=this.state;
        var{activePerson}=this.props;
        var date=new Date();
        var obj={
            senderId:loggedInUser.id,
            senderName:loggedInUser.name,
            to:activePerson.id,
            text:"",
            image:downloadURL,
            time:date,
            loading:true
        }
        var loading=0; 
        var uploadTask=picRef.put(e.target.files[0])
        uploadTask.on('state_changed',
        (snapshot)=>{
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                  console.log('Upload is paused');
                  break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                  console.log('Upload is running');
                  
                  if(loading==0)
                    {
                        this.props.loadingMessage(obj)
                        loading=1;
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
                    console.log("HERE AT ADD MSG "+date);
                    obj.image=downloadURL;
                    obj.loading=false;
                    this.props.addMessage(obj)
                })
            }
        )
    }
    render() {
        
        var {loggedInUser}=this.state;
       
        var {activePerson,messages}=this.props;
        
        return (
            <div>
                <Header activePerson={activePerson}/>
                <ScrollToBottom className="container-md message-list">
                {
                messages.length!=0 &&
                messages.map(msg=>(
                    <Messages message={msg} loggedInUser={loggedInUser} deleteMessage={this.props.deleteMessage} />
                ))
                }
                {
                    activePerson.id!=undefined && messages.length==0 &&
                    <div className="d-flex justify-content-center ">
                    <p className="position-absolute bottom-50 start-40 display-5">Quickly,say Hi to start a conversation</p>
                    </div>

                }
                {
                   activePerson.id==undefined &&
                    <div className="d-flex justify-content-center ">
                        <p className="position-absolute bottom-50 start-40 display-5">Click a Chat-Box to get started</p>
                    </div>
                }
                
                </ScrollToBottom>
                {
                    activePerson.id!=undefined &&
                    <Input addMessage={this.handleAddMessage} addImage={this.handleAddImage}/>
                }
            </div>
        )
    }
}
class Header extends Component {
    
    render() {
        var {activePerson}=this.props;
        return (
            <div class="header">
                <nav class="nav header-layer">
                    <li class="nav-link active display-5 header-text" aria-current="page" href="#">{activePerson.name}
                    </li>
                </nav>    
            </div>
        );
    }
}
class Messages extends Component {
    
    render() {
        var {message,loggedInUser}=this.props;
        console.log(message.senderId);
        console.log(loggedInUser.id);
        var loading;
        
      
        var timestamp;
        try{
            timestamp=message.time.toDate();
        }
        catch(err)
        {
            timestamp=message.time;
        }
        

        var lastTime=(moment(timestamp).calendar());
        var Dclass,subClass;
        if(loggedInUser.id!=undefined && loggedInUser.id.toString()==message.senderId.toString())
        {
            
            Dclass="message-card row  d-flex justify-content-end min-vh-5 min-vw-5"
            subClass="message-sent"
        }
        else{
            
            Dclass="message-card row d-flex min-vh-5 min-vw-5"
            subClass="message-received"
        }
        return (
            <div className={Dclass} id={loading} >
                <div className={subClass} >
                    <div class="col-sm p-3 message-body">
                        <div className="card-title">
                            <p className="h6 text-sm-end">{message.senderName} <span class="fw-lighter">{lastTime}   </span>
                            {message.senderId==loggedInUser.id &&<i class="fas fa-ellipsis-v"  type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false"></i>}
                                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                    <li><a class="dropdown-item" href="#" onClick={()=>(this.props.deleteMessage(message))}>Delete Message For All</a></li>                    
                            </ul>            
                            </p>    
                        </div>
                        {message.loading &&
                        
                        <div class="spinner-border text-secondary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                         }
                        {!message.loading && message.image==undefined &&
                        <p class="card-text">{message.text}</p>
                        }
                        {
                            !message.loading && message.image!=undefined &&
                            <a href={message.img}><img src={message.image} width="400px" height="300px"/></a>
                        }
                    </div>
                    
                </div>
            </div>
        );
    }
}


class Input extends Component {
    state={
        text:"",
        imageurl:""
    }
    addMessage(){
        this.props.addMessage(this.state.text);
        this.setState({text:""});
    }
    handleImage(e){
       
        
    }
    render() {
        return (
            <footer class="message-input">
                <div class=" input-group mb-3">
                    <input id="filebrowser" onChange={(e)=>(this.props.addImage(e))}  type="file" accept="image/*" style={{"display":"none"}}/>
                    <button id="filebrowsericon" class="input-group-text" id="basic-addon1" onClick={()=>{document.getElementById('filebrowser').click()}}><span class="material-icons">attach_file</span></button>
                    <input type="text"  value={this.state.text} onChange={(e)=>{this.setState({text:e.target.value})}} class="form-control message-input-text" placeholder="Enter a message" aria-label="Username" aria-describedby="basic-addon1"/>
                    {this.state.text!=="" && <button type="button" class="input-group-text" id="basic-addon1" onClick={()=>{this.addMessage()}}><span class="material-icons">send</span></button>}
                </div>
            </footer>
        );
    }
}




