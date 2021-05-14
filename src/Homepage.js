import React, { Component } from 'react'
import MessageList from './MessageList'
import PeopleList from './PeopleList'
import firebase from 'firebase/app';
import "./Homepage.css";
import Navbar from './Navbar';
export default class Homepage extends Component {
    
    componentDidMount(){
       
        
        var loggedInUser;
        firebase.auth().onAuthStateChanged(((user)=>
        {
                if (user) {
                    
                    var USER={
                        id:"",
                        name:user.displayName,
                        username:user.email,    
                        profilePicture:user.photoURL,
                        joinedDate:""
                    }
                    loggedInUser=USER; 
                    this.loadChats(loggedInUser);
                } else {
                console.log("NOT LOGGED IN");
                  this.props.history.push("/");
                }
        }));
        
            
       
    }
    loadChats(loggedInUser)
    {
        var db=firebase.firestore();
        var people=[];
        var document={};    
        var loggedInUserRooms;
        db.collection("users").get().then((querySnapshot=>{
            querySnapshot.forEach((doc)=>{  
                if(doc.data().username==loggedInUser.username)
                {
                    loggedInUser.id=doc.data().id;
                    loggedInUser.joinedDate=doc.data().joinedDate
                    loggedInUserRooms=doc.data().rooms;
                    loggedInUser["rooms"]=loggedInUserRooms;
                }
                else{
                    people.push(doc.data());
                }      
            })
           
            this.setState({people,loggedInUser,user_docID:document})
        }))
    }
    
    constructor(props){
        super(props);
        this.state={
            people:[],
            
            loggedInUser:{},
            activePerson:{
                
            },
            messages:[],
            searchText:""
            
        }
        this.handleSetActivePerson=this.handleSetActivePerson.bind(this);
        this.addMessage=this.addMessage.bind(this);
        this.loadingMessage=this.loadingMessage.bind(this);
        this.handleSearchChat=this.handleSearchChat.bind(this);
        this.loadChats=this.loadChats.bind(this);
        this.handleDeleteMessage=this.handleDeleteMessage.bind(this);
    }
    handleSetActivePerson(person){      
        var db=firebase.firestore();
        
        var roomID=this.state.loggedInUser.rooms[person.id];
        if(roomID==undefined)
        {
            console.log("DOESNT EXIST ROOM")
            //ROOM DOESN'T EXIST, FIRST TIME CHATTING
            var msgs=[];
            this.setState({activePerson:person,messages:msgs})
            console.log(this.state.messages)
        }
        else{
            //ROOM EXISTS 
            roomID=roomID.id;
            //console.log("READING FROM "+ roomID);
            db.collection("rooms").doc(roomID).collection("messages")
            .orderBy("time", "asc")
            .onSnapshot((querySnapshot) => {  
                var msgs=[];
                querySnapshot.forEach(doc=>{
                    //console.log(doc.data())
                    msgs.push(doc.data());
                })
                this.setState({...this.state,activePerson:person,messages:msgs})
            });
        }

    }
    loadingMessage(msg){
        console.log("HERE AT LOADING POINT");
        console.log(msg);
        this.setState({messages:[...this.state.messages,msg]})
    }
    addMessage(msg){
        var {loggedInUser}=this.state;
        console.log(msg);
        console.log(loggedInUser);
        var to=msg.to;
        console.log(to)                                                 //SENDER's ID;
        var roomID=loggedInUser.rooms;
        var db=firebase.firestore();
        
        if(roomID===undefined || roomID[to]==undefined){
            console.log("new room created");
            roomID=db.collection("rooms").doc().id;
        }                                                                //create a new room document
        else{
            roomID=roomID[to].id;
            console.log(roomID);
        }
        
        
        
        db.collection("users").doc(loggedInUser.id).set({
            rooms:{
                [to]:db.doc("rooms/"+roomID)
            }
        },{merge:true})
        .then((ref)=>{
            console.log("SUCCESS");
            
        })
        .catch(error=>{
            console.log(error);
        })
        db.collection("users").doc(to).set({
            rooms:{
                [loggedInUser.id]:db.doc("rooms/"+roomID)
            }
        },{merge:true})
        .then((ref)=>{
            console.log("SUCCESS with Receiver as well");
            
        })
        .catch(error=>{
            console.log(error);
        })
        
        
        
        var newRef=db.collection("rooms").doc(roomID).collection("messages").doc();
        console.log(newRef.id);
        newRef.set({...msg,id:newRef.id})
       
        
        
        this.setState({
                messages:[...this.state.messages,msg]
            })
    }


    handleSearchChat()
    {
        var {people}=this.state;
        if(this.state.searchText!="")

       { var newpeople=people.filter(person=>person.name.split(' ')[0]==this.state.searchText);
        this.setState({people:newpeople});}
    }

    handleDeleteMessage(message){
        var db=firebase.firestore();
        var{loggedInUser,activePerson}=this.state;
        
        var roomId=loggedInUser.rooms[activePerson.id].id;
        console.log(roomId);
        console.log(message.id);

        db.collection("rooms").doc(roomId).collection("messages").doc(message.id).delete()
        .then(()=>{

            console.log("Deleted Successfully");
            this.loadChats(loggedInUser);
        })
        .catch(error=>{
            console.log(error);
        })

    }

    render() {

        return ( 
            <div className="home-view ">
                {this.state.searchText=="" && this.state.people.length==0 &&
                <div class="d-flex position-absolute top-50 start-50">
                    <div class="spinner-grow text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <div class="spinner-grow text-secondary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>  


                    <div class="spinner-grow text-dark" role="status">
                    <   span class="visually-hidden">Loading...</span>
                    </div>
                </div>
                }
                {
                this.state.people.length !=0 &&
                <div className=" home-view row">
                <div className="collapse" id="collapseMenu">
                    <Navbar loadChats={this.loadChats} history={this.props.history} people={this.state.people} loggedInUser={this.state.loggedInUser}/>
                    </div> 
                    <div className="col-3">
                    <div class="card list-column">
                        <div class="input-group search-box mb-3">
                            <a class="btn btn-dark" data-bs-toggle="collapse" href="#collapseMenu" role="button" aria-expanded="false" aria-controls="collapseExample">
                            <i class="fas fa-bars"></i>
                            </a>
                                <input type="text" class="form-control" id="chatsearch" placeholder="Search a chat"  aria-describedby="basic-addon2" value={this.state.searchText} onChange={(e)=>{this.setState({searchText:e.target.value})}} ></input>
                                <span class="input-group-text" id="search" ><i class="fas fa-search"></i></span>
                        </div>
                    </div>
                        <PeopleList people={this.state.people} activePerson={this.state.activePerson} setActivePerson={this.handleSetActivePerson} />       
                    </div>
                    <div className="col-8">
                        <MessageList deleteMessage={this.handleDeleteMessage} loadingMessage={this.loadingMessage}activePerson={this.state.activePerson}   messages={this.state.messages} addMessage={this.addMessage}/>
                    </div>
                   
                </div>
                
                }
                

            </div>
            
        
        )
    }
}
