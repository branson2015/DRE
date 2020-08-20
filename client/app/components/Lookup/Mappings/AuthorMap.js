import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withRouter, Router } from "react-router-dom";
import { connect } from 'react-redux';
import { styles } from '../../common/styles';
import queryString from 'query-string';
import { URLS } from './URL';
import {
	Card,
	CardBody,
	CardHeader,
	ListGroup,
	ListGroupItem,
	Table,
} from "reactstrap";

function select_map(props){
	let type = props.state.type;
	let data = props.state.data;
	//query string won't be displayed in results
	data.shift();
	
	if (type === "a2c") return a2c(data);
	else if (type === "a2f") return a2f(data);
	else if (type === "a2fb") return a2fb(data);
	else if (type === "a2p") return a2p(data);
}

function a2c(data) {
	return data.map((Commit) =>
			<tr key={Commit}>
			<td>Commit:</td>
			<td><a href={"./lookupresult?sha1="+Commit+"&type=commit"}>{Commit}</a></td>
			</tr>);
}

function a2f(data) {
	return data.map((File) =>
			<tr key={File}>
			<td>File:</td>
			<td><a href={"./lookupresult?sha1="+File+"&type=blob"}>{File}</a></td>
			</tr>);
}

function a2fb(data) {
	return data.map((Blob) =>
			<tr key={Blob}>
			<td>Blob:</td>
			<td><a href={"./lookupresult?sha1="+Blob+"&type=blob"}>{Blob}</a></td>
			</tr>);
}

function a2p(data) {
	const p_list = [];
	let URI_ = "";
	let build_str = ""
	let len = 0;

	for (let i = 0; i < data.length; i++) {
		let found = false;
		len = 0;
		if (data[i].match(/_/)) len = data[i].match(/_/).length;
		for (var URI in Object.keys(URLS)) {
			URI_ = URI + "_";
			if (data[i].startsWith(URI_) && (len >= 2 || URI === "sourcefordge.net")) {
				build_str = "https://" + URLS[URI] + "/" + data[i];
				found = true;
				break;
			}
		}
		if (!found) build_str = "https://github.com/" + data[i];

		if (build_str.match(/_/)) len = build_str.match(/_/).length;
		for (let j = 0; j < len; j++) build_str = build_str.replace("_","/");
	
		console.log(build_str);
		p_list.push(build_str);
	}

	return data.map((Project, index) =>
			<tr key={Project}>
			<td>Project:</td>
			<td><a href={p_list[index]}>{Project}</a></td>
			</tr>);
}

export function AuthorMap(props) {
	return (
		<div>
		  <Card className="bg-secondary shadow border-0">
		    <CardHeader>Mapping Results for Author {props.state.sha}</CardHeader>
		      <CardBody>
				<Table style={styles.table} className="align-items-center table-flush" responsive>
				  <tbody>
		            {select_map(props)}
				  </tbody>
				</Table> 
		      </CardBody>
	      </Card>
		</div>
	);
}
