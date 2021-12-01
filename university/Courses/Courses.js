import React, { Component } from "react";
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { TabContent, TabPane, Nav, NavLink, NavItem } from "reactstrap";
import classnames from "classnames";
import { API, API2 } from '../../../axios'
import toast, { Toaster } from "react-hot-toast";
export default class Courses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 1,
      moduleValue: '',
      showModules: false,
      moduleHtml: [],
      currentUser: localStorage.getItem("currentUser"),
      coursesData: [],
      enrolledCourses:[],
      enrolledAndCompleted: [],
      trainersPaidCourses:[],
      trainersUnpaidCourses:[],
      trainersCompletedCourses:[],
      studentData:[],
      filteredStudentData:[],
      studentDataFetched:false,
      filteredCoursesData: [],
      coursesDataFetched: false,
      allModules:[], //previous modules to be displayed when on edit page
      noOfEditModules:'', //no. of modules on edit page
      addedModules:[],//modules that are being added on the edit page
      competencies: [],
      competenciesFetched: false,
      trainerData: [],
      trainerDataFetched: false,
      UniversityNames: [],
      UniversityNamesFetched: false,
      categoryData: [],
      categoryDataFetched: false,
      currentEditCourseInfo: {},
      currentEditCourseInfoFetched: false,
    };
  }

  getCoursesData() {
    API2
      .get(`/course`, {})
      .then(res => {
        this.setState({
          coursesData: res.data['result'],
          filteredCoursesData: res.data['result'],
          coursesDataFetched: true,
        })
         let TDate=(d)=>{
              let GivenDate = d;
              let CurrentDate = new Date();
              GivenDate = new Date(GivenDate);
              if (GivenDate > CurrentDate) {
                return false  //not completed
              } else {
                return true //completed
              }
          }
        if(this.state.currentUser==="Trainer"){
          let user=JSON.parse(localStorage.getItem("user_data"))
          let username=user['first_name']+""+user['last_name'];
          let tempTrainerspaidCourses=[];
          let tempTrainersunpaidCourses=[];
          let tempTrainerscompletedCourses=[];
         for(let i=0;i<this.state.coursesData.length;i++){
          if(this.state.coursesData[i]["trainer"].replace(/\s/g,'')==username){
            if(this.state.coursesData[i]["course_paid"]==false
            && !TDate(this.state.coursesData[i]["end_date"])
            ){
            tempTrainersunpaidCourses.push(this.state.coursesData[i])
          }
             if(this.state.coursesData[i]["course_paid"]==true
            && !TDate(this.state.coursesData[i]["end_date"])
            ){
            tempTrainerspaidCourses.push(this.state.coursesData[i])
          }
          if(TDate(this.state.coursesData[i]["end_date"])){
              tempTrainerscompletedCourses.push(this.state.coursesData[i])
            }
          }
          }
          this.setState({
            trainersUnpaidCourses:tempTrainersunpaidCourses,
            trainersPaidCourses:tempTrainerspaidCourses,
            trainersCompletedCourses:tempTrainerscompletedCourses
          })
        }
       
        if(this.state.currentUser==="Student"){
          let userid=localStorage.getItem("user_id");
          let tempStudentCourses=[];
          let tempStudentCompletedCourses=[];
          let studentCourses=this.state.coursesData;
           Object.keys(studentCourses.map((key,index)=>{
           let students=key.students;
              if(students.includes(userid)){
                      tempStudentCourses.push(key)
                      if(TDate(key.end_date)){
                        tempStudentCompletedCourses.push(key)
                      }
                 }
            }))
            this.setState({
                enrolledCourses:tempStudentCourses,
                enrolledAndCompleted:tempStudentCompletedCourses
             })
        }
      
      
      
     }).catch((error) => {
        console.log(error)
      })
  }
  getCompetencies() {
    API2
      .get(`/competency`, {})
      .then(res => {
        const data = res.data['result']
        this.setState({
          competencies: data,
          competenciesFetched: true
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }
  getTrainersData() {
    API
      .get(`/user`, {})
      .then(res => {
        let tempTrainerData = []
        for (const property in res.data) {
          if (res.data[property].role === 'trainer') {
            tempTrainerData.push(res.data[property]['first_name'] + ' ' + res.data[property]['last_name']);
          }
        }
        this.setState({
          trainerData: tempTrainerData,
          trainerDataFetched: true
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }
  getUniversityNames() {
    API
      .get(`/university`, {})
      .then(res => {
        //console.log(typeof(res.data))
        let tempUniversities = []
        for (const property in res.data) {
          tempUniversities.push(res.data[property].university_name)
        }
        this.setState({
          UniversityNames: tempUniversities,
          UniversityNamesFetched: true
        })


      })
      .catch((error) => {
        console.log(error)
      })
  }
  getCategoryData() {
    API2
      .get(`/category`, {})
      .then(res => {
        const data = res.data['result']
        this.setState({
          categoryData: data,
          categoryDataFetched: true
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
    this.getCategoryData()
    this.getUniversityNames()
    this.getTrainersData()
    this.getCompetencies()
    this.getCoursesData()
    if(this.state.currentUser=="Trainer" || this.state.currentUser=="Admin"){
          this.getStudentData();
    }
    if (this.state.currentUser === 'Student') {
      this.getEnrolledCourses()
    }
  }
  render() {
    const { activeTab } = this.state;
    console.log("filtered stdent data:", this.state.filteredStudentData)
    const ModuleInputHandler = (event) => {
      const re = /^[0-9\b]+$/;
      if ((event.target.value === '' || re.test(event.target.value)) && event.target.value > 0) {
        this.setState({ moduleValue: event.target.value })
        this.setState({ moduleHtml: [] })
        let moduleNumbers = []
        for (let i = 1; i <= event.target.value; i++) {
          moduleNumbers.push('Module' + i)
        }
        this.setState({ moduleHtml: [moduleNumbers] })
        this.setState({ showModules: true })
      }
      else {
        this.setState({ moduleValue: '' })
        this.setState({ moduleHtml: [] })
        this.setState({ showModules: false })
      }
    }
    const notify =(msg)=>{
    toast.success(msg);
  };
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
    const postFile =async (uploads) => {
      console.log("in post file");
      uploads.forEach(async(el) => {
        console.log("element:",el)
        let file = document.getElementById(el.inputId).files[0];
        let data = new FormData();
        data.append('file', file);
        data.append('university_name', el.universityName)
        data.append('course_name', el.courseName)
        data.append('module_name', el.courseModuleName)
        data.append('upload_type', el.uploadType)
        data.append('course_image', false)
        const config = {
          headers: {
            'content-type': 'multipart/form-data'
          }
        }
      try{
      let res= await  API2.post(`/course/file-upload`, data, config)
      console.log(res);
      }catch(err){
        console.log(err);
      }
      
      })
    }

    function TDate(d) {
      let GivenDate = d;
      let CurrentDate = new Date();
      GivenDate = new Date(GivenDate);

      if (GivenDate > CurrentDate) {
        return false  //not completed
      } else {
        return true //completed
      }
    }

  const postCourseImage = async (university_name, course_name, postFile) => {
      console.log("in post course image");
      let file = postFile;
      let data = new FormData();
      data.append('file', file);
      data.append('university_name', university_name)
      data.append('course_name', course_name)
      data.append('module_name', '')
      data.append('upload_type', '')
      data.append('course_image', true)
      const config = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }
    try{
    let res=await API2.post(`/course/file-upload`, data, config)
    console.log("post course image res:",res)
    }catch(err){
      console.log(err);
    }
    
  }

    const addCourseSubmit = () => {

      document.getElementById('addCourseSubmitBtn').disabled=true;
      document.getElementById('addCourseSubmitBtn').value="Processing..";


      let postData = {}
      postData.course_name = document.getElementById('form_courseName').value;
      postData.trainer = document.getElementById('form_courseTrainer').value;
      postData.competency = document.getElementById('form_courseCompetency').value;
      postData.description = document.getElementById('form_courseDescription').value;
      postData.youtube_link = document.getElementById('form_courseYoutubeLink').value;
      postData.about_this_course = document.getElementById('form_courseAboutThisCourse').value;
      postData.who_this_course_is_for = document.getElementById('form_courseWhoThisCourseIsFor').value;
      postData.requirements = document.getElementById('form_courseRequirements').value;
      postData.why_to_learn = document.getElementById('form_courseWhyToLearn').value;
      postData.skills_you_learn = document.getElementById('form_courseSkillsYouLearn').value;
      postData.category = document.getElementById('form_courseCategory').value;
      postData.course_paid = (document.getElementById('form_coursePaid').value === "true");
      postData.course_featured = (document.getElementById('form_courseFeatured').value === "true");
      postData.university = document.getElementById('form_courseUniversity').value;
      postData.course_type = document.getElementById('form_courseType').value;
      postData.is_private = document.getElementById('form_coursePrivate').value === 'Yes';
      //to be done
      postData.course_image = "tbd";
      postData.start_date = document.getElementById('form_courseStartDate').value;
      postData.end_date = document.getElementById('form_courseEndDate').value;
      postData.time_duration = document.getElementById('form_courseDuration').value;
      postData.price = document.getElementById('form_coursePrice').value;
      postData.no_of_modules = document.getElementById('form_courseNOM').value;
      if(postData.course_name==''){
        alert("Course name cannot be empty");
        document.getElementById('addCourseSubmitBtn').disabled=false;
      document.getElementById('addCourseSubmitBtn').value="Submit";
      }else if(postData.competency==''){
        alert('Competency cannot be empty');
        document.getElementById('addCourseSubmitBtn').disabled=false;
      document.getElementById('addCourseSubmitBtn').value="Submit";
      }else if(postData.university==''){
        alert('University name cannot be empty')
        document.getElementById('addCourseSubmitBtn').disabled=false;
      document.getElementById('addCourseSubmitBtn').value="Submit";
      }else if(postData.category===''){
        alert("Category cannot be empty")
        document.getElementById('addCourseSubmitBtn').disabled=false;
      document.getElementById('addCourseSubmitBtn').value="Submit";
      }else if(postData.trainer==''){
        alert("Trainer name cannot be empty")
        document.getElementById('addCourseSubmitBtn').disabled=false;
      document.getElementById('addCourseSubmitBtn').value="Submit";
      }else{

      let modules = []
      for (let i = 0; i < document.getElementById('form_courseNOM').value; i++) {
        let tempModule = {}
        tempModule.module_name = document.getElementById('form_CourseModuleName' + i).value
        tempModule.module_date = document.getElementById('form_CourseModuleDate' + i).value;
        tempModule.time_limit = document.getElementById('form_CourseModuleTimeLimit' + i).value;
        tempModule.module_reminder = document.getElementById('form_CourseModuleReminder' + i).value;
        tempModule.resources=document.getElementById('form_CourseModuleResource1'+i).value;
        tempModule.upload_lecture=document.getElementById('form_CourseModuleResource2'+i).value;
        tempModule.zoom_link=document.getElementById('form_CourseModuleResource3'+i).value;

        modules.push(tempModule)
      }
      postData.modules = modules;

      //Post Data
      API2
        .post(`/course`, postData)
        .then(res => {
                if (document.getElementById('form_CourseImage').files[0]) {
                postCourseImage(postData.university, postData.course_name, document.getElementById('form_CourseImage').files[0])
                .then(()=>{
                  resetAfterAdd();
                })
              }
              else{
                resetAfterAdd();
              }
          
        })
        .catch((error) => {
          console.log(error)
        document.getElementById('addCourseSubmitBtn').disabled=false;
        })
      }
      
}
    const resetAfterAdd=()=>{
        notify("Course Added ✅");
        document.getElementById('addCourseSubmitBtn').disabled=false;
        document.getElementById('addCourseSubmitBtn').value="Submit";
        document.getElementById('form_courseNOM').value='';
        document.getElementById('addCourseForm').reset();
        //clearForm();
        this.getCoursesData()
        this.setState({
          moduleValue:'',
          activeTab:1,
          moduleHtml:[]
        })
    }
    const resetAfterEdit=()=>{
        notify("Course Updated ✅");
       document.getElementById('edit_courseForm_submit').disabled = false;
       document.getElementById('edit_courseForm_submit').innerHTML = 'Submit';
      let temp=[];
       this.setState({
         currentEditCourseInfoFetched:false,
         currentEditCourseInfo:temp
       })
       this.getCoursesData()
       setTimeout(()=>{
        window.location.reload();
       },2000)
                  
    }
    const onFilter = (val) => {
      let tempFilterData = []
      let backupData = this.state.coursesData
      Object.keys(backupData).map((key, index) => {
        if (backupData[key]['university'] === val || val === 'all') {
          tempFilterData.push(backupData[key])
        }
        return true
      }

      );



      this.setState({
        filteredCoursesData: tempFilterData
      })


    }

    const onDeleteClicked = (id) => {
      console.log(id);
      API2
        .delete(`/course/${id}`)
        .then(res => {
          console.log(res);
          this.getCoursesData()
        })
        .catch((error) => {
          console.log(error)
        })
    }

    const  addModuleClicked=(event)=>{
          let tempaddedModules=this.state.addedModules;
          let obj={};
          tempaddedModules.push(obj);
          this.setState({
            addedModules:tempaddedModules,
          })
           let temp=this.state.noOfEditModules+this.state.addedModules.length;
          this.setState({
         noOfEditModules:temp
       })
      
    }
    const onEditClicked = (id) => {
      console.log(id);
      API2.get('/course/' + id, {})
        .then(res => {
          console.log(res.data.result)
          this.setState({
            activeTab: 301,
            currentEditCourseInfo: res.data.result,
            currentEditCourseInfoFetched: true
            
          })
          //logic for setting allModules array and noOfEditModules array
          if(this.state.currentEditCourseInfo['modules'].length>0){
            let tempAllModules=[];
            Object.keys(this.state.currentEditCourseInfo['modules']).map((data,id)=>{
               tempAllModules.push(this.state.currentEditCourseInfo['modules'][id]);
            })
              this.setState({
                allModules:tempAllModules,
                noOfEditModules:tempAllModules.length
              })
          }
          for(let i=0;i<this.state.allModules.length;i++){
            console.log(this.state.allModules[i])
          }
        })
        .catch(err => {
          console.log(err)
        })
    }

     const CourseEdit = async() => {
     
      document.getElementById('edit_courseForm_submit').disabled = true;
      document.getElementById('edit_courseForm_submit').innerHTML = 'Processing...';

      let postData = {}
      postData.university = this.state.currentEditCourseInfo.university;
      postData.course_type = this.state.currentEditCourseInfo.course_type;
      postData.course_image= this.state.currentEditCourseInfo.course_image;
      postData.course_name=document.getElementById('edit_form_courseName').value;
      postData.trainer=document.getElementById('edit_form_courseTrainer').value;
      postData.competency=document.getElementById('edit_form_courseCompetency').value;
      postData.category=document.getElementById('edit_form_courseCategory').value;
      if(postData.course_name===''){
        alert("Course name cannot be empty!")
      document.getElementById('edit_courseForm_submit').disabled = false;
      document.getElementById('edit_courseForm_submit').innerHTML = 'Submit';
      }
      if(postData.trainer===''){
        alert("Trainer name cannot be empty!")
        document.getElementById('edit_courseForm_submit').disabled = false;
      document.getElementById('edit_courseForm_submit').innerHTML = 'Submit';
      }
      if(postData.competency===''){
        alert("Competency cannot be empty!")
        document.getElementById('edit_courseForm_submit').disabled = false;
      document.getElementById('edit_courseForm_submit').innerHTML = 'Submit';
      }
      if(postData.category===''){
        alert("Category cannot be empty!")
        document.getElementById('edit_courseForm_submit').disabled = false;
      document.getElementById('edit_courseForm_submit').innerHTML = 'Submit';
      }
      else{
        console.log("postData:",postData)

     let modules = []


       for (let i = 0; i <this.state.allModules.length; i++) {
        let tempModule = {}
        tempModule.module_name = document.getElementById('form_editModuleName' + i).value
        tempModule.module_date = document.getElementById('form_editModuleDate' + i).value;
        tempModule.time_limit = document.getElementById('form_editModuleTimeLimit' + i).value;
        tempModule.module_reminder = document.getElementById('form_editModuleReminder' + i).value;
        tempModule.resources=document.getElementById('form_editModuleResource1'+i).value;
        tempModule.upload_lecture=document.getElementById('form_editModuleResource2'+i).value;
        tempModule.zoom_link=document.getElementById('form_editModuleResource3'+i).value;

        modules.push(tempModule)
       }

       for (let i = 0; i < this.state.addedModules.length; i++) {
        let tempModule = {}
        tempModule.module_name = document.getElementById('form_addModuleName' + i).value
        tempModule.module_date = document.getElementById('form_addModuleDate' + i).value;
        tempModule.time_limit = document.getElementById('form_addModuleTimeLimit' + i).value;
        tempModule.module_reminder = document.getElementById('form_addModuleReminder' + i).value;
        tempModule.resources=document.getElementById('form_addModuleResource1'+i).value;
        tempModule.upload_lecture=document.getElementById('form_addModuleResource2'+i).value;
        tempModule.zoom_link=document.getElementById('form_addModuleResource3'+i).value;

     
        modules.push(tempModule)
      }
      postData.modules = modules;

     
      API2
      .patch(`/course/` + this.state.currentEditCourseInfo._id, {
      "course_name" : document.getElementById('edit_form_courseName').value,
      "trainer" : document.getElementById('edit_form_courseTrainer').value,
      "competency" :document.getElementById('edit_form_courseCompetency').value,
      "description" : document.getElementById('edit_form_description').value,
      "about_this_course" :document.getElementById('edit_form_about').value ,
      "who_this_course_is_for" :document.getElementById('edit_form_whoisthiscoursefor').value,
      "requirements" : document.getElementById('edit_form_requirements').value,
      "why_to_learn" : document.getElementById('edit_form_whytolearn').value,
      "skills_you_learn" : document.getElementById('edit_form_skillsyoulearn').value,
      "category" : document.getElementById('edit_form_courseCategory').value,
      "course_paid" : (document.getElementById('edit_form_paid').value === "true"),
      "course_featured" : (document.getElementById('edit_form_featured').value === "true"),
      "university" : postData.university,
      "course_type" : postData.course_type,
      "is_private" :  document.getElementById('edit_form_privacy').value === 'Yes',
      "course_image" : postData.course_image,
      "start_date" :document.getElementById('edit_form_startDate').value,
      "end_date" :document.getElementById('edit_form_endDate').value, 
      "time_duration" : document.getElementById('form_courseDuration').value,
      "price" :document.getElementById('edit_form_price').value, 
      "no_of_modules" : document.getElementById('form_editNOM').value,
      "modules":postData.modules
        })
        .then(res => {
          console.log(res);
            if (document.getElementById('form_edit_Image').files[0]) {
            console.log("file name:",document.getElementById('form_edit_Image').files[0])
            console.log("course name:", document.getElementById('edit_form_courseName').value);
            console.log("university name:",postData.university);
            postCourseImage(postData.university, document.getElementById('edit_form_courseName').value, document.getElementById('form_edit_Image').files[0])
            .then((data)=>{
                resetAfterEdit();
              })
            }else{
              resetAfterEdit();
            }
      })
      .catch((error) => {
          this.getCoursesData()
         document.getElementById('edit_courseForm_submit').disabled = false;

        })
      }
      
    }

    return (
      <>
        <div className="section-body">
          <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center ">
              <div className="header-action mt-2">
                <h1 className="page-title">Courses</h1>
                <ol className="breadcrumb page-breadcrumb">
                  <li className="breadcrumb-item">
                    {localStorage.getItem('currentUser')}
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Courses
                  </li>
                </ol>
              </div>
              <Toaster position="top-right" />
              <div className="row mt-2 mb-0">
                <div className="col-md-12 mwmc">
                  {
                    this.state.currentUser == 'Admin'

                      ?

                      <select
                        className="form-control input-height"
                        id="filterUniversity"
                        onChange={(e) => onFilter(e.target.value)}
                        defaultValue="all"
                      >
                        <option value="all">Select University</option>
                        {
                          this.state.UniversityNamesFetched ?

                            this.state.UniversityNames.map((data, id) => {
                              return (
                                <option value={data} key={data + [id + 170]}>{data}</option>
                              )
                            })
                            :
                            null
                        }

                      </select>

                      :

                      null
                  }
                </div>
              </div>
              <Nav tabs className="page-header-tab">
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === 1 })}
                    onClick={() =>{ 
                      this.setState({ activeTab: 1 })
                      if(this.state.currentUser!="Student"){
                        let temp=[];
                        this.setState({currentEditCourseInfoFetched:false})
                        this.setState({currentEditCourseInfo:temp})
                      }
                       
                    }}
                  >
                    Completed Courses
                  </NavLink>
                </NavItem>

                {
                  this.state.currentUser === "Student" &&
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === 201 })}
                      onClick={() => this.setState({ activeTab: 201 })}
                    >
                      Enrolled Courses
                    </NavLink>
                  </NavItem>
                }

                {/* <NavItem>
									<NavLink
										className={classnames({ active: activeTab === 2 })}
										onClick={() => this.setState({ activeTab: 2 })}
									>
										Add
    			               </NavLink>
								</NavItem> */}
                {this.state.currentUser !== 'Student' ?
                  <>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === 101 })}
                        onClick={(e) => {
                        
                        this.setState({ activeTab: 101 })
                        let temp=[];
                        this.setState({currentEditCourseInfoFetched:false})
                        this.setState({currentEditCourseInfo:temp})
                        }}
                      >
                        Paid Courses
                  </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === 102 })}
                        onClick={() =>{
                        let temp=[];
                        this.setState({currentEditCourseInfoFetched:false})
                        this.setState({currentEditCourseInfo:temp})
                           this.setState({ activeTab: 102 })}
                          }
                      >
                        Unpaid Courses
                  </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === 3 })}
                        onClick={() =>{ 
                          let temp=[];
                        this.setState({currentEditCourseInfoFetched:false})
                        this.setState({currentEditCourseInfo:temp})
                        this.setState({ activeTab: 3 })}}
                      >
                        Add Course
                    </NavLink>
                    </NavItem>
                  </>
                  : null
                }

              </Nav>
            </div>
          </div>
        </div>
        <div className="section-body mt-4">
          <div className="container-fluid">
            <TabContent activeTab={activeTab}>
              <TabPane tabId={1} className={classnames(["fade show"])}>

                {/* Show all courses for admin */}
                {
                  this.state.currentUser === 'Admin' &&

                  <div className="row row-deck">
                    {
                      Object.keys(this.state.filteredCoursesData).map((key, index) =>
                        <>
                          {
                            TDate(this.state.filteredCoursesData[index]["end_date"]) 
                            &&
                            <div className="col-xl-4 col-lg-4 col-md-6" key={this.state.filteredCoursesData[index]["_id"]}>
                              <div className="card">
                                {/* <div className="CardImgTopCustom"> */}
                                {/* <img src="https://www.dropbox.com/s/n8wljjjn3c65qv0/zz.jpeg?dl=1&preview=zz.jpeg" alt="" srcSet=""/> */}
                                {/* <img src={this.state.filteredCoursesData[index]["course_image"]} alt="" srcSet="" /> */}
                                {/* </div> */}
                                <div className="card-body d-flex flex-column">
                                  <div className="row">
                                    <div className="col-md-10">
                                      <h5 style={{ display: 'inline-block' }}>
                                        <Link to={{ pathname: "/courseDetails", state: this.state.filteredCoursesData[index] }} style={{ color: '#2185d0' }}>
                                          {this.state.filteredCoursesData[index]["course_name"]}
                                        </Link>
                                      </h5>
                                    </div>
                                    <div className="col-md-2" style={{ textAlign: 'right' }}>
                                      <button
                                        onClick={() => onEditClicked(this.state.filteredCoursesData[index]["_id"])}
                                        type="button"
                                        className="btn btn-icon btn-sm js-sweetalert"
                                        title="Edit"
                                        data-type="confirm"
                                      >
                                        <i className="fa fa-edit" style={{ fontSize: '16px', color: 'rgba(0,0,0)' }}></i>
                                      </button>
                                      <button
                                        onClick={() => onDeleteClicked(this.state.filteredCoursesData[index]["_id"])}
                                        type="button"
                                        className="btn btn-icon btn-sm js-sweetalert"
                                        title="Delete"
                                        data-type="confirm"
                                      >
                                        <i className="fa fa-trash-o text-danger" style={{ fontSize: '16px' }}></i>
                                      </button>
                                    </div>
                                  </div>
                                  <div className="text-muted">
                                    University:
                                    {this.state.filteredCoursesData[index]["university"]}
                                  </div>
                                  <div className="text-muted">
                                    Trainer:
                                    {this.state.filteredCoursesData[index]["trainer"]}
                                  </div>
                                  <div className="text-muted">
                                    No. of Modules:
                                    {this.state.filteredCoursesData[index]["no_of_modules"]}
                                  </div>
                                </div>

                                {this.state.currentUser === 'Admin' ? null :


                                  <>

                                    <div className="table-responsive">
                                      <table className="table table-striped table-vcenter mb-0">
                                        <tbody>
                                          <tr>
                                            <td className="w20">
                                              <i className="fa fa-list text-blue"></i>
                                            </td>
                                            <td className="tx-medium">Category</td>
                                            <td className="text-right">{this.state.filteredCoursesData[index]["category"]}</td>
                                          </tr>
                                          <tr>
                                            <td className="w20">
                                              <i className="fa fa-university text-blue"></i>
                                            </td>
                                            <td className="tx-medium">University</td>
                                            <td className="text-right">{this.state.filteredCoursesData[index]["university"]}</td>
                                          </tr>
                                          <tr>
                                            <td className="w20">
                                              <i className="fa fa-desktop text-blue"></i>
                                            </td>
                                            <td className="tx-medium">Type</td>
                                            <td className="text-right">{this.state.filteredCoursesData[index]["course_type"]}</td>
                                          </tr>
                                          <tr>
                                            <td className="w20">
                                              <i className="fa fa-calendar text-blue"></i>
                                            </td>
                                            <td className="tx-medium">Duration</td>
                                            <td className="text-right">{this.state.filteredCoursesData[index]["time_duration"]} Hrs</td>
                                          </tr>
                                          <tr>
                                            <td>
                                              <i className="fa fa-cc-visa text-danger"></i>
                                            </td>
                                            <td className="tx-medium">Fees</td>
                                            <td className="text-right">{this.state.filteredCoursesData[index]["price"]}</td>
                                          </tr>
                                          <tr>
                                            <td>
                                              <i className="fa fa-users text-warning"></i>
                                            </td>
                                            <td className="tx-medium">Students</td>
                                            <td className="text-right">{this.state.filteredCoursesData[index]["students"].length}</td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                    <div className="card-footer">
                                    </div>
                                  </>
                                }
                              </div>
                            </div>



                          }
                        </>
                      )

                    }
                  </div>
                }

                {/* Show only enrolled courses for student */}

                {
                  this.state.currentUser === 'Student' &&

                  <div className="row row-deck">
                    {
                      Object.keys(this.state.enrolledAndCompleted).map((key, index) =>
                        <>
                          {
                          //TDate(this.state.enrolledCourses[index]["end_date"]) && this.state.enrolledCourses.includes(this.state.enrolledCourses[index]["_id"])
                            /*&&  this.state.enrolledAndCompleted[this.state.filteredCoursesData[index]["_id"]] && */
                            <div className="col-xl-4 col-lg-4 col-md-6" key={this.state.enrolledAndCompleted[index]["_id"] + [index + 102]}>
                              <div className="card">
                                {/* <div className="CardImgTopCustom">
                                  <img src={this.state.filteredCoursesData[index]["course_image"]} alt="" srcSet="" />
                                </div> */}
                                <div className="card-body d-flex flex-column">
                                  <h5>
                                    <Link to={{ pathname: "/courseDetails", state: this.state.enrolledAndCompleted[index] }} style={{ color: '#2185d0' }}>
                                      {this.state.enrolledAndCompleted[index]["course_name"]}
                                    </Link>
                                  </h5>
                                  <div className="text-muted">
                                    {this.state.enrolledAndCompleted[index]["description"]}
                                  </div>
                                </div>

                                {this.state.currentUser === 'Admin' ? null :


                                  <>

                                    <div className="table-responsive">
                                      <table className="table table-striped table-vcenter mb-0">
                                        <tbody>
                                          <tr>
                                            <td className="w20">
                                              <i className="fa fa-list text-blue"></i>
                                            </td>
                                            <td className="tx-medium">Category</td>
                                            <td className="text-right">{this.state.filteredCoursesData[index]["category"]}</td>
                                          </tr>
                                          <tr>
                                            <td className="w20">
                                              <i className="fa fa-university text-blue"></i>
                                            </td>
                                            <td className="tx-medium">University</td>
                                            <td className="text-right">{this.state.filteredCoursesData[index]["university"]}</td>
                                          </tr>
                                          <tr>
                                            <td className="w20">
                                              <i className="fa fa-desktop text-blue"></i>
                                            </td>
                                            <td className="tx-medium">Type</td>
                                            <td className="text-right">{this.state.filteredCoursesData[index]["course_type"]}</td>
                                          </tr>
                                          <tr>
                                            <td className="w20">
                                              <i className="fa fa-calendar text-blue"></i>
                                            </td>
                                            <td className="tx-medium">Duration</td>
                                            <td className="text-right">{this.state.filteredCoursesData[index]["time_duration"]} Hrs</td>
                                          </tr>
                                          <tr>
                                            <td>
                                              <i className="fa fa-cc-visa text-danger"></i>
                                            </td>
                                            <td className="tx-medium">Fees</td>
                                            <td className="text-right">{this.state.filteredCoursesData[index]["price"]}</td>
                                          </tr>
                                          <tr>
                                            <td>
                                              <i className="fa fa-users text-warning"></i>
                                            </td>
                                            <td className="tx-medium">Students</td>
                                            <td className="text-right">{this.state.filteredCoursesData[index]["students"].length}</td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                    <div className="card-footer">
                                    </div>
                                  </>
                                }
                              </div>
                            </div>

                          }
                        </>
                      )

                    }
                  </div>
                }
              </TabPane>
              <TabPane tabId={3} className={classnames(["fade show"])}>
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Add Course</h3>
                  </div>
                  <form className="card-body" id="addCourseForm">
                    <div className="form-group row">
                      <label className="col-md-3 col-form-label">
                        Course Name {/* <span className="text-danger">*</span> */}
                      </label>
                      <div className="col-md-7">
                        <input type="text" className="form-control" id="form_courseName" />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-md-3 col-form-label">Trainer</label>
                      <div className="col-md-7">
                        <select
                          className="form-control input-height"
                          name="department"
                          id="form_courseTrainer"
                          defaultValue=""
                        >
                          <option disabled value="">Select Trainer</option>
                          {
                            this.state.trainerDataFetched ?

                              this.state.trainerData.map((data, id) => {
                                return (
                                  <option value={data} key={data + [id + 120]}>{data}</option>
                                )
                              })
                              :
                              null
                          }
                        </select>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-md-3 col-form-label">
                        Competency
                      </label>
                      <div className="col-md-7">
                        <select
                          className="form-control input-height"
                          name="department"
                          id="form_courseCompetency"
                          defaultValue=""
                        >
                          <option value="" disabled>Select Competency</option>
                          {
                            this.state.competenciesFetched ?

                              Object.entries(this.state.competencies).map((item, i) => {
                                return (
                                  <option value={item[1]['competency_name']} key={item[1]['competency_name'] + i}>{item[1]['competency_name']}</option>
                                )
                              })
                              :
                              null
                          }
                        </select>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-md-3 col-form-label">
                        Description
                      </label>
                      <div className="col-md-7">
                        <input type="textarea" className="form-control" id="form_courseDescription" />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-md-3 col-form-label">
                        YouTube Link
                      </label>
                      <div className="col-md-7">
                        <input type="text" className="form-control" id="form_courseYoutubeLink" />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-md-3 col-form-label">
                        About this course
                      </label>
                      <div className="col-md-7">
                        <input type="textarea" className="form-control" id="form_courseAboutThisCourse" />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-md-3 col-form-label">
                        Who this course is for
                      </label>
                      <div className="col-md-7">
                        <input type="textarea" className="form-control" id="form_courseWhoThisCourseIsFor" />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-md-3 col-form-label">
                        Requirements
                      </label>
                      <div className="col-md-7">
                        <input type="textarea" className="form-control" id="form_courseRequirements" />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-md-3 col-form-label">
                        Why to learn
                      </label>
                      <div className="col-md-7">
                        <input type="textarea" className="form-control" id="form_courseWhyToLearn" />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-md-3 col-form-label">
                        Skills you learn
                      </label>
                      <div className="col-md-7">
                        <input type="textarea" className="form-control" id="form_courseSkillsYouLearn" />
                      </div>
                    </div>



                    <div className="form-group row">
                      <label className="col-md-3 col-form-label">
                        Course Category
                      </label>
                      <div className="col-md-7">
                        <select
                          className="form-control input-height"
                          id="form_courseCategory"
                          defaultValue=""
                        >
                          <option value="" disabled>Select Category</option>
                          {
                            this.state.categoryDataFetched ?

                              Object.entries(this.state.categoryData).map((item, i) => {
                                return (
                                  <option value={item[1]['category_name']} key={item[1]['category_name'] + i}>{item[1]['category_name']}</option>
                                )
                              })
                              :
                              null
                          }
                        </select>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-md-3 col-form-label">
                        Course Paid?
                      </label>
                      <div className="col-md-7">
                        <select
                          className="form-control input-height"
                          id="form_coursePaid"
                          defaultValue=""
                        >
                          <option value="" disabled>Select</option>
                          <option value={true} >Paid</option>
                          <option value={false} >Unpaid</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-md-3 col-form-label">
                        Course Featured?
                      </label>
                      <div className="col-md-7">
                        <select
                          className="form-control input-height"
                          id="form_courseFeatured"
                          defaultValue=""
                        >
                          <option value="" disabled>Select</option>
                          <option value={true} >Featured</option>
                          <option value={false} >Not Featured</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-md-3 col-form-label">
                        University Name
                      </label>
                      <div className="col-md-7">
                        <select
                          className="form-control input-height"
                          name="department"
                          id="form_courseUniversity"
                          defaultValue=""
                        >
                          <option disabled value="">Select University</option>
                          {
                            this.state.UniversityNamesFetched ?

                              this.state.UniversityNames.map((data, i) => {
                                return (
                                  <option value={data} key={data + [i + 1121]}>{data}</option>
                                )
                              })
                              :
                              null
                          }
                        </select>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-md-3 col-form-label">
                        Course Type
                      </label>
                      <div className="col-md-7">
                        <select
                          className="form-control input-height"
                          name="department"
                          id="form_courseType"
                        >
                          <option value="Category 1">Online</option>
                          <option value="Category 2">Blended</option>
                          <option value="Category 3">Classroom</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-md-3 col-form-label">
                        Course Private
                      </label>
                      <div className="col-md-7">
                        <select
                          className="form-control input-height"
                          id="form_coursePrivate"
                        >
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-md-3 col-form-label">
                        Course Image
                      </label>
                      <div className="col-md-7">
                        <input type="file" name="" id="form_CourseImage" />
                        <small id="fileHelp" className="form-text text-muted">
                          Please upload image here
                        </small>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-md-3 col-form-label">
                        Course Schedule
                      </label>
                      <div className="col-md-7">
                        <div className="col-md-12 row">
                          <label className="col-md-2 col-form-label tar">
                            Start Date
                            </label>
                          <div className="col-md-4">
                            <input type="date" className="form-control" id="form_courseStartDate" />
                          </div>
                          <label className="col-md-2 col-form-label tar">
                            End Date
                            </label>
                          <div className="col-md-4">
                            <input type="date" className="form-control" id="form_courseEndDate" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-md-3 col-form-label">
                        Course Duration (Months)
                      </label>
                      <div className="col-md-7">
                        <input type="number" className="form-control" id="form_courseDuration" />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-md-3 col-form-label">
                        Course Price
                      </label>
                      <div className="col-md-7">
                        <input type="number" className="form-control" id="form_coursePrice" />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-md-3 col-form-label">
                        Number of Modules
                      </label>
                      <div className="col-md-7">
                        <input type="text" value={this.state.moduleValue} onChange={(event) => ModuleInputHandler(event)} className="form-control" id="form_courseNOM" />
                      </div>
                    </div>

                    {
                      this.state.showModules ?

                        this.state.moduleHtml.map((data, id) => (
                          data.map((modules, id) => {
                            return (
                              <div className="card" key={data + [id + 212]}>
                                <div className="card-header">
                                  <h3 className="card-title">{modules}</h3>
                                </div>
                                <div className="card-body">
                                  <div className="form-group row">
                                    <label className="col-md-3 col-form-label">
                                      Name
                                  </label>
                                    <div className="col-md-7">
                                      <input type="textarea" className="form-control" id={"form_CourseModuleName" + id} />
                                    </div>
                                  </div>


                                  <div className="form-group row">
                                    <label className="col-md-3 col-form-label">
                                      Date
                                  </label>
                                    <div className="col-md-7">
                                      <input type="date" className="form-control" id={"form_CourseModuleDate" + id} />
                                    </div>
                                  </div>



                                  <div className="form-group row">
                                    <label className="col-md-3 col-form-label">
                                      Time Limit
                                  </label>
                                    <div className="col-md-7">
                                      <input type="text" className="form-control" id={"form_CourseModuleTimeLimit" + id} />
                                    </div>
                                  </div>

                                  <div className="form-group row">
                                    <label className="col-md-3 col-form-label">
                                      Reminder
                                  </label>
                                    <div className="col-md-7">
                                      <input type="Date" className="form-control" id={"form_CourseModuleReminder" + id} />
                                    </div>
                                  </div>


                                    <div className="form-group row">
                                      <label className="col-md-3 col-form-label">
                                      Resource Link 1
                                      </label>
                                      <div className="col-md-7">
                                        <input type="text" name=""
                                        className="form-control" id={"form_CourseModuleResource1" + id} />
                                      </div>
                                    </div>

                                    <div className="form-group row">
                                      <label className="col-md-3 col-form-label">
                                        Resource Link 2
                                    </label>
                                      <div className="col-md-7">
                                        <input type="text" className="form-control" id={"form_CourseModuleResource2" + id} />
                                      </div>
                                    </div>

                                    <div className="form-group row">
                                      <label className="col-md-3 col-form-label">
                                        Resource Link 3
                                    </label>
                                      <div className="col-md-7">
                                        <input type="text" className="form-control" id={"form_CourseModuleResource3" + id} />
                                      </div>
                                    </div>


                                </div>
                              </div>
                            )
                          })

                        ))


                        : null


                    }

                    <div className="form-group row">
                      <label className="col-md-3 col-form-label"></label>
                      <div className="col-md-7">
                        <button type="button" id="addCourseSubmitBtn" onClick={addCourseSubmit} className="mr-1 btn btn-primary">
                          Submit
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </TabPane>
             
             {this.state.currentUser=="Admin"?
              <TabPane tabId={101} className={classnames(["fade show"])}>
                <div className="row row-deck">
                  {
                    Object.keys(this.state.filteredCoursesData).map((key, index) =>
                      <>
                        {
                          this.state.filteredCoursesData[index]["course_paid"]
                          &&
                          !TDate(this.state.filteredCoursesData[index]["end_date"])
                          &&
                          <div className="col-xl-4 col-lg-4 col-md-6" key={this.state.filteredCoursesData[index]["_id"] + [index + 212221]}>
                            <div className="card">
                              {/* <div className="CardImgTopCustom">
                                <img src={this.state.filteredCoursesData[index]["course_image"]} alt="" srcSet="" />
                              </div> */}
                              <div className="card-body d-flex flex-column">
                                <div className="row">
                                  <div className="col-md-10">
                                    <h5 style={{ display: 'inline-block' }}>
                                      <Link to={{ pathname: "/courseDetails", state: this.state.filteredCoursesData[index] }} style={{ color: '#2185d0' }}>
                                        {this.state.filteredCoursesData[index]["course_name"]}
                                      </Link>
                                    </h5>
                                  </div>
                                  <div className="col-md-2" style={{ textAlign: 'right' }}>
                                    <button
                                      onClick={() => onEditClicked(this.state.filteredCoursesData[index]["_id"])}
                                      type="button"
                                      className="btn btn-icon btn-sm js-sweetalert"
                                      title="Edit"
                                      data-type="confirm"
                                    >
                                      <i className="fa fa-edit" style={{ fontSize: '16px', color: 'rgba(0,0,0)' }}></i>
                                    </button>
                                    <button
                                      onClick={() => onDeleteClicked(this.state.filteredCoursesData[index]["_id"])}
                                      type="button"
                                      className="btn btn-icon btn-sm js-sweetalert"
                                      title="Delete"
                                      data-type="confirm"
                                    >
                                      <i className="fa fa-trash-o text-danger" style={{ fontSize: '16px' }}></i>
                                    </button>
                                  </div>
                                </div>
                                <div className="text-muted">
                                  {this.state.filteredCoursesData[index]["description"]}
                                </div>
                              </div>

                              {this.state.currentUser === 'Admin' ? null :


                                <>

                                  <div className="table-responsive">
                                    <table className="table table-striped table-vcenter mb-0">
                                      <tbody>
                                        <tr>
                                          <td className="w20">
                                            <i className="fa fa-list text-blue"></i>
                                          </td>
                                          <td className="tx-medium">Category</td>
                                          <td className="text-right">{this.state.filteredCoursesData[index]["category"]}</td>
                                        </tr>
                                        <tr>
                                          <td className="w20">
                                            <i className="fa fa-university text-blue"></i>
                                          </td>
                                          <td className="tx-medium">University</td>
                                          <td className="text-right">{this.state.filteredCoursesData[index]["university"]}</td>
                                        </tr>
                                        <tr>
                                          <td className="w20">
                                            <i className="fa fa-desktop text-blue"></i>
                                          </td>
                                          <td className="tx-medium">Type</td>
                                          <td className="text-right">{this.state.filteredCoursesData[index]["course_type"]}</td>
                                        </tr>
                                        <tr>
                                          <td className="w20">
                                            <i className="fa fa-calendar text-blue"></i>
                                          </td>
                                          <td className="tx-medium">Duration</td>
                                          <td className="text-right">{this.state.filteredCoursesData[index]["time_duration"]} Hrs</td>
                                        </tr>
                                        <tr>
                                          <td>
                                            <i className="fa fa-cc-visa text-danger"></i>
                                          </td>
                                          <td className="tx-medium">Fees</td>
                                          <td className="text-right">{this.state.filteredCoursesData[index]["price"]}</td>
                                        </tr>
                                        <tr>
                                          <td>
                                            <i className="fa fa-users text-warning"></i>
                                          </td>
                                          <td className="tx-medium">Students</td>
                                          <td className="text-right">{this.state.filteredCoursesData[index]["students"].length}</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                  <div className="card-footer">

                                  </div>
                                </>
                              }
                            </div>
                          </div>


                        }
                      </>
                    )

                  }
                </div>

              </TabPane>
              :""}
              
              {this.state.currentUser=="Admin"?
              <TabPane tabId={102} className={classnames(["fade show"])}>
                <div className="row row-deck">
                  {
                    Object.keys(this.state.filteredCoursesData).map((key, index) =>
                      <>
                        {
                          !this.state.filteredCoursesData[index]["course_paid"] 
                          &&
                          !TDate(this.state.filteredCoursesData[index]["end_date"])
                          &&
                          <div className="col-xl-4 col-lg-4 col-md-6" key={this.state.filteredCoursesData[index]["_id"] + [index + 4332]}>
                            <div className="card">
                              {/* <div className="CardImgTopCustom">
                                <img src={this.state.filteredCoursesData[index]["course_image"]} alt="" srcSet="" />
                              </div> */}
                              <div className="card-body d-flex flex-column">
                                <div className="row">
                                  <div className="col-md-10">
                                    <h5 style={{ display: 'inline-block' }}>
                                      <Link to={{ pathname: "/courseDetails", state: this.state.filteredCoursesData[index] }} style={{ color: '#2185d0' }}>
                                        {this.state.filteredCoursesData[index]["course_name"]}
                                      </Link>
                                    </h5>
                                  </div>
                                  <div className="col-md-2" style={{ textAlign: 'right' }}>
                                    <button
                                      onClick={() => onEditClicked(this.state.filteredCoursesData[index]["_id"])}
                                      type="button"
                                      className="btn btn-icon btn-sm js-sweetalert"
                                      title="Edit"
                                      data-type="confirm"
                                    >
                                      <i className="fa fa-edit" style={{ fontSize: '16px', color: 'rgba(0,0,0)' }}></i>
                                    </button>
                                    <button
                                      onClick={() => onDeleteClicked(this.state.filteredCoursesData[index]["_id"])}
                                      type="button"
                                      className="btn btn-icon btn-sm js-sweetalert"
                                      title="Delete"
                                      data-type="confirm"
                                    >
                                      <i className="fa fa-trash-o text-danger" style={{ fontSize: '16px' }}></i>
                                    </button>
                                  </div>
                                </div>
                                <div className="text-muted">
                                  {this.state.filteredCoursesData[index]["description"]}
                                </div>
                              </div>

                              {this.state.currentUser === 'Admin' ? null :


                                <>

                                  <div className="table-responsive">
                                    <table className="table table-striped table-vcenter mb-0">
                                      <tbody>
                                        <tr>
                                          <td className="w20">
                                            <i className="fa fa-list text-blue"></i>
                                          </td>
                                          <td className="tx-medium">Category</td>
                                          <td className="text-right">{this.state.filteredCoursesData[index]["category"]}</td>
                                        </tr>
                                        <tr>
                                          <td className="w20">
                                            <i className="fa fa-university text-blue"></i>
                                          </td>
                                          <td className="tx-medium">University</td>
                                          <td className="text-right">{this.state.filteredCoursesData[index]["university"]}</td>
                                        </tr>
                                        <tr>
                                          <td className="w20">
                                            <i className="fa fa-desktop text-blue"></i>
                                          </td>
                                          <td className="tx-medium">Type</td>
                                          <td className="text-right">{this.state.filteredCoursesData[index]["course_type"]}</td>
                                        </tr>
                                        <tr>
                                          <td className="w20">
                                            <i className="fa fa-calendar text-blue"></i>
                                          </td>
                                          <td className="tx-medium">Duration</td>
                                          <td className="text-right">{this.state.filteredCoursesData[index]["time_duration"]} Hrs</td>
                                        </tr>
                                        <tr>
                                          <td>
                                            <i className="fa fa-cc-visa text-danger"></i>
                                          </td>
                                          <td className="tx-medium">Fees</td>
                                          <td className="text-right">{this.state.filteredCoursesData[index]["price"]}</td>
                                        </tr>
                                        <tr>
                                          <td>
                                            <i className="fa fa-users text-warning"></i>
                                          </td>
                                          <td className="tx-medium">Students</td>
                                          <td className="text-right">{this.state.filteredCoursesData[index]["students"].length}</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                  <div className="card-footer">

                                  </div>
                                </>
                              }
                            </div>
                          </div>


                        }
                      </>
                    )

                  }
                </div>

              </TabPane>
              :""}
              
              
              {this.state.currentUser=="Trainer"?
              
              <>
              {/*paid courses-trainer module */}
              <TabPane tabId={101} className={classnames(["fade show"])}>
                <div className="row row-deck">
                  {
                    Object.keys(this.state.trainersPaidCourses).map((key, index) =>
                      <>
                        {
                          <div className="col-xl-4 col-lg-4 col-md-6" key={this.state.trainersPaidCourses[index]["_id"] + [index + 212221]}>
                            <div className="card">
                              {/* <div className="CardImgTopCustom">
                                <img src={this.state.trainersPaidCourses[index]["course_image"]} alt="" srcSet="" />
                              </div> */}
                              <div className="card-body d-flex flex-column">
                                <div className="row">
                                  <div className="col-md-10">
                                    <h5 style={{ display: 'inline-block' }}>
                                      <Link to={{ pathname: "/courseDetails", state: this.state.trainersPaidCourses[index] }} style={{ color: '#2185d0' }}>
                                        {this.state.trainersPaidCourses[index]["course_name"]}
                                      </Link>
                                    </h5>
                                  </div>
                                  <div className="col-md-2" style={{ textAlign: 'right' }}>
                                    <button
                                      onClick={() => onEditClicked(this.state.trainersPaidCourses[index]["_id"])}
                                      type="button"
                                      className="btn btn-icon btn-sm js-sweetalert"
                                      title="Edit"
                                      data-type="confirm"
                                    >
                                      <i className="fa fa-edit" style={{ fontSize: '16px', color: 'rgba(0,0,0)' }}></i>
                                    </button>
                                    <button
                                      onClick={() => onDeleteClicked(this.state.trainersPaidCourses[index]["_id"])}
                                      type="button"
                                      className="btn btn-icon btn-sm js-sweetalert"
                                      title="Delete"
                                      data-type="confirm"
                                    >
                                      <i className="fa fa-trash-o text-danger" style={{ fontSize: '16px' }}></i>
                                    </button>
                                  </div>
                                </div>
                                <div className="text-muted">
                                  {this.state.trainersPaidCourses[index]["description"]}
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
                                          <td className="text-right">{this.state.trainersPaidCourses[index]["category"]}</td>
                                        </tr>
                                        <tr>
                                          <td className="w20">
                                            <i className="fa fa-university text-blue"></i>
                                          </td>
                                          <td className="tx-medium">University</td>
                                          <td className="text-right">{this.state.trainersPaidCourses[index]["university"]}</td>
                                        </tr>
                                        <tr>
                                          <td className="w20">
                                            <i className="fa fa-desktop text-blue"></i>
                                          </td>
                                          <td className="tx-medium">Type</td>
                                          <td className="text-right">{this.state.trainersPaidCourses[index]["course_type"]}</td>
                                        </tr>
                                        <tr>
                                          <td className="w20">
                                            <i className="fa fa-calendar text-blue"></i>
                                          </td>
                                          <td className="tx-medium">Duration</td>
                                          <td className="text-right">{this.state.trainersPaidCourses[index]["time_duration"]} Hrs</td>
                                        </tr>
                                        <tr>
                                          <td>
                                            <i className="fa fa-cc-visa text-danger"></i>
                                          </td>
                                          <td className="tx-medium">Fees</td>
                                          <td className="text-right">{this.state.trainersPaidCourses[index]["price"]}</td>
                                        </tr>
                                        <tr>
                                          <td>
                                            <i className="fa fa-users text-warning"></i>
                                          </td>
                                          <td className="tx-medium" onClick={()=>{
                                            getStudentFilteredData(this.state.trainersPaidCourses[index]["students"])
                                            this.setState({activeTab:10})
                                          }}>Students</td>
                                          <td className="text-right">{this.state.trainersPaidCourses[index]["students"].length}</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                  <div className="card-footer">

                                  </div>
                            </div>
                          </div>


                        }
                      </>
                    )

                  }
                </div>

              </TabPane>
              {/* unpaid  courses-trainer module*/ }
                <TabPane tabId={102} className={classnames(["fade show"])}>
                <div className="row row-deck">
                  {
                    Object.keys(this.state.trainersUnpaidCourses).map((key, index) =>
                      <>
                        {
                          <div className="col-xl-4 col-lg-4 col-md-6" key={this.state.trainersUnpaidCourses[index]["_id"] + [index + 212221]}>
                            <div className="card">
                              {/* <div className="CardImgTopCustom">
                                <img src={this.state.trainersUnpaidCourses[index]["course_image"]} alt="" srcSet="" />
                              </div> */}
                              <div className="card-body d-flex flex-column">
                                <div className="row">
                                  <div className="col-md-10">
                                    <h5 style={{ display: 'inline-block' }}>
                                      <Link to={{ pathname: "/courseDetails", state: this.state.trainersUnpaidCourses[index] }} style={{ color: '#2185d0' }}>
                                        {this.state.trainersUnpaidCourses[index]["course_name"]}
                                      </Link>
                                    </h5>
                                  </div>
                                  <div className="col-md-2" style={{ textAlign: 'right' }}>
                                    <button
                                      onClick={() => onEditClicked(this.state.trainersUnpaidCourses[index]["_id"])}
                                      type="button"
                                      className="btn btn-icon btn-sm js-sweetalert"
                                      title="Edit"
                                      data-type="confirm"
                                    >
                                      <i className="fa fa-edit" style={{ fontSize: '16px', color: 'rgba(0,0,0)' }}></i>
                                    </button>
                                    <button
                                      onClick={() => onDeleteClicked(this.state.trainersUnpaidCourses[index]["_id"])}
                                      type="button"
                                      className="btn btn-icon btn-sm js-sweetalert"
                                      title="Delete"
                                      data-type="confirm"
                                    >
                                      <i className="fa fa-trash-o text-danger" style={{ fontSize: '16px' }}></i>
                                    </button>
                                  </div>
                                </div>
                                <div className="text-muted">
                                  {this.state.trainersUnpaidCourses[index]["description"]}
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
                                          <td className="text-right">{this.state.trainersUnpaidCourses[index]["category"]}</td>
                                        </tr>
                                        <tr>
                                          <td className="w20">
                                            <i className="fa fa-university text-blue"></i>
                                          </td>
                                          <td className="tx-medium">University</td>
                                          <td className="text-right">{this.state.trainersUnpaidCourses[index]["university"]}</td>
                                        </tr>
                                        <tr>
                                          <td className="w20">
                                            <i className="fa fa-desktop text-blue"></i>
                                          </td>
                                          <td className="tx-medium">Type</td>
                                          <td className="text-right">{this.state.trainersUnpaidCourses[index]["course_type"]}</td>
                                        </tr>
                                        <tr>
                                          <td className="w20">
                                            <i className="fa fa-calendar text-blue"></i>
                                          </td>
                                          <td className="tx-medium">Duration</td>
                                          <td className="text-right">{this.state.trainersUnpaidCourses[index]["time_duration"]} Hrs</td>
                                        </tr>
                                        <tr>
                                          <td>
                                            <i className="fa fa-cc-visa text-danger"></i>
                                          </td>
                                          <td className="tx-medium">Fees</td>
                                          <td className="text-right">{this.state.trainersUnpaidCourses[index]["price"]}</td>
                                        </tr>
                                        <tr>
                                          <td>
                                            <i className="fa fa-users text-warning"></i>
                                          </td>
                                          <td className="tx-medium" onClick={()=>{
                                        getStudentFilteredData(this.state.trainersUnpaidCourses[index]["students"])
                                        this.setState({activeTab:10})
                                        }}>Students</td>
                                          <td className="text-right">{this.state.trainersUnpaidCourses[index]["students"].length}</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                  <div className="card-footer">

                                  </div>
                            </div>
                          </div>


                        }
                      </>
                    )

                  }
                </div>

              </TabPane>

              {/* completed courses-trainer*/}

              <TabPane tabId={1} className={classnames(["fade show"])}>
                <div className="row row-deck">
                  {
                    Object.keys(this.state.trainersCompletedCourses).map((key, index) =>
                      <>
                        {
                          <div className="col-xl-4 col-lg-4 col-md-6" key={this.state.trainersCompletedCourses[index]["_id"] + [index + 212221]}>
                            <div className="card">
                              {/* <div className="CardImgTopCustom">
                                <img src={this.state.trainersUnpaidCourses[index]["course_image"]} alt="" srcSet="" />
                              </div> */}
                              <div className="card-body d-flex flex-column">
                                <div className="row">
                                  <div className="col-md-10">
                                    <h5 style={{ display: 'inline-block' }}>
                                      <Link to={{ pathname: "/courseDetails", state: this.state.trainersCompletedCourses[index] }} style={{ color: '#2185d0' }}>
                                        {this.state.trainersCompletedCourses[index]["course_name"]}
                                      </Link>
                                    </h5>
                                  </div>
                                  <div className="col-md-2" style={{ textAlign: 'right' }}>
                                    <button
                                      onClick={() => onEditClicked(this.state.trainersCompletedCourses[index]["_id"])}
                                      type="button"
                                      className="btn btn-icon btn-sm js-sweetalert"
                                      title="Edit"
                                      data-type="confirm"
                                    >
                                      <i className="fa fa-edit" style={{ fontSize: '16px', color: 'rgba(0,0,0)' }}></i>
                                    </button>
                                    <button
                                      onClick={() => onDeleteClicked(this.state.trainersCompletedCourses[index]["_id"])}
                                      type="button"
                                      className="btn btn-icon btn-sm js-sweetalert"
                                      title="Delete"
                                      data-type="confirm"
                                    >
                                      <i className="fa fa-trash-o text-danger" style={{ fontSize: '16px' }}></i>
                                    </button>
                                  </div>
                                </div>
                                <div className="text-muted">
                                  {this.state.trainersCompletedCourses[index]["description"]}
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
                                          <td className="text-right">{this.state.trainersCompletedCourses[index]["category"]}</td>
                                        </tr>
                                        <tr>
                                          <td className="w20">
                                            <i className="fa fa-university text-blue"></i>
                                          </td>
                                          <td className="tx-medium">University</td>
                                          <td className="text-right">{this.state.trainersCompletedCourses[index]["university"]}</td>
                                        </tr>
                                        <tr>
                                          <td className="w20">
                                            <i className="fa fa-desktop text-blue"></i>
                                          </td>
                                          <td className="tx-medium">Type</td>
                                          <td className="text-right">{this.state.trainersCompletedCourses[index]["course_type"]}</td>
                                        </tr>
                                        <tr>
                                          <td className="w20">
                                            <i className="fa fa-calendar text-blue"></i>
                                          </td>
                                          <td className="tx-medium">Duration</td>
                                          <td className="text-right">{this.state.trainersCompletedCourses[index]["time_duration"]} Hrs</td>
                                        </tr>
                                        <tr>
                                          <td>
                                            <i className="fa fa-cc-visa text-danger"></i>
                                          </td>
                                          <td className="tx-medium">Fees</td>
                                          <td className="text-right">{this.state.trainersCompletedCourses[index]["price"]}</td>
                                        </tr>
                                        <tr>
                                          <td>
                                            <i className="fa fa-users text-warning"></i>
                                          </td>
                                          <td className="tx-medium" onClick={()=>{
                                            console.log("index:",this.state.trainersCompletedCourses[index]);
                                            getStudentFilteredData(this.state.trainersCompletedCourses[index]["students"])
                          
                                            this.setState({activeTab:10})
                                            }}>Students</td>
                                          <td className="text-right">{this.state.trainersCompletedCourses[index]["students"].length}</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                  <div className="card-footer">

                                  </div>
                            </div>
                          </div>


                        }
                      </>
                    )

                  }
                </div>

              </TabPane>

               {/*To show details of students enrolled in a course to the trainer and admin*/}
              <TabPane tabId={10} className={classnames(["fade show"])}>
                    <>
                    <h4>Students</h4>
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
                    </>
              </TabPane>

              </>
              :""}

              {
                this.state.currentUser === 'Student' &&
                <TabPane tabId={201} className={classnames(["fade show"])}>
                  {
                    this.state.currentUser === 'Student' &&

                    <div className="row row-deck">
                      {
                        Object.keys(this.state.enrolledCourses).map((key, index) =>
                          <>
                            {
                              //!TDate(this.state.enrolledCourses[index]["end_date"]) && this.state.enrolledCourses.includes(this.state.enrolledCourses[index]["_id"])
                             // &&
                              <div className="col-xl-4 col-lg-4 col-md-6" key={this.state.enrolledCourses[index]["_id"] + [index + 9855]}>
                                <div className="card">
                                  {/* <div className="CardImgTopCustom">
                                    <img src={this.state.filteredCoursesData[index]["course_image"]} alt="" srcSet="" />
                                  </div> */}
                                  <div className="card-body d-flex flex-column">
                                    <h5>
                                      <Link to={{ pathname: "/courseDetails", state: this.state.enrolledCourses[index] }} style={{ color: '#2185d0' }}>
                                        {this.state.enrolledCourses[index]["course_name"]}
                                      </Link>
                                    </h5>
                                    <div className="text-muted">
                                      {this.state.enrolledCourses[index]["description"]}
                                    </div>
                                  </div>

                                  {this.state.currentUser === 'Admin' ? null :


                                    <>

                                      <div className="table-responsive">
                                        <table className="table table-striped table-vcenter mb-0">
                                          <tbody>
                                            <tr>
                                              <td className="w20">
                                                <i className="fa fa-list text-blue"></i>
                                              </td>
                                              <td className="tx-medium">Category</td>
                                              <td className="text-right">{this.state.filteredCoursesData[index]["category"]}</td>
                                            </tr>
                                            <tr>
                                              <td className="w20">
                                                <i className="fa fa-university text-blue"></i>
                                              </td>
                                              <td className="tx-medium">University</td>
                                              <td className="text-right">{this.state.filteredCoursesData[index]["university"]}</td>
                                            </tr>
                                            <tr>
                                              <td className="w20">
                                                <i className="fa fa-desktop text-blue"></i>
                                              </td>
                                              <td className="tx-medium">Type</td>
                                              <td className="text-right">{this.state.filteredCoursesData[index]["course_type"]}</td>
                                            </tr>
                                            <tr>
                                              <td className="w20">
                                                <i className="fa fa-calendar text-blue"></i>
                                              </td>
                                              <td className="tx-medium">Duration</td>
                                              <td className="text-right">{this.state.filteredCoursesData[index]["time_duration"]} Hrs</td>
                                            </tr>
                                            <tr>
                                              <td>
                                                <i className="fa fa-cc-visa text-danger"></i>
                                              </td>
                                              <td className="tx-medium">Fees</td>
                                              <td className="text-right">{this.state.filteredCoursesData[index]["price"]}</td>
                                            </tr>
                                            <tr>
                                              <td>
                                                <i className="fa fa-users text-warning"></i>
                                              </td>
                                              <td className="tx-medium">Students</td>
                                              <td className="text-right">{this.state.filteredCoursesData[index]["students"].length}</td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                      <div className="card-footer">
                                      </div>
                                    </>
                                  }
                                </div>
                              </div>

                            }
                          </>
                        )

                      }
                    </div>
                  }
                </TabPane>
              }


              {/* edit a course page*/}

              <TabPane tabId={301} className={classnames(["fade show"])}>

                {
                  this.state.currentEditCourseInfoFetched ?

                    <form id="editCourseForm" className="dc">

                      <div className="row clearfix">
                        <div className="section-body mt-4">
                          <div className="card">
                            <div className="card-header">
                              <h3 className="card-title">Edit course</h3>
                            </div>
                            <div className="card-body">
                              <div className="row clearfix">
                                <div className="col-md-6 col-sm-12">
                                  <div className="form-group">
                                    <label>Course Name</label>
                                    <input type="text" readOnly className="form-control" id="edit_form_courseName" defaultValue={this.state.currentEditCourseInfo['course_name']} />
                                  </div>
                                </div>
                                <div className="col-md-6 col-sm-12">
                                  <div className="form-group">
                                    <label>Description</label>
                                    <input type="text" className="form-control" id="edit_form_description" defaultValue={this.state.currentEditCourseInfo['description']} />
                                  </div>
                                </div>

                                <div className="col-md-6 col-sm-12">
                                  <div className="form-group">
                                    <label>About this course</label>
                                    <input type="text" className="form-control" id="edit_form_about" defaultValue={this.state.currentEditCourseInfo['about_this_course']} />
                                  </div>
                                </div>

                                <div className="col-md-6 col-sm-12">
                                  <div className="form-group">
                                    <label>Who this course is for</label>
                                    <input type="text" className="form-control" id="edit_form_whoisthiscoursefor" defaultValue={this.state.currentEditCourseInfo['who_this_course_is_for']} />
                                  </div>
                                </div>


                                <div className="col-md-6 col-sm-12">
                                  <div className="form-group">
                                    <label>Requirements</label>
                                    <input type="text" className="form-control" id="edit_form_requirements" defaultValue={this.state.currentEditCourseInfo['requirements']} />
                                  </div>
                                </div>

                                <div className="col-md-6 col-sm-12">
                                  <div className="form-group">
                                    <label>Why to learn</label>
                                    <input type="text" className="form-control" id="edit_form_whytolearn" defaultValue={this.state.currentEditCourseInfo['why_to_learn']} />
                                  </div>
                                </div>

                                <div className="col-md-6 col-sm-12">
                                  <div className="form-group">
                                    <label>Skills you learn</label>
                                    <input type="text" className="form-control" id="edit_form_skillsyoulearn" defaultValue={this.state.currentEditCourseInfo['skills_you_learn']} />
                                  </div>
                                </div>

                                <div className="col-md-6 col-sm-12">
                                  <div className="form-group">
                                    <label>Trainer</label>
                                    < select className="form-control input-height"
                                      name="department"
                                      id="edit_form_courseTrainer"
                                      defaultValue={this.state.currentEditCourseInfo['trainer']}
                                    >
                                      <option disabled value="">Select Trainer</option>
                                      {
                                        this.state.trainerDataFetched ?

                                          this.state.trainerData.map((data, id) => {
                                            return (
                                              <option value={data} key={data + id}>{data}</option>
                                            )
                                          })
                                          :
                                          null
                                      }
                                    </select>
                                  </div>
                                </div>

                                <div className="col-md-6 col-sm-12">
                                  <label className="col-md-6 col-form-label">
                                    Course Category
                                  </label>
                                  <div className="form-group">
                                    <select
                                      className="form-control input-height"
                                      id="edit_form_courseCategory"
                                      defaultValue={this.state.currentEditCourseInfo['category']}
                                    >
                                      <option value="" disabled>Select Category</option>
                                      {
                                        this.state.categoryDataFetched ?

                                          Object.entries(this.state.categoryData).map((item, i) => {
                                            return (
                                              <option value={item[1]['category_name']} key={item[1]['category_name'] + [i + 453]}>{item[1]['category_name']}</option>
                                            )
                                          })
                                          :
                                          null
                                      }
                                    </select>
                                  </div>
                                </div>



                                <div className="col-md-6 col-sm-12">
                                  <label className="col-md-3 col-form-label">
                                    Competency
                              </label>
                                  <div className="form-group">
                                    <select
                                      className="form-control input-height"
                                      name="department"
                                      id="edit_form_courseCompetency"
                                      defaultValue={this.state.currentEditCourseInfo['competency']}
                                    >
                                      <option value="" disabled>Select Competency</option>
                                      {
                                        this.state.competenciesFetched ?

                                          Object.entries(this.state.competencies).map((item, i) => {
                                            return (
                                              <option value={item[1]['competency_name']} key={item[1]['competency_name'] + [i + 3422]}>{item[1]['competency_name']}</option>
                                            )
                                          })
                                          :
                                          null
                                      }
                                    </select>
                                  </div>
                                </div>



                                <div className="col-md-6 col-sm-12">
                                  <div className="form-group">
                                    <label>Private</label>
                                    <select className="form-control show-tick" id="edit_form_privacy" defaultValue={this.state.currentEditCourseInfo['is_private']}>
                                      <option disabled value="">Select Privacy</option>
                                      <option value={true} >true</option>
                                      <option value={false} >false</option>
                                    </select>
                                  </div>
                                </div>


                                <div className="col-md-6 col-sm-12">
                                  <div className="form-group">
                                    <label>Featured</label>
                                    <select className="form-control show-tick" id="edit_form_featured" defaultValue={this.state.currentEditCourseInfo['course_featured']}>
                                      <option disabled value="">Select </option>
                                      <option value={true} >true</option>
                                      <option value={false} >false</option>
                                    </select>
                                  </div>
                                </div>


                                <div className="col-md-6 col-sm-12">
                                  <div className="form-group">
                                    <label>Paid</label>
                                    <select className="form-control show-tick" id="edit_form_paid" defaultValue={this.state.currentEditCourseInfo['course_paid']}>
                                      <option disabled value="">Select </option>
                                      <option value={true} >true</option>
                                      <option value={false} >false</option>
                                    </select>
                                  </div>
                                </div>


                                <div className="col-md-6 col-sm-12">
                                  <div className="form-group">
                                    <label>Price</label>
                                    <input type="text" className="form-control" id="edit_form_price" defaultValue={this.state.currentEditCourseInfo['price']} />
                                  </div>
                                </div>

                                <div className="col-md-6 col-sm-12">
                                  <div className="form-group">
                                    <label>Start Date</label>
                                  
                                    <input type="date" className="form-control" id="edit_form_startDate" 
                                    defaultValue={(this.state.currentEditCourseInfo['start_date'])?.substring(0,10)} />
                                  </div>
                                </div>

                                <div className="col-md-6 col-sm-12">
                                  <div className="form-group">
                                    <label>End Date</label>
                                   
                                    <input type="date" className="form-control" id="edit_form_endDate" 
                                    defaultValue={(this.state.currentEditCourseInfo['end_date'])?.substring(0,10)} />
                                  </div>
                                </div>
                                  <label className="col-md-3 col-form-label">
                                          Course Image
                                   </label>
                                 <div className="col-md-8">
                                 <input type="file" name="" id="form_edit_Image" 
                                 onChange={(e)=>{
                                    console.log(e);
                                    console.log(e.target.files[0])
                                 }}/>
                                     <small id="fileHelp" className="form-text text-muted">
                                    Please upload image here
                                      </small>
                                  </div>
                                <div className="form-group row">
                                       <label className="col-md-7 col-form-label">
                                             Number of Modules
                                       </label>
                                        <div className="col-md-7">
                                          <input type="text" value={this.state.noOfEditModules} className="form-control" id="form_editNOM" />
                                        </div>
                                      <div>
                                         <button
                                    type="button"
                                    className="mr-1 btn btn-primary"
                                    id="edit_courseForm_addModule"
                                    onClick={(e)=>{
                                      addModuleClicked(e)
                                    }}
                                  >
                                    Add Module
                                  </button>
                                    </div>
                                  </div> 
                                {this.state.allModules.length >0 &&
                                      this.state.allModules.map((data,id)=>{
                                        let module=this.state.allModules;
                                                let modules=[];
                                                console.log("length:",this.state.currentEditCourseInfo['modules'].length);
                                                for(let i=1;i<=this.state.currentEditCourseInfo['modules'].length;i++){
                                                  modules.push("Module "+ i)
                                                }
                                                 return(
                                                   <div className="card" key={data + [id + 212]}>
                                <div className="card-header">

                                  <h3 className="card-title"> {modules[id]} </h3>
                              
                                </div>
                                <div className="card-body">
                                  <div className="form-group row">
                                    <label className="col-md-3 col-form-label">
                                      Name
                                  </label>
      
                                    <div className="col-md-7">
                                      <input type="textarea" className="form-control" id={"form_editModuleName" + id} defaultValue={module[id].module_name?module[id].module_name:""}/>
                                    </div>
                                  </div>

                                  <div className="form-group row">
                                    <label className="col-md-3 col-form-label">
                                      Date
                                  </label>
                                    <div className="col-md-7">
                                      <input type="date" className="form-control" id={"form_editModuleDate" + id} defaultValue={module[id].module_date?module[id].module_date:""}/>
                                    </div>
                                  </div>
                                      <div className="form-group row">
                                    <label className="col-md-3 col-form-label">
                                      Time Limit
                                  </label>
                                    <div className="col-md-7">
                                      <input type="text" className="form-control" id={"form_editModuleTimeLimit" + id} defaultValue={module[id].time_limit?module[id].time_limit:""}/>
                                    </div>
                                  </div>

                                  <div className="form-group row">
                                    <label className="col-md-3 col-form-label">
                                      Reminder
                                  </label>
                                    <div className="col-md-7">
                                      <input type="Date" className="form-control" id={"form_editModuleReminder" + id} defaultValue={module[id].module_reminder?module[id].module_reminder:""}/>
                                    </div>
                                  </div>

                                
                                    <div className="form-group row">
                                      <label className="col-md-3 col-form-label">
                                      Edit Resource Link 1
                                      </label>
                                      <div className="col-md-7">
                                        <input type="text" name="" id={"form_editModuleResource1" + id} 
                                        className="form-control" defaultValue={
                                          module[id].resources?module[id].resources:""}/>
                                  
                                      </div>
                                    </div>
                                  
                                  
                                    <div className="form-group row">
                                      <label className="col-md-3 col-form-label">
                                       Edit Resource Link 2
                                    </label>
                                      <div className="col-md-7">
                                        <input type="text" className="form-control" id={"form_editModuleResource2" + id} defaultValue={module[id].upload_lecture?module[id].upload_lecture:""}/>
                                      </div>
                                    </div>

                                    
                                    <div className="form-group row">
                                      <label className="col-md-3 col-form-label">
                                       Edit Resource Link 3
                                    </label>
                                      <div className="col-md-7">
                                        <input type="text" className="form-control" id={"form_editModuleResource3" + id} defaultValue={module[id].zoom_link?module[id].zoom_link:""}/>
                                      </div>
                                    </div>

                                  </div>
                              </div>
                                                    
                                                  )
                                                //})
                                          })
                                       
                                      // : "" 
                                      }

                                     {this.state.addedModules.length >0 &&
                                      this.state.addedModules.map((data,id)=>{
                                                let modules=[];
                                                let previousLength=this.state.currentEditCourseInfo['modules'].length;
                                                let modifiedLength=previousLength+this.state.addedModules.length
                                                for(let i=previousLength+1;i<=modifiedLength;i++){
                                                  modules.push("Module "+ i)
                                                }
                                                 return(
                                                   <div className="card" key={data + [id + 212]}>
                                               <div className="card-header">

                                                   <h3 className="card-title"> {modules[id]} </h3>
                              
                                              </div>
                                <div className="card-body">
                                  <div className="form-group row">
                                    <label className="col-md-3 col-form-label">
                                      Name
                                  </label>
      
                                    <div className="col-md-7">
                                      <input type="textarea" className="form-control" id={"form_addModuleName" + id} />
                                    </div>
                                  </div>

                               <div className="form-group row">
                                    <label className="col-md-3 col-form-label">
                                      Date
                                  </label>
                                    <div className="col-md-7">
                                      <input type="date" className="form-control" id={"form_addModuleDate" + id} />
                                    </div>
                                  </div>
                                      <div className="form-group row">
                                    <label className="col-md-3 col-form-label">
                                      Time Limit
                                  </label>
                                    <div className="col-md-7">
                                      <input type="text" className="form-control" id={"form_addModuleTimeLimit" + id}/>
                                    </div>
                                  </div>

                                  <div className="form-group row">
                                    <label className="col-md-3 col-form-label">
                                      Reminder
                                  </label>
                                    <div className="col-md-7">
                                      <input type="Date" className="form-control" id={"form_addModuleReminder" + id} />
                                    </div>
                                  </div>
                                    <div className="form-group row">
                                      <label className="col-md-3 col-form-label">
                                      Resource Link 1
                                      </label>
                                      <div className="col-md-7">
                                        <input type="text" className="form-control" name="" id={"form_addModuleResource1" + id} />
                                      </div>
                                    </div>

                                    <div className="form-group row">
                                      <label className="col-md-3 col-form-label">
                                      Resource Link 2
                                        
                                    </label>
                                      <div className="col-md-7">
                                        <input type="text" className="form-control" id={"form_addModuleResource2" + id} />
                                      </div>
                                    </div>
                                  
                                  <div className="form-group row">
                                      <label className="col-md-3 col-form-label">
                                      Resource Link 3
                                        
                                    </label>
                                      <div className="col-md-7">
                                        <input type="text" className="form-control" id={"form_addModuleResource3" + id} />
                                      </div>
                                    </div>
                                  </div>

                                  </div>
                              
                                                    
                                                  )
                                                //})
                                          })
                                       
                                      // : "" 
                                      }
                                <div className="col-sm-12">
                                 <button
                                    type="button"
                                    className="mr-1 btn btn-primary"
                                    id="edit_courseForm_submit"
                                    onClick={CourseEdit}
                                  >
                                    Submit
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </form>

                    :

                    <div>
                      Loading...
                    </div>


                }
              </TabPane>
            </TabContent>
          </div>
        </div>
      </>
    );
  }
}
