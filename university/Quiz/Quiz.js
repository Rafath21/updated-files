import React, { Component } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { TabContent, TabPane, Nav, NavLink, NavItem } from "reactstrap";
import classnames from 'classnames';
import {API , API2} from '../../../axios'
import toast, { Toaster } from "react-hot-toast";

export default class Quiz extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeTab: 1,
			isCardRemove: false,
			isCollapsed: false,
            questionsValue : '',
            questionHTML : [],
            showQuestions : false,
            coursesData : [],
            coursesDataFetched : false,
            UniversityNames : [],
			UniversityNamesFetched : false
		};
	}

    getCoursesData(){
		API2
		  .get(`/course`, {})
		  .then(res => {
            this.setState({
            coursesData : res.data['result'],
            coursesDataFetched : true,
            })
		  })
		  .catch((error) => {
			  console.log(error)
		  })
	}

    getUniversityNames(){
        API
          .get(`/university`, {})
          .then(res => {
              //console.log(typeof(res.data))
              let tempUniversities = []
              for (const property in res.data) {
                tempUniversities.push(res.data[property].university_name)
              }
              this.setState({
                UniversityNames : tempUniversities,
                UniversityNamesFetched : true
              })
              
    
          })
          .catch((error) => {
              console.log(error)
          })
        }

    componentDidMount(){
        this.getCoursesData();
        this.getUniversityNames();
    }
	
	render() {
		const { activeTab, isCardRemove, isCollapsed } = this.state

        const QuestionsInputHandler = (event) => {
            const re = /^[0-9\b]+$/;
            if ((event.target.value === '' || re.test(event.target.value)) && event.target.value >0) {
            this.setState({questionsValue: event.target.value})
            this.setState({questionHTML: []})
            let questionNumbers = []
            for(let i=1; i <= event.target.value; i++){
                questionNumbers.push('QuizQuestion'+i) 
            }
            this.setState({questionHTML: questionNumbers})
            this.setState({showQuestions: true})
          }
          else{
            this.setState({questionsValue: ''})
            this.setState({questionHTML: []})
            this.setState({showQuestions: false})
          }
        }

        const notify =()=>{
        toast.success("Quiz added ✅");
        };

        const TypeOfQuestionSelected = (e) =>{
            let questionno = (e.target.attributes.getNamedItem("data-questionno").value)
            if(e.target.value==="mcq"){
                document.getElementById('MCQ_'+questionno).style.display = 'block'
            }
            else{
                document.getElementById('MCQ_'+questionno).style.display = 'none'
            }
        }

        const QuizSubmit = () => {
            let postData = {}
            const numOfQuestions = document.getElementById('form_numberOfQuestions').value;
            postData.no_of_questions = parseInt(document.getElementById('form_numberOfQuestions').value);
            postData.university_name = document.getElementById('form_universityName').value;
            postData.course_id = document.getElementById('form_courseId').value;
            postData.questions = [];
            for(let i=1; i<= parseInt(numOfQuestions) ; i++){
                let tempQuestion = {}
                if(document.getElementById('form_questionType'+i).value === "mcq"){
                    tempQuestion.question_type = "mcq"
                    tempQuestion.question = document.getElementById('form_Question'+i).value
                    tempQuestion.option1 = document.getElementById('form_MCQOption1'+i).value
                    tempQuestion.option2 = document.getElementById('form_MCQOption2'+i).value
                    tempQuestion.option3 = document.getElementById('form_MCQOption3'+i).value
                    tempQuestion.option4 = document.getElementById('form_MCQOption4'+i).value
                    tempQuestion.answer = document.getElementById('form_MCQAnswer'+i).value
                }
                else if(document.getElementById('form_questionType'+i).value === "open-ended"){
                    tempQuestion.question_type = "open-ended"
                    tempQuestion.question = document.getElementById('form_Question'+i).value
                }
                postData.questions.push(tempQuestion)
            }
            API2
			  .post(`/quiz`, postData)
                    .then(res => {
                        console.log(res)
                        if(res.data.message === 'Quiz already present'){
                            alert('Quiz is already present')
                        }else{
                            notify();
                            document.getElementById('addCategoryForm').reset()
                            this.setState({questionHTML:[]})
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    })
        }
       

		return (
			<>
				<div className="section-body">
					<div className="container-fluid">
						<div className="d-flex justify-content-between align-items-center ">
							<div className="header-action mt-2">
								<h1 className="page-title">Quizzes</h1>
								<ol className="breadcrumb page-breadcrumb">
									<li className="breadcrumb-item">{localStorage.getItem('currentUser')}</li>
									<li className="breadcrumb-item active" aria-current="page">Quizzes</li>
								</ol>
							</div>
                                <Toaster position="top-right" />

							<Nav tabs className="page-header-tab">
								<NavItem>
									<NavLink
										className={classnames({ active: activeTab === 1 })}
										onClick={() => this.setState({ activeTab: 1 })}
									>
										Add
    			               </NavLink>
								</NavItem>
							</Nav>
						</div>
					</div>
				</div>
				<div className="section-body mt-4">
					<div className="container-fluid">
						<TabContent activeTab={activeTab}>
							<TabPane tabId={1} className={classnames(['fade show'])}>
								<div className={`card ${isCardRemove ? 'card-remove' : ''} ${isCollapsed ? 'card-collapsed' : ''}`}>
									<div className="card-header">
										<h3 className="card-title">Add Quiz</h3>
									</div>
									<div className="card-body" style={{paddingTop:'0'}}>
										<form className="dc" id="addCategoryForm">
											<div className="row">

                                               
                                                <div className="col-sm-12">
													<div className="form-group">
                                                        <label htmlFor="">University Name</label>
                                                        <select
                                                        className="form-control input-height"
                                                        name="department"
                                                        id={'form_universityName'}
                                                        defaultValue=""
                                                        >
                                                        <option disabled value="">Select University</option>
                                                        {
                                                            this.state.UniversityNamesFetched ? 

                                                            this.state.UniversityNames.map(data => {
                                                                return(
                                                                <option value={data} key={data}>{data}</option>
                                                                )
                                                            })
                                                            : 
                                                            null
                                                        }
                                                        </select>
													</div>
												</div>

                                                <div className="col-sm-12">
													<div className="form-group">
                                                        <label htmlFor="">Select Course</label>
                                                        <select
                                                        className="form-control input-height"
                                                        name="department"
                                                        id={'form_courseId'}
                                                        defaultValue=""
                                                        >
                                                        <option disabled value="">Select Course</option>
                                                        {
                                                        this.state.coursesData.map(data => {
                                                            return(
                                                                <>
                                                            {/* <option value={data} key={data}>{data}</option> */}
                                                            <option value={data['_id']} key={data['_id']}>{data['course_name']}</option>
                                                            </>
                                                            )
                                                        })
                                                        
                                                        }
                                                        </select>
													</div>
												</div>




                                                


												<div className="col-sm-12">
													<div className="form-group">
                                                        <label htmlFor="">Number of Questions</label>
														<input type="text" placeholder="Number of Questions" className="form-control"  onChange={(event) => QuestionsInputHandler(event)} id="form_numberOfQuestions" />
													</div>
												</div>

                                                {
                                                this.state.showQuestions ?
                                                this.state.questionHTML.map((data,id)=>(
                                                    <div key={data} className="card">
                                                        <div className="card-header">
                                                            <h3 className="card-title">Add Question {id + 1}</h3>
                                                        </div>

                                                    <div className="card-body" style={{paddingTop:'0'}} >
                                                    
                                                    <div className="col-sm-12">
													<div className="form-group">
                                                        <label htmlFor="">Question</label>
														<input type="text" placeholder="Enter Question" className="form-control" id={"form_Question"+[id + 1]} />
													</div>
                                                    </div>



                                                    <div className="col-sm-12">
                                                        <div className="form-group">
                                                            <label htmlFor="">Type of Question</label>
                                                            <select defaultValue=""
                                                                className="form-control input-height"
                                                                data-questionno={data}
                                                                onChange={(e)=>TypeOfQuestionSelected(e)}
                                                                id={"form_questionType"+ [id + 1]}
                                                                >
                                                                <option value="" disabled>Select Type</option>
                                                                <option value="mcq">MCQ</option>
                                                                <option value="open-ended">Open-Ended</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div id={"MCQ_"+data} style={{display:'none'}}>
                                                        <div className="col-sm-12">
                                                            <div className="form-group">
                                                                <label htmlFor="">Option 1</label>
                                                                <input type="text" placeholder="Enter Option 1" className="form-control" id={"form_MCQOption1"+[id + 1]} />
                                                            </div>
                                                        </div>

                                                        <div className="col-sm-12">
                                                            <div className="form-group">
                                                                <label htmlFor="">Option 2</label>
                                                                <input type="text" placeholder="Enter Option 2" className="form-control" id={"form_MCQOption2"+[id + 1]} />
                                                            </div>
                                                        </div>

                                                        <div className="col-sm-12">
                                                            <div className="form-group">
                                                                <label htmlFor="">Option 3</label>
                                                                <input type="text" placeholder="Enter Option 3" className="form-control" id={"form_MCQOption3"+[id + 1]} />
                                                            </div>
                                                        </div>

                                                        <div className="col-sm-12">
                                                            <div className="form-group">
                                                                <label htmlFor="">Option 4</label>
                                                                <input type="text" placeholder="Enter Option 4" className="form-control" id={"form_MCQOption4"+[id + 1]} />
                                                            </div>
                                                        </div>

                                                        <div className="col-sm-12">
                                                        <div className="form-group">
                                                            <label htmlFor="">Answer</label>
                                                            <select defaultValue=""
                                                                className="form-control input-height"
                                                                id={"form_MCQAnswer"+ [id + 1]}
                                                                >
                                                                <option value="" disabled>Select Answer</option>
                                                                <option value="option1">Option 1</option>
                                                                <option value="option2">Option 2</option>
                                                                <option value="option3">Option 3</option>
                                                                <option value="option4">Option 4</option>
                                                            </select>
                                                        </div>
                                                        </div>

                                                        </div>


                                                    </div>
                                                    </div>
                                                ))
                                                : null
                                                }


												<div className="col-sm-12">
													<button className="btn btn-primary btn-lg btn-simple" type="button" id="addQuizSubmit" onClick={QuizSubmit}>Add Quiz</button>
												</div>
											</div>
										</form>
									</div>
								</div>
							</TabPane>
						</TabContent>
					</div>
				</div>
			</>
		);
	}
}
