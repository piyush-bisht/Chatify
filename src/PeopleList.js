import React, { Component } from 'react'
import "./PeopleList.css"
import Avatar from '@material-ui/core/Avatar';
import firebase from 'firebase/app';
import moment from 'moment';
export default class PeopleList extends Component {
    
    constructor(props)
    {
        super(props);
        this.state={
            people:[]
        }
        
    }
    render() {
        var {activePerson}=this.props;
     
        return (
            <div>
                <ul class="person-list list-group">
                    {
                        this.props.people.map((person,i)=>{
                        
                        return (<Person key={i} person={person} setActivePerson={this.props.setActivePerson}/>)
                        })
                    }


                </ul>{
                activePerson.joinedDate!==undefined &&
                <div class="modal fade" id="newChats" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class=" modal-dialog justify-content-center">
                        <div class="modal-content">
                        <div  class="profile-modal">    
                            <div class="d-flex justify-content-center">
                                <img src={activePerson.profilePicture} style={{borderRadius:"50%"}} height="200vh" width="200vh"/>
                            </div>
                            <div class="d-flex justify-content-center">
                                <h5 class="modal-title" id="exampleModalLabel">{activePerson.name}<br/></h5>
                            </div>
                            <div class="d-flex justify-content-center"><p class="lead">{activePerson.username}</p></div>
                            <div class="modal-body">
                            
                             { <p>Joined {moment(activePerson.joinedDate.toDate()).format('LL') }</p> }
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>}
            </div>
        )
    }
}

class Person extends Component{
    
    constructor(props){
        super(props);
        this.state={person:this.props.person};

    }
    handleActivePerson(e,person){
        e.preventDefault();
        
        this.props.setActivePerson(person);
    }
    render(){
        
        var {person}=this.props;
        console.log(person);
        
        return(
            <a href="#" className="Person list-group-item list-group-item-action " aria="false" onClick={(e)=>{this.handleActivePerson(e,person)}}>
                
                <div className="row">
                    <div className="col-3"><Avatar  data-bs-toggle="modal" data-bs-target="#newChats" alt="Remy Sharp" src={person.profilePicture||"/static/images/avatar/1.jpg"} /></div>
                    <div className="col-9 d-none d-md-block">
                        <p className="h6">{person.name} </p>
                        <p className="recent lead">Click to Chat</p>
                    </div>
                </div>
            </a>
        )
    }
}