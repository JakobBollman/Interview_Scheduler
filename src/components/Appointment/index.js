import React from 'react';


import 'components/Appointment/styles.scss';

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
const findAppointment = function(props){
  if(props.interview){
    return (
      <Show
      key={props.id} 
      student={props.interview.student}
      interviewer={props.interview.interviewer}
      />
    )
  } else {
    return (
      <Empty/>
    )
  }
}
export default function Appointment(props) {
  return (
    <article className="appointment">
      <Header time={props.time}/>
      {findAppointment(props)}
    </article>
  );
}