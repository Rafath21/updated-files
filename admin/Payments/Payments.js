import React, { Component } from 'react';
import { TabContent, TabPane } from "reactstrap";
import classnames from 'classnames';
import { API } from '../../../axios'
export default class Payments extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeTab: 1,
			isCardRemove: false,
			isCollapsed: false,
			paymentData: [],
			paymentDataFetched: false
		};
	}
	getPaymentData = () => {
		API.get('/payment')
			.then(res => {
				console.log(res.data)
				this.setState({
					paymentData: res.data,
					paymentDataFetched: true
				})
			})
	}

	componentDidMount() {
		this.getPaymentData()
	}
	render() {
		const { activeTab } = this.state
		return (
			<>
				<div className="section-body">
					<div className="container-fluid">
						<div className="d-flex justify-content-between align-items-center ">
							<div className="header-action">
								<h1 className="page-title">Billing</h1>
								<ol className="breadcrumb page-breadcrumb">
									<li className="breadcrumb-item">Admin</li>
									<li className="breadcrumb-item active" aria-current="page">Billing</li>
								</ol>
							</div>
						</div>
					</div>
				</div>
				<div className="section-body mt-4">
					<div className="container-fluid">
						<TabContent activeTab={activeTab}>
							<TabPane tabId={1} className={classnames(['fade show'])}>
								<div className="card">
									<div className="card-body">
										<div className="table-responsive">
											<table className="table table-hover text-nowrap js-basic-example dataTable table-striped table_custom table-bordered" style={{ textAlign: 'center' }}>
												<thead>
													<tr>
														<th>University Name</th>
														<th>Course Name</th>
														<th>Student Name</th>
														<th>Student Email</th>
														<th>Course Cost</th>
														<th>Payment Source</th>
														<th>Date</th>
													</tr>
												</thead>
												<tbody>
													{
														this.state.paymentDataFetched ?
															this.state.paymentData.map((data, index) => {
																let date=data['created_at'];
																date=date.substring(0,10);
																return (
																	<tr key={data['student_id'] + index}>
																		<td>{data['university_name']}</td>
																		<td>{data['course_name']}</td>
																		<td>{data['student_name']}</td>
																		<td>{data['student_email']}</td>
																		<td>{data['course_cost']}</td>
																		<td>{data['payment_source']}</td>
																		<td>{date}</td>
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
