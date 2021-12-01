import React, { Component } from "react";
import { Link } from "react-router-dom";
import { API2 } from '../../../axios'
import MultiSelectDropdown from '../../common/MultiSelectDropdown';
import { API } from '../../../axios'


export default class CourseDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courseData: [],
      currentUser: localStorage.getItem('currentUser'),
      usersData: [],
      usersDataFetched: false,
      studentData:[],
      filteredStudentData:[],
      studentDataFetched:false,
      isTableOpen:false,
    };
  }

  handleCallback = (childData) => {
    let tempUserValue = []
    childData.forEach(data => tempUserValue.push(data.userId))
    this.setState({ usersValue: tempUserValue })
  }

  getUsersData() {
    API
      .get(`/user`)
      .then(res => {
        console.log(res)
        let tempUsersData = []
        for (const property in res.data) {
          if (res.data[property].role === 'student') {
            let tempUser = {}
            tempUser.Name = res.data[property]['first_name'] + ' ' + res.data[property]['last_name']
            tempUser.userId = res.data[property]['_id']
            tempUsersData.push(tempUser);
          }
        }
        this.setState({
          usersData: tempUsersData,
          usersDataFetched: true
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }


     getStudentData() {
    API
      .get(`/user`, {})
      .then(res => {
        let tempStudentData = []
        for (const property in res.data) {
          if (res.data[property].role === 'student' ) {
            tempStudentData.push(res.data[property]);
          }
        }
        this.setState({
          studentData:tempStudentData,
          filteredStudentData: tempStudentData,
          studentDataFetched: true
        })


      })
      .catch((error) => {
        console.log(error)
      })
  }
  componentDidMount() {
    this.setState({
      courseData: this.props.location.state,
    })
    if(this.state.currentUser=="Trainer" || this.state.currentUser=="Admin"){
          this.getStudentData();
    }
    this.getUsersData();
  }
  render() {

    const toggleCollapse = (collapseId, spanId) => {
      if (document.getElementById(collapseId).style.display === 'none') {
        document.getElementById(collapseId).style.display = 'block';
        document.getElementById(spanId).innerHTML = '-'

      }
      else {
        document.getElementById(collapseId).style.display = 'none'
        document.getElementById(spanId).innerHTML = '+'

      }
    }

    const courseFileUpload = (university, course_name, studName) => {
      let file = document.getElementById('courseFileUpload').files[0];
      let data = new FormData();
      data.append('file', file);
      data.append('university_name', university);
      data.append('course_name', course_name);
      data.append('student_name', studName);
      data.append('to', '');
      data.append('cc', '');
      data.append('bcc', '');
      data.append('subject', '-');
      data.append('text', '');
      const config = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }
      API2
        .post(`/course/upload-`, data, config)
        .then(res => {
          console.log(res)
        })
        .catch((error) => {
          console.log(error)
        })
    }

    const addStudentsClicked = () => {
      const postData = {
        "course_id": this.state.courseData._id,
        "user_id": this.state.usersValue
      }
      console.log(postData)
      API2.post('/course/enroll-course', postData)
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    }

     const getStudentFilteredData=(students)=>{
      let tempFilteredStudentData=[];
      Object.keys( this.state.studentData.map((key,index)=>{
            if(students.includes(this.state.studentData[index]["_id"])){
              tempFilteredStudentData.push(key)
            }
        }))
       
        this.setState({
          filteredStudentData:tempFilteredStudentData
        })
    }

    const userData = JSON.parse(localStorage.getItem('user_data'));
    const studentName = (`${userData['first_name']} ${userData['last_name']}`)
    return (
      <>
        <div className="section-body">
          <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center ">
              <div className="header-action mt-2">
                <h1 className="page-title">Courses Details</h1>
                <ol className="breadcrumb page-breadcrumb">
                  <li className="breadcrumb-item">
                    <span>{localStorage.getItem('currentUser')}</span>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/courses">Courses</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Details
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div className="section-body mt-4">
          <div className="container-fluid">
             <div className="row">
              <div className="col-xl-4 col-lg-5 col-md-12">
                <div className="card">
                  <img
                    className="card-img-top"
                    src={this.state.courseData['course_image']}
                    alt=""
                  />
                  <div className="card-body d-flex flex-column">
                    <h5>
                      <a href>{this.state.courseData['course_name']}</a>
                    </h5>
                    <div className="text-muted">
                      {this.state.courseData['description']}
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-striped table-vcenter mb-0">
                      <tbody>
                        <tr>
                          <td className="w20">
                            <i className="fa fa-list text-blue"></i>
                          </td>
                          <td className="tx-medium">Category</td>
                          <td className="text-right">{this.state.courseData['category']}</td>
                        </tr>
                        <tr>
                          <td className="w20">
                            <i className="fa fa-university text-blue"></i>
                          </td>
                          <td className="tx-medium">University</td>
                          <td className="text-right">{this.state.courseData['university']}</td>
                        </tr>
                        {/* <tr>
                          <td className="w20">
                            <i className="fa fa-desktop text-blue"></i>
                          </td>
                          <td className="tx-medium">Type</td>
                          <td className="text-right">{this.state.courseData['course_type']}</td>
                        </tr> */}
                        <tr>
                          <td className="w20">
                            <i className="fa fa-calendar text-blue"></i>
                          </td>
                          <td className="tx-medium">Duration</td>
                          <td className="text-right">{this.state.courseData['time_duration']}</td>
                        </tr>
                        <tr>
                          <td>
                            <i className="fa fa-cc-visa text-danger"></i>
                          </td>
                          <td className="tx-medium">Fees</td>
                          <td className="text-right">{this.state.courseData['price']}</td>
                        </tr>
                        {
                          this.state.courseData['students'] ?
                            <tr>
                              <td>
                                <i className="fa fa-users text-warning"></i>
                              </td>
                              <td className="tx-medium" onClick={()=>{
                                if(this.state.currentUser=="Trainer" || this.state.currentUser=="Admin"){
                                  this.setState({
                                    isTableOpen:true
                                  })
                                  console.log("table opened")
                                  getStudentFilteredData(this.state.courseData["students"])
                                }

                              }}>Students</td>
                              <td className="text-right">{this.state.courseData['students'].length}</td>
                            </tr>
                            :
                            null
                        }

                      </tbody>
                    </table>
                  </div>
                  <div className="card-footer">

                    {
                      this.state.currentUser === "Admin"

                      &&

                      <div className="addStudentDiv">
                        <div className="col-md-12">
                          <MultiSelectDropdown userData={this.state.usersData} fieldId="selectedUsers" parentCallback={this.handleCallback} />
                          <button className="btn btn-primary mt-1" onClick={addStudentsClicked} style={{ marginTop: '20px' }}>Add Students</button>
                        </div>
                      </div>
                    }

                  </div>
                </div>
              </div>
              <div className="col-xl-8 col-lg-7 col-md-12">
                <div className="card">
                  <div className="card-body">
                    <p>
                      {
                        this.state.courseData['about_this_course'] &&
                        <span>
                          <strong>About this course<br /> </strong>
                          {this.state.courseData['about_this_course']}
                        </span>
                      }
                    </p>
                    <p>
                      {
                        this.state.courseData['who_this_course_is_for'] &&
                        <span>
                          <strong>Who this course is for<br /> </strong>
                          {this.state.courseData['who_this_course_is_for']}
                        </span>
                      }
                    </p>
                    <p>
                      {
                        this.state.courseData['requirements'] &&
                        <span>
                          <strong>Requirements<br /> </strong>
                          {this.state.courseData['requirements']}
                        </span>
                      }
                    </p>
                    <p>
                      {
                        this.state.courseData['why_to_learn'] &&
                        <span>
                          <strong>Why to learn<br /> </strong>
                          {this.state.courseData['why_to_learn']}
                        </span>
                      }
                    </p>
                    <p>
                      {
                        this.state.courseData['skills_you_learn'] &&
                        <span>
                          <strong>Skills you learn<br /> </strong>
                          {this.state.courseData['skills_you_learn']}
                        </span>
                      }
                    </p>
                    <h5 className="mt-4">Course Syllabus</h5>
                    <ul className="list-group">
                      {
                        this.state.courseData['modules'] ?
                          this.state.courseData['modules'].map((data) => {
                            return (
                              <div className="row" style={{ marginBottom: '12px', cursor: 'pointer' }} key={data['_id']}>
                                <div className="col-md-9">
                                  <li className="list-group-item d-flex justify-content-between align-items-center"
                                    onClick={() => toggleCollapse(data['module_name'] + '_collapse', data['module_name'] + '_span')}>
                                    {data['module_name']}
                                    <div>
                                      <span className="badge badge-primary badge-pill">
                                        {data['time_limit']}

                                      </span> &nbsp;
                                  <span id={data['module_name'] + '_span'}>
                                        +
                                  </span>

                                    </div>
                                  </li>
                                </div>
                                <div className="col-md-3 dfac">
                                  {
                                    data['is_complete'] ?
                                      <button className="btn btn-primary" disabled> Completed </button>
                                      :
                                      <button className="btn btn-primary"> Mark as complete </button>
                                  }
                                </div>

                                <div className="col-md-9">
                                  <div id={data['module_name'] + '_collapse'} className="moduleData" style={{ display: 'none' }}>
                                    {
                                      data['resources'] ?
                                        <a href={data['resources']} style={{ color: 'rgb(140, 126, 126)' }} target="_blank"> Resource 1</a> : null
                                    }
                                    {
                                      data['upload_lecture'] !=='' ?
                                        <a href={data['upload_lecture']} style={{ color: 'rgb(140, 126, 126)' }} target="_blank"> <br /><br /> Resource 2 </a> : null
                                    }
                                    {
                                      data['zoom_link'] !== '' ?
                                        <a href={data['zoom_link']} style={{ color: 'rgb(140, 126, 126)' }} target="_blank"> <br /><br /> Resource 3 </a> : null
                                    }

                                  </div>
                                </div>

                              </div>
                            )
                          })
                          : null
                      }

                    </ul>
                    <div className="row" style={{ display: 'flex', alignItems: 'center', padding: '20px' }}>
                      <form action="" style={{ display: 'contents' }}>
                        <div className="col-md-6 col-sm-12 form-group">
                          <input type="file" name="" id="courseFileUpload" className="form-control" />
                        </div>
                        <div className="col-md-3  col-sm-12 form-group">
                          <button type="button" className="btn btn-primary" onClick={() => courseFileUpload(this.state.courseData['university'], this.state.courseData['course_name'], studentName)}>Upload</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {this.state.isTableOpen?
             <div className="table-responsive card">
                  <table className="table table-hover table-vcenter table-striped mb-0 text-nowrap tac">
                    <thead>
                      <tr>
                        <th>Avatar</th>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>University</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.studentDataFetched ?
                          this.state.filteredStudentData.map((data) => {
                            return (
                              <tr key={data['_id']}>
                                <td className="w60">
                                  <img
                                    className="avatar"
                                    src="../assets/images/xs/avatar1.jpg"
                                    alt=""
                                  />
                                </td>
                                <td>
                                  <span className="font-16">{data['first_name'] + ' ' + data['last_name']}</span>
                                </td>
                                <td>{data['department']}</td>
                                <td>{data['email']}</td>
                                <td>{data['phone']}</td>
                                <td>{data['university']}</td>

                          </tr>

                            )
                          })

                          :

                          <tr>
                            <td>Loading...</td>
                            <td>Loading...</td>
                            <td>Loading...</td>
                            <td>Loading...</td>
                            <td>Loading...</td>
                            <td>Loading...</td>
                            <td>Loading...</td>
                          </tr>
                      }
                    </tbody>
                  </table>
                </div>
          
          :""}
          </div>
        </div>
      </>
    );
  }
}
