import React, {useState} from 'react';
import {Link } from "react-router-dom";

function SideMenuContent() {
    const [showCoursesSubMenu, setShowCoursesSubMenu] = useState(false)  
    const [showStudentsSubMenu, setShowStudentsSubMenu] = useState(false)  
    const [showUniversitiesSubMenu, setShowUniversitiesSubMenu] = useState(false)
    const [currentUser] = useState(localStorage.getItem("currentUser"))

    const handleParentCoursesClick = () => {
        if(showCoursesSubMenu){
            setShowCoursesSubMenu(false)
        }
        else{
            setShowCoursesSubMenu(true)
        }
    }
    
    const handleParentStudentsClick = () => {
        if(showStudentsSubMenu){
            setShowStudentsSubMenu(false)
        }
        else{
            setShowStudentsSubMenu(true)
        }
    }

    const handleParentUniversitiesClick = () => {
        if(showUniversitiesSubMenu){
            setShowUniversitiesSubMenu(false)
        }
        else{
            setShowUniversitiesSubMenu(true)
        }
    }
    return(
        <div className="sidebar-nav">
            { currentUser==='Admin' ? 
            <ul className="metismenu">
                <li className="">
                    <Link to="/">
                        <i className="fa fa-dashboard"></i>
                        <span>Dashboard</span>
                    </Link>
                </li>
                <li className="">
                    <div className="ParentSide_a" onClick={handleParentUniversitiesClick}>
                        <i className="fa fa-university"></i>
                        <span>Universities</span>
                        {showUniversitiesSubMenu ?
                            <i className="fa fa-chevron-up" style={{fontSize:'12px',fontWeight:'400',float:'right',marginTop:'3px'}}></i>
                            :
                            <i className="fa fa-chevron-down" style={{fontSize:'12px',fontWeight:'400',float:'right',marginTop:'3px'}}></i>
                        }
                    </div>

                    {
                        showUniversitiesSubMenu ?
                            <div>
                                <Link to="/Universities">
                                    <span>Universities</span>
                                </Link>
                                <Link to="/departments">
                                    <span>Departments</span>
                                </Link>
                                <Link to="/professors">
                                    <span>Professors</span>
                                </Link>

                            </div>

                            : null
                    }

                    
                </li>
                <li className="">
                    <Link to="/staff">
                        <i className="fa fa-user-circle-o"></i>
                        <span>Staff</span> 
                    </Link>
                </li>
                <li className="">
                    <div className="ParentSide_a" onClick={handleParentStudentsClick}>
                        <i className="fa fa-users"></i>
                        <span>Students</span>
                        {showStudentsSubMenu ?
                            <i className="fa fa-chevron-up" style={{fontSize:'12px',fontWeight:'400',float:'right',marginTop:'3px'}}></i>
                            :
                            <i className="fa fa-chevron-down" style={{fontSize:'12px',fontWeight:'400',float:'right',marginTop:'3px'}}></i>
                        }
                    </div>

                    {
                        showStudentsSubMenu ? 
                            <div>
                                <Link to="/students">
                                    <span>Students</span>
                                </Link>
                                <Link to="/fileManager">
                                    <span>Reports</span>
                                </Link>
                                <Link to="/attendance">
                                    <span>Attendance</span>
                                </Link>
                                <Link to="/certeficates">
                                    <span>Certificates</span>
                                </Link>
                            </div>

                            : null

                    }
                </li>
                <li className="">
                    <div className="ParentSide_a" onClick={handleParentCoursesClick}>
                        <i className="fa fa-graduation-cap"></i>
                        <span>Courses</span> 
                        {showCoursesSubMenu ?
                            <i className="fa fa-chevron-up" style={{fontSize:'12px',fontWeight:'400',float:'right',marginTop:'3px'}}></i>
                            :
                            <i className="fa fa-chevron-down" style={{fontSize:'12px',fontWeight:'400',float:'right',marginTop:'3px'}}></i>
                        }
                    </div>
                    {
                    showCoursesSubMenu ? 
                    
                        <div id="coursesSubCategoriesDiv" style={{display:'block',paddingLeft:'20px'}}>
                            <Link to="/courses">
                                <span>Completed Courses</span>
                            </Link>
                            <Link to="/courses">
                                <span>Paid Courses</span>
                            </Link>
                            <Link to="/courses">
                                <span>Unpaid Courses</span>
                            </Link>
                            <Link to="/packages">
                                <span>Packages</span>
                            </Link>
                            <Link to="/library">
                                <span>Categories</span>
                            </Link>
                            <Link to="/Competencies">
                                <span>Competencies</span>
                            </Link>
                            <Link to="/quizzes">
                                    <span>Quizzes</span>
                            </Link>
                            <Link to="/Certificates">
                                    <span>Certificates</span>
                            </Link>
                        </div>

                        : null
                
                    }
                    
                   
                </li>
                
                <li className="">
                    <span className="g_heading">Extra</span>
                </li>
                <li className="">
                    <Link to="/Enquiry">
                        <i className="fa fa-question"></i>
                        <span>Enquiry</span>
                    </Link>
                </li>
                <li className="">
                    <Link to="/events">
                        <i className="fa fa-calendar"></i>
                        <span>Calender</span>
                    </Link>
                </li>
                {/* <li className="">
                    <Link to="/chat">
                        <i className="fa fa-comments-o"></i>
                        <span>Chat</span>
                    </Link>
                </li> */}
                <li className="">
                    <Link to="/email">
                        <i className="fa fa-address-book"></i>
                        <span>Mail</span>
                    </Link>
                </li>
                <li className="">
                    <Link to="/RecordLecture">
                        <i className="fa fa-camera"></i>
                        <span>Record Lecture</span>
                    </Link>
                </li>
                <li className="">
                        <Link to="/billing">
                            <i className="fa fa-credit-card"></i>
                            <span>Billing</span>
                        </Link>
                </li>
                <li className="">
                    <Link to="/setting">
                        <i className="fa fa-gear"></i>
                        <span>Settings</span>
                    </Link>
                </li>
            </ul>
            : null}
            { currentUser==='Student' ? 
                <ul className="metismenu">
                    <li className="">
                        <Link to="/courses">
                            <i className="fa fa-graduation-cap"></i>
                            <span>Courses</span>
                        </Link>
                    </li>
                    <li className="">
                        <Link to="/live_lectures">
                            <i className="fa fa-university"></i>
                            <span>Live Lectures</span>
                        </Link>
                    </li>
                    <li className="">
                        <Link to="/quizzes">
                            <i className="fa fa-question"></i>
                            <span>Quizzes</span>
                        </Link>
                    </li>
                    <li className="">
                        <Link to="/assessments">
                            <i className="fa fa-star-half-o"></i>
                            <span>Assessments</span>
                        </Link>
                    </li>
                    <li className="">
                        <Link to="/submissions">
                            <i className="fa fa-file-text"></i>
                            <span>Submissions</span>
                        </Link>
                    </li>
                    <li className="">
                        <Link to="/events">
                            <i className="fa fa-calendar"></i>
                            <span>Calender</span>
                        </Link>
                    </li>
                    {/* <li className="">
                        <Link to="/email">
                            <i className="fa fa-address-book"></i>
                            <span>Mail</span>
                        </Link>
                    </li>
                    <li className="">
                        <Link to="/chat">
                            <i className="fa fa-comments-o"></i>
                            <span>Chat</span>
                        </Link>
                    </li> */}
                    <li className="">
                        <Link to="/setting">
                            <i className="fa fa-gear"></i>
                            <span>Settings</span>
                        </Link>
                    </li>
                </ul>
                : null}
                { 
                currentUser==='Trainer' ? 
                <ul className="metismenu">
                    <li className="">
                        <Link to="/">
                            <i className="fa fa-dashboard"></i>
                            <span>Dashboard</span>
                        </Link>
                    </li>

                    <li className="">
                        <div className="ParentSide_a" onClick={handleParentStudentsClick}>
                            <i className="fa fa-users"></i>
                            <span>Students</span>
                            {showStudentsSubMenu ?
                                <i className="fa fa-chevron-up" style={{fontSize:'12px',fontWeight:'400',float:'right',marginTop:'3px'}}></i>
                                :
                                <i className="fa fa-chevron-down" style={{fontSize:'12px',fontWeight:'400',float:'right',marginTop:'3px'}}></i>
                            }
                        </div>

                        {
                            showStudentsSubMenu ? 
                                <div>
                                    <Link to="/students">
                                        <span>Students</span>
                                    </Link>
                                    <Link to="/fileManager">
                                        <span>Reports</span>
                                    </Link>
                                    <Link to="/attendance">
                                        <span>Attendance</span>
                                    </Link>
                                    <Link to="/certeficates">
                                        <span>Certificates</span>
                                    </Link>
                                </div>

                                : null

                        }
                    </li>
                    <li className="">
                        <div className="ParentSide_a" onClick={handleParentCoursesClick}>
                            <i className="fa fa-graduation-cap"></i>
                            <span>Courses</span> 
                            {showCoursesSubMenu ?
                                <i className="fa fa-chevron-up" style={{fontSize:'12px',fontWeight:'400',float:'right',marginTop:'3px'}}></i>
                                :
                                <i className="fa fa-chevron-down" style={{fontSize:'12px',fontWeight:'400',float:'right',marginTop:'3px'}}></i>
                            }
                        </div>
                        {
                        showCoursesSubMenu ? 
                        
                            <div id="coursesSubCategoriesDiv" style={{display:'block',paddingLeft:'20px'}}>
                                <Link to="/courses">
                                    <span>Courses</span>
                                </Link>
                                <Link to="/packages">
                                    <span>Packages</span>
                                </Link>
                                <Link to="/library">
                                    <span>Categories</span>
                                </Link>
                                <Link to="/Competencies">
                                    <span>Competencies</span>
                                </Link>
                                <Link to="/quizzes">
                                    <span>Quizzes</span>
                                </Link>
                            </div>

                            : null
                    
                        }
                        
                    
                    </li>
                    <li className="">
                        <Link to="/events">
                            <i className="fa fa-calendar"></i>
                            <span>Calendar</span>
                        </Link>
                    </li>
                    {/* <li className="">
                        <Link to="/chat">
                            <i className="fa fa-comments-o"></i>
                            <span>Chat</span>
                        </Link>
                    </li>
                    <li className="">
                        <Link to="/email">
                            <i className="fa fa-address-book"></i>
                            <span>Mail</span>
                        </Link>
                    </li> */}
                    <li className="">
                        <Link to="/RecordLecture">
                            <i className="fa fa-camera"></i>
                            <span>Record Lecture</span>
                        </Link>
                    </li>
                    <li className="">
                        <Link to="/setting">
                            <i className="fa fa-gear"></i>
                            <span>Settings</span>
                        </Link>
                    </li>
                </ul>
                : null
                }
                {
                currentUser==='Staff' ? 
                <ul className="metismenu">
                    <li className="">
                        <Link to="/">
                            <i className="fa fa-dashboard"></i>
                            <span>Dashboard</span>
                        </Link>
                    </li>

                    <li className="">
                        <div className="ParentSide_a" onClick={handleParentStudentsClick}>
                            <i className="fa fa-users"></i>
                            <span>Students</span>
                            {showStudentsSubMenu ?
                                <i className="fa fa-chevron-up" style={{fontSize:'12px',fontWeight:'400',float:'right',marginTop:'3px'}}></i>
                                :
                                <i className="fa fa-chevron-down" style={{fontSize:'12px',fontWeight:'400',float:'right',marginTop:'3px'}}></i>
                            }
                        </div>

                        {
                            showStudentsSubMenu ? 
                                <div>
                                    <Link to="/students">
                                        <span>Students</span>
                                    </Link>
                                    <Link to="/fileManager">
                                        <span>Reports</span>
                                    </Link>
                                    <Link to="/attendance">
                                        <span>Attendance</span>
                                    </Link>
                                    <Link to="/certeficates">
                                        <span>Certificates</span>
                                    </Link>
                                </div>

                                : null

                        }
                    </li>
                    <li className="">
                        <div className="ParentSide_a" onClick={handleParentCoursesClick}>
                            <i className="fa fa-graduation-cap"></i>
                            <span>Courses</span> 
                            {showCoursesSubMenu ?
                                <i className="fa fa-chevron-up" style={{fontSize:'12px',fontWeight:'400',float:'right',marginTop:'3px'}}></i>
                                :
                                <i className="fa fa-chevron-down" style={{fontSize:'12px',fontWeight:'400',float:'right',marginTop:'3px'}}></i>
                            }
                        </div>
                        {
                        showCoursesSubMenu ? 
                        
                            <div id="coursesSubCategoriesDiv" style={{display:'block',paddingLeft:'20px'}}>
                                <Link to="/courses">
                                    <span>Courses</span>
                                </Link>
                                <Link to="/packages">
                                    <span>Packages</span>
                                </Link>
                                <Link to="/library">
                                    <span>Categories</span>
                                </Link>
                                <Link to="/Competencies">
                                    <span>Competencies</span>
                                </Link>
                                <Link to="/quizzes">
                                    <span>Quizzes</span>
                                </Link>
                            </div>

                            : null
                    
                        }
                        
                    
                    </li>
                    <li className="">
                        <Link to="/events">
                            <i className="fa fa-calendar"></i>
                            <span>Calendar</span>
                        </Link>
                    </li>
                    {/* <li className="">
                        <Link to="/chat">
                            <i className="fa fa-comments-o"></i>
                            <span>Chat</span>
                        </Link>
                    </li>
                    <li className="">
                        <Link to="/email">
                            <i className="fa fa-address-book"></i>
                            <span>Mail</span>
                        </Link>
                    </li> */}
                    <li className="">
                        <Link to="/RecordLecture">
                            <i className="fa fa-camera"></i>
                            <span>Record Lecture</span>
                        </Link>
                    </li>
                    <li className="">
                        <Link to="/setting">
                            <i className="fa fa-gear"></i>
                            <span>Settings</span>
                        </Link>
                    </li>
                </ul>
                : null
                }
        </div>
    )
}

export default SideMenuContent;