import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData(props) {
    const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}));
    });
  },[]);

  function calcSpots(state, appointments){
    return state.days.map((day) => {
      if(day.name === state.day) {
        return {
          ...day, spots: day.appointments.map((id) => (appointments[id])).filter(({interview}) => { 
            return !interview
          }).length
        };
      }
      return day;
    });
  }

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios
      .put(`/api/appointments/${id}`, {interview})
      .then(setState({...state, appointments, days: calcSpots(state, appointments) 
    }));
  }

  function cancelInterview(id){
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios
      .delete(`/api/appointments/${id}`)
      .then(setState(prev => ({...prev, appointments, days: calcSpots(state, appointments) 
    })))
  }

  return { state, setDay, bookInterview, cancelInterview }
}