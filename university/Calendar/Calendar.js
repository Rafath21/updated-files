import React, { Component } from "react";
import Fullcalender from "../../common/fullcalender";
import Modal from 'react-bootstrap/Modal'
import MultiSelectDropdown from '../../common/MultiSelectDropdown'
import {API , API2} from '../../../axios'

export default class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show : false,
      currentUser : localStorage.getItem("currentUser"),
      usersData : [],
      usersDataFetched : false,
      usersValue : [],
      users_associated_events : [],
      events : []
    };
  }

  

  getUserAssociatedEvents(){
    API2
    .get('/event',{})
    .then(res=>{
      let tempEvents=[];
      Object.keys(res.data.map((key,index)=>{
        console.log(key);
         if(key.users.includes(localStorage.getItem('user_id'))){
          console.log("user is present in this:", key)
          tempEvents.push(key);
         }
      }))
      this.setState({
        events:tempEvents
      })
    })
      /*.get(`/user/`+localStorage.getItem('user_id'), {})
      .then(res => {
        this.setState({
          users_associated_events : res.data.result.events
        });
        this.users_associated_events = res.data.result.events;
        API2
          .get(`/event`, {})
          .then(res => {
            let tempEvents = []
            res.data.forEach(el =>{
              if(this.state.users_associated_events.includes(el['id'])){
                tempEvents.push(el)
              }
            })
            this.setState({
              events : tempEvents
            })
          })
          .catch((error) => {
              console.log(error)
          })
      })
      .catch((error) => {
          console.log(error)
      })*/

  }


  getUsersData(){
    API
      .get(`/user/`+localStorage.getItem('user_id'), {})
      .then(res => {
          const currentUsersUniversity = res.data.result['university']
          API
          .get(`/user`, {})
          .then(res => {
              let tempUsersData = []
              for (const property in res.data) {
                if(res.data[property].university === currentUsersUniversity){
                  let tempUser = {}
                  tempUser.Name = res.data[property]['first_name'] + ' ' + res.data[property]['last_name']
                  tempUser.userId = res.data[property]['_id']
                  tempUsersData.push(tempUser);
                }
              }
              this.setState({
                usersData : tempUsersData,
                usersDataFetched : true
              })
          })
          .catch((error) => {
              console.log(error)
          })
      })
      .catch((error) => {
          console.log(error)
      })
    }

    componentDidMount(){
      //get university of current user then get users from current university
      this.getUsersData();
      this.getUserAssociatedEvents();
      }

    handleCallback = (childData) =>{
      let tempUserValue = []  
      childData.forEach(data => tempUserValue.push(data.userId))
      this.setState({usersValue: tempUserValue})
    }
  render() {
    let events_prop = []
    
    /* events.map( data => {
      if(event_ids.includes(data['id'])){
        let tempEvent = {}
        tempEvent['id'] = data['id'];
        tempEvent['title'] = data['name'];
        tempEvent['start'] = data['date']+'T'+data['time'];
        tempEvent['url'] = data['zoom_link'];
        events_prop.push(tempEvent)
      }
    }
    ) */

    this.state.events.map( data => {
      console.log(data)
        let tempEvent = {}
        tempEvent['id'] = data['id'];
        tempEvent['title'] = data['event_name'];
        tempEvent['start'] = data['start_date'];
        tempEvent['url'] = data['zoom_link'];
        events_prop.push(tempEvent)
    }
    )

    const handleClose = () => {
    };

    const createEvent = () => {



      const postData = {

      "event_name": document.getElementById('event_name').value,
      "start_date": document.getElementById('event_start_date').value,
      "end_date": document.getElementById('event_end_date').value,
      "start_time": document.getElementById('event_start_time').value,
      "end_time": document.getElementById('event_end_time').value,
      "description": document.getElementById('event_description').value,
      "reminder": document.getElementById('event_reminder').value,
      "zoom_link": document.getElementById('event_zoom_link').value,
      "users": this.state.usersValue
      }

      API2
      .post(`/event`, postData)
      .then(res => {
         console.log(res)
      })
      .catch((error) => {
          console.log(error)
      })

      this.setState({show:false})
    }
    
    const handleShow = () => this.setState({show:true});
    return (
      <>
      <Modal
        show={this.state.show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            
              <div className="form-group col-md-12 row">
                    <label className="col-md-6 col-form-label">Event Name</label>
                    <div className="col-md-12">
                      <input type="text" className="form-control" id="event_name" placeholder="Event Name"/>
                    </div>
              </div>
              <div className="form-group col-md-12 row">
                    <label className="col-md-6 col-form-label">Location</label>
                    <div className="col-md-12">
                      <input type="text" className="form-control" id="event_zoom_link" placeholder="Zoom Link"/>
                    </div>
              </div>

              <div className="form-group col-md-6 row">
                      <label className="col-md-6 col-form-label">Start Date</label>
                      <div className="col-md-12">
                        <input type="date" className="form-control" id="event_start_date" placeholder="Start Date"/>
                      </div>
              </div>

              <div className="form-group col-md-6 row">
                      <label className="col-md-6 col-form-label">Start Time</label>
                      <div className="col-md-12">
                        <input type="time" className="form-control" id="event_start_time" placeholder="Start Time"/>
                      </div>
              </div>

              <div className="form-group col-md-6 row">
                      <label className="col-md-6 col-form-label">End Date</label>
                      <div className="col-md-12">
                        <input type="date" className="form-control" id="event_end_date" placeholder="End Date"/>
                      </div>
              </div>

              <div className="form-group col-md-6 row">
                      <label className="col-md-6 col-form-label">End Time</label>
                      <div className="col-md-12">
                        <input type="time" className="form-control" id="event_end_time" placeholder="End Time"/>
                      </div>
              </div>

              <div className="form-group col-md-12 row">
                      <label className="col-md-6 col-form-label">Attendants</label>
                      <div className="col-md-12">
                        <MultiSelectDropdown userData = {this.state.usersData} fieldId="selectedUsers" parentCallback = {this.handleCallback}/>
                      </div>
              </div>

              <div className="form-group col-md-12 row">
                      <label className="col-md-6 col-form-label">Reminder</label>
                      <div className="col-md-12">
                        <input type="number" className="form-control" id="event_reminder" placeholder="Reminder"/>
                      </div>
              </div>

              <div className="form-group col-md-12 row">
                      <label className="col-md-6 col-form-label">Description</label>
                      <div className="col-md-12">
                        <textarea type="textarea" className="form-control" id="event_description" placeholder="Description"/>
                      </div>
              </div>
              
          </div>
          
        </Modal.Body>
        <Modal.Footer>
            <button className="btn btn-danger" onClick={handleClose}>Cancel</button>
            <button className="btn btn-success" onClick={createEvent}>Create</button>
        </Modal.Footer>
      </Modal>
        <div className="section-body">
          <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center ">
              <div className="header-action">
                <h1 className="page-title">Calendar</h1>
                <ol className="breadcrumb page-breadcrumb">
                  <li className="breadcrumb-item">
                    <a href>Admin</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Calendar
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
            <div className="col-md-12">
                  { 
                    this.state.currentUser !== 'Student' ?
                      <div className="col-md-12 flexCenter tar" style={{justifyContent:'flex-end',paddingRight:'35px'}}>
                        <button className="btn btn-primary" onClick={handleShow}>Add event</button>
                      </div>
                      : 
                      null 
                  }

            </div>
        </div>
        <div className="section-body mt-4">
          <div className="container-fluid">
            <div className="row clearfix row-deck" style={{textAlign:'center'}}>
              <div className="col-lg-12 col-md-12">
                <div className="card">
                  <div className="card-body">
                    <Fullcalender events={events_prop}></Fullcalender>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
