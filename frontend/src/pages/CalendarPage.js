import React, { useEffect, useState } from 'react';
import NavDrawer from '../components/NavDrawer.js';
import {buildPath} from '../App.js';
import axios from 'axios';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs';
import AddWorkoutsMenu from '../components/AddWorkoutsMenu.js';
import Popover from '@mui/material/Popover';
import UpdateIcon from '@mui/icons-material/Update';
import DeleteIcon from '@mui/icons-material/Delete';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';


export default function CalendarPage(props){
    let numToDay = {0: "Sunday", 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday"}
    let numToMonth = {0: "January", 1: "February", 2: "March", 3: "April", 4: "May", 5: "June", 6: "July", 7: "August", 8: "September", 9: "October", 10: "November", 11: "December"}
    let monthDays = {1: 31, 2: 28, 3: 31, 4: 30, 5: 31, 6: 30, 7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31}

    const [consumed, setConsumed] = useState({});
    const [date, setDate] = useState("");
    const [displayDate, setDisplayDate] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userId, setUserId] = useState(null);
    const [mainErrorMessage, setMainErrorMessage] = useState("");
    const [tracked, setTracked] = useState({});
    const [boxes, setBoxes] = useState([]);

    const getUserInfo = async (userIdTemp) => {
        await axios
            .post(buildPath('api/fetchUser'),
                {
                    "userId": userIdTemp,
                    "accessToken": localStorage.getItem('accessToken')
                })
            .then((response) => {
                if (response["data"]["error"] == "") {
                    setFirstName(response["data"]["info"]["firstName"]);
                    setLastName(response["data"]["info"]["lastName"]);
                    setTracked(response["data"]["info"]["tracked"]);
                    localStorage.setItem('accessToken', response["data"]["token"]["accessToken"]);
                }
                else {
                    setMainErrorMessage(response["data"]["error"]);
                }
            });
    } 

    useEffect(() => {
        let _ud = localStorage.getItem('user_data');
        let ud = JSON.parse(_ud);
        let userIdTemp = ud["id"];
        setUserId(userIdTemp);

        getUserInfo(userIdTemp);

        let temp = new Date();
        let year = temp.getFullYear().toString();
        let month = (temp.getMonth() + 1).toString();
        if(month.length == 1)
            month = "0"+month;
        setDate(year+month);
        setDisplayDate(numToMonth[temp.getMonth()]+", "+year);

        axios
            .post(buildPath('api/fetchConsumedNoDate'), 
                {
                    "userId": userIdTemp,
                    "accessToken": localStorage.getItem('accessToken')
                })
            .then((response) => {
                if(response["data"]["error"] == ""){
                    setConsumed(response["data"]["info"]);
                    localStorage.setItem('accessToken', response["data"]["token"]["accessToken"]);
                }
                else{
                    setMainErrorMessage(response["data"]["error"]);
                }
            })
    }, []);

    useEffect(() => {
        if(date.length > 0 && Object.keys(consumed).includes("dates")){
            let year = date.slice(0, 4);
            let month = date.slice(4, 6);
            if(month.slice(0, 1) == "0")
                month = month.slice(1);
            let dateObj = new Date(Number(year), Number(month)-1, 1);
            setDisplayDate(numToMonth[dateObj.getMonth()]+", "+year);

            let displayBoxes = [];
            let numBlank = dateObj.getDay();
            for(let i=0; i<numBlank; i++){
                if(i == 0)
                    displayBoxes.push((
                        <div className='blankBox' style={{borderTop: "2px solid #eee", borderLeft: "2px solid #eee"}}></div>
                    ));
                else
                    displayBoxes.push((
                        <div className='blankBox' style={{borderTop: "2px solid #eee"}}></div>
                    ));
            }
            
            let trackedKeys = Object.keys(tracked);
            let goalKeys = [];
            trackedKeys.forEach((key) => {
                if(tracked[key] != "-1")
                    goalKeys.push(key);
            });

            
            for(let i=1; i<=monthDays[Number(month)]; i++){
                let boxBorderStyle = {};
                if(i > (monthDays[Number(month)]-7))
                    boxBorderStyle["borderBottom"] = "2px solid #eee";
                if(numBlank + i < 8)
                    boxBorderStyle["borderTop"] = "2px solid #eee";
                if(numBlank != 0){
                    if(i == (7 - numBlank) || (i % 7) == (7 - numBlank))
                        boxBorderStyle["borderRight"] = "2px solid #eee";
                    if(i == (8 - numBlank) || (i % 7) == (8 - numBlank))
                        boxBorderStyle["borderLeft"] = "2px solid #eee";
                }
                else{
                    if((i % 7) == 0)
                        boxBorderStyle["borderRight"] = "2px solid #eee";
                    if(i == 1 || (i % 7) == 1)
                        boxBorderStyle["borderLeft"] = "2px solid #eee";
                }
                if(i == monthDays[Number(month)])
                    boxBorderStyle["borderRight"] = "2px solid #eee";

                let day = ""+i;
                if(day.length == 1)
                    day = "0"+day;
                let tempDate = year+month+day;
                if(Object.keys(consumed["dates"]).includes(tempDate)){
                    let consumedToday = consumed["dates"][tempDate];
                    let protein = 0;
                    let carbs = 0;
                    let calories = 0;
                    let fat = 0;
                    let steps = 0;
                    let water = 0;
                    consumedToday.forEach((element) => {
                        if(Object.keys(element).includes("protein") && element["protein"] != -1)
                            protein = protein + Number(element["protein"]);
                        if(Object.keys(element).includes("carbs") && element["carbs"] != -1)
                            carbs = carbs + Number(element["carbs"]);
                        if(Object.keys(element).includes("calories") && element["calories"] != -1)
                            calories = calories + Number(element["calories"]);
                        if(Object.keys(element).includes("fat") && element["fat"] != -1)
                            fat = fat + Number(element["fat"]);
                        if(element["type"] == "steps" && element["amount"] != -1)
                            steps = steps + Number(element["amount"]);
                        if(element["type"] == "water" && element["amount"] != -1)
                            water = water + Number(element["amount"]);
                    });

                    let numGoalsMet = 0;
                    if(goalKeys.includes("protein") && protein >= tracked["protein"])
                        numGoalsMet++;
                    if(goalKeys.includes("carbs") && carbs >= tracked["carbs"])
                        numGoalsMet++;
                    if(goalKeys.includes("calories") && calories >= tracked["calories"])
                        numGoalsMet++;
                    if(goalKeys.includes("fat") && fat >= tracked["fat"])
                        numGoalsMet++;
                    if(goalKeys.includes("steps") && steps >= tracked["steps"])
                        numGoalsMet++;
                    if(goalKeys.includes("water") && water >= tracked["water"])
                        numGoalsMet++;
                    
                    let numMetStyle = {color: "red"}
                    if(numGoalsMet/goalKeys.length == 1)
                        numMetStyle = {color: "green"}
                    else if(numGoalsMet/goalKeys.length > 0)
                        numMetStyle = {color: "#F4BB44"}
                    displayBoxes.push((
                        <div className='filledBox' style={boxBorderStyle}>
                            <div className='dayContainer'>{i}</div>
                            <div className='numMetContainer'>
                                <div className='numMet' style={numMetStyle}>{numGoalsMet}/{goalKeys.length}</div>
                            </div>
                        </div>
                    ));

                }
                else{
                    displayBoxes.push((
                        <div className='emptyBox' style={boxBorderStyle}>
                            <div className='dayContainer'>{i}</div>
                            <div className='numMetContainer'>
                                <div className='numMet' style={{color: "red"}}>0/{goalKeys.length}</div>

                            </div>
                        </div>
                    ));
                }
            }
            setBoxes(displayBoxes);
        }
    }, [date, consumed]);



    if(mainErrorMessage != "")
        return(
            <div>
                <NavDrawer page='exercise' name={firstName + " "+ lastName}/>
                <div className='mainContainer'>
                    {mainErrorMessage}
                </div>
            </div>
        );

    return (
        <div>
            <NavDrawer page='calendar' name={firstName + " "+ lastName}/>
            <div className='mainContainer'>
                <div className='dateContainer'>
                    <span className='displayDate'>{displayDate}</span>
                    <div className='datePickerContainer'>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker label="" value={dayjs(date.slice(0,4)+"-"+date.slice(4,6))} 
                                views={['year','month']}
                                onChange={(newDate) => {
                                    let temp = newDate.year();
                                    let month = newDate.month() + 1;
                                    if(month.toString().length == 1)
                                        month = "0"+month;
                                    temp = temp +""+month;
                                    setDate(temp);
                                }}/>
                        </LocalizationProvider>
                    </div>
                </div>
                <div className='calendarContainer'>
                    <div className='dayBox' >
                        <div>Sunday</div>
                    </div>
                    <div className='dayBox' >
                        <div>Monday</div>
                    </div>
                    <div className='dayBox' >
                        <div>Tuesday</div>
                    </div>
                    <div className='dayBox' >
                        <div>Wednesday</div>
                    </div>
                    <div className='dayBox' >
                        <div>Thursday</div>
                    </div>
                    <div className='dayBox' >
                        <div>Friday</div>
                    </div>
                    <div className='dayBox' >
                        <div>Saturday</div>
                    </div>
                    {boxes}
                </div>
            </div>
        </div>
    );
}
