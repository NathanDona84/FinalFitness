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


export default function WorkoutsPage(props){
    let numToDay = {0: "Sunday", 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday"}
    let numToMonth = {0: "January", 1: "February", 2: "March", 3: "April", 4: "May", 5: "June", 6: "July", 7: "August", 8: "September", 9: "October", 10: "November", 11: "December"}

    const [workouts, setWorkouts] = useState({});
    const [date, setDate] = useState("");
    const [displayDate, setDisplayDate] = useState("");

    const [workoutsTodayLog, setWorkoutsTodayLog] = useState([]);

    const [openPopup, setOpenPopup] = useState(0);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userId, setUserId] = useState(null);

    const [addName, setAddName] = useState("");
    const [addSubmit, setAddSubmit] = useState(0);
    const [addReps, setAddReps] = useState("");
    const [addSets, setAddSets] = useState("");
    const [addAmount, setAddAmount] = useState("");
    const [addAmountType, setAddAmountType] = useState("none");
    const [addMessage, setAddMessage] = useState("");
    
    const [mainErrorMessage, setMainErrorMessage] = useState("");

    const [openUpdatePopup, setOpenUpdatePopup] = useState(0);
    const [updateIndex, setUpdateIndex] = useState(-1);
    const [updatedName, setUpdatedName] = useState("");
    const [updatedReps, setUpdatedReps] = useState("");
    const [updatedSets, setUpdatedSets] = useState("");
    const [updatedAmount, setUpdatedAmount] = useState("");
    const [updatedAmountType, setUpdatedAmountType] = useState("none");
    const [updateMessage, setUpdateMessage] = useState("");
    const [updateSubmit, setUpdateSubmit] = useState(0);

    const [deleteIndex, setDeleteIndex] = useState(-1);

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
        let day = temp.getDate().toString();
        let suffix = "th";
        if(day == "1")
            suffix = "st";
        else if(day == "2")
            suffix = "nd";
        else if(day == "3")
            suffix = "rd";
        if(day.length == 1)
            day = "0"+day;
        if(month.length == 1)
            month = "0"+month;
        setDate(year+month+day);
        setDisplayDate(numToDay[temp.getDay()]+", "+numToMonth[temp.getMonth()]+" "+temp.getDate()+suffix);

        axios
            .post(buildPath('api/fetchWorkouts'), 
                {
                    "userId": userIdTemp,
                    "date": (year+month+day),
                    "accessToken": localStorage.getItem('accessToken')
                })
            .then((response) => {
                if(response["data"]["error"] == ""){
                    setWorkouts(response["data"]["info"]);
                    localStorage.setItem('accessToken', response["data"]["token"]["accessToken"]);
                }
                else{
                    setMainErrorMessage(response["data"]["error"]);
                }
            })
    }, []);

    useEffect(() => {
        if(date.length > 0){
            let year = date.slice(0, 4);
            let month = date.slice(4, 6);
            let day = date.slice(6);
            if(day.slice(0, 1) == "0")
                day = day.slice(1);
            if(month.slice(0, 1) == "0")
                month = month.slice(1);
            let suffix = "th";
            if(day == "1")
                suffix = "st";
            else if(day == "2")
                suffix = "nd";
            else if(day == "3")
                suffix = "rd";
            let dateObj = new Date(Number(year), Number(month)-1, Number(day));
            setDisplayDate(numToDay[dateObj.getDay()]+", "+numToMonth[dateObj.getMonth()]+" "+dateObj.getDate()+suffix);
            axios
                .post(buildPath('api/fetchWorkouts'), 
                    {
                        "userId": userId,
                        "date": date,
                        "accessToken": localStorage.getItem('accessToken')
                    })
                .then((response) => {
                    if(response["data"]["error"] == ""){
                        setWorkouts(response["data"]["info"]);
                        localStorage.setItem('accessToken', response["data"]["token"]["accessToken"]);
                    }
                    else{
                        setMainErrorMessage(response["data"]["error"]);
                    }
                })
        }
    }, [date]);

    useEffect(() => {
        let workoutsToday = [];
        if(Object.keys(workouts).includes("dates")){
            workoutsToday = workouts["dates"][date];
            
            if(workoutsToday.length > 0){
                setWorkoutsTodayLog(workoutsToday.reverse());
            }
            else{
                setWorkoutsTodayLog([]);
            }
        }
    }, [workouts]);

    useEffect(()=>{
        if(addSubmit == 1 && addName == ""){
            setAddMessage("Name Cannot Be Empty");
            setAddSubmit(0);
        }
        else if(addSubmit == 1){
            let time = "";
            let temp = new Date();
            let hours = temp.getHours();
            if(hours < 10)
                hours = "0"+hours;
            let minutes = temp.getMinutes();
            if(minutes < 10)
                minutes = "0"+minutes;
            time = ""+hours+""+minutes;

            let year = temp.getFullYear().toString();
            let month = (temp.getMonth() + 1).toString();
            let day = temp.getDate().toString();
            if(day.length == 1)
                day = "0"+day;
            if(month.length == 1)
                month = "0"+month;
            let curDate = year+month+day;
            if(date != curDate)
                time = "-";

            setAddMessage("");
            setOpenPopup(0);
            axios
                .post(buildPath("api/addWorkoutsItem"), {
                    "userId": userId,
                    "date": date,
                    "item": {
                        "time": time,
                        "name": addName,
                        "reps": addReps == "" ? "-1" : addReps,
                        "sets": addSets == "" ? "-1" : addSets,
                        "amount": addAmount == "" ? "-1" : addAmount,
                        "amountType": addAmountType == "none" || addAmountType == null ? "-1" : addAmountType
                    },
                    "accessToken": localStorage.getItem('accessToken')
                })
                .then((response)=>{
                    if(response["data"]["error"] == ""){
                        setWorkouts(response["data"]["info"]);
                        localStorage.setItem('accessToken', response["data"]["token"]["accessToken"]);
                    }
                    else{
                        setMainErrorMessage(response["data"]["error"]);
                    }
                    setAddName("");
                    setAddReps("");
                    setAddSets("");
                    setAddAmount("");
                    setAddAmountType("none");
                    setAddSubmit(0);
                })
        }
    }, [addSubmit]);

    useEffect(() => {
        if(openUpdatePopup == 1){
            setUpdatedName(workoutsTodayLog[updateIndex]["name"]);
            setUpdatedReps(workoutsTodayLog[updateIndex]["reps"]);
            setUpdatedSets(workoutsTodayLog[updateIndex]["sets"]);
            setUpdatedAmount(workoutsTodayLog[updateIndex]["amount"]);
            if(workoutsTodayLog[updateIndex]["amountType"] == "-1")
                setUpdatedAmountType("none");
            else
                setUpdatedAmountType(workoutsTodayLog[updateIndex]["amountType"]);
        }
    }, [openUpdatePopup]);

    useEffect(() => {
        if(updateSubmit == 1 && updatedName == ""){
            setUpdateMessage("Name Cannot Be Empty");
            setUpdateSubmit(0);
        }
        else if(updateSubmit == 1){
            let updatedWorkoutsToday = workoutsTodayLog.slice();
            updatedWorkoutsToday[updateIndex]["name"] = updatedName;
            updatedWorkoutsToday[updateIndex]["reps"] = updatedReps == "" ? "-1" : updatedReps;
            updatedWorkoutsToday[updateIndex]["sets"] = updatedSets == "" ? "-1" : updatedSets;
            updatedWorkoutsToday[updateIndex]["amount"] = updatedAmount == "" ? "-1" : updatedAmount;
            updatedWorkoutsToday[updateIndex]["amountType"] = updatedAmountType == "none" || updatedAmountType == null || updatedAmount == "" || updatedAmount == "-1" ? "-1" : updatedAmountType;
            updatedWorkoutsToday = updatedWorkoutsToday.reverse();

            setUpdateMessage("");
            setOpenUpdatePopup(0);
            axios
                .post(buildPath("api/updateWorkoutsItem"), {
                    "userId": userId,
                    "date": date,
                    "item": updatedWorkoutsToday,
                    "accessToken": localStorage.getItem('accessToken')
                })
                .then((response)=>{
                    setUpdatedName("");
                    setUpdatedReps("");
                    setUpdatedSets("");
                    setUpdatedAmount("");
                    setUpdatedAmountType("none");

                    if(response["data"]["error"] == ""){
                        setWorkouts(response["data"]["info"]);
                        localStorage.setItem('accessToken', response["data"]["token"]["accessToken"]);
                    }
                    else{
                        setMainErrorMessage(response["data"]["error"]);
                    }
                    setUpdateSubmit(0);
                    setUpdateIndex(-1);
                })
        }
    }, [updateSubmit]);

    useEffect(() => {
        if(deleteIndex != -1){
            let updatedWorkoutsToday = workoutsTodayLog.slice(0, deleteIndex).concat(workoutsTodayLog.slice(deleteIndex+1));
            updatedWorkoutsToday = updatedWorkoutsToday.reverse();
            axios
                .post(buildPath("api/deleteWorkoutsItem"), {
                    "userId": userId,
                    "date": date,
                    "item": updatedWorkoutsToday,
                    "accessToken": localStorage.getItem('accessToken')
                })
                .then((response)=>{
                    if(response["data"]["error"] == ""){
                        setWorkouts(response["data"]["info"]);
                        localStorage.setItem('accessToken', response["data"]["token"]["accessToken"]);
                    }
                    else{
                        setMainErrorMessage(response["data"]["error"]);
                    }
                    setDeleteIndex(-1);
                })
        }
    }, [deleteIndex]);


    if(mainErrorMessage != "")
        return(
            <div>
                <NavDrawer page='exercise' name={firstName + " "+ lastName}/>
                <div className='mainContainer'>
                    {mainErrorMessage}
                </div>
            </div>
        );

    let popOverBackgroundStyle={};
    if(openPopup == 0 && openUpdatePopup == 0)
        popOverBackgroundStyle={display: "none"};

    let popUpContainerStyle = {width: "500px", height: "630px", left: "calc((100vw - 500px) / 2)", top: "calc((100vh - 550px) / 2)"};
    
    let popOverTitleStyle = {}
    if(addMessage == "")
        popOverTitleStyle = {marginBottom: "20px"};

    return (
        <div>
            <NavDrawer page='exercise' name={firstName + " "+ lastName}/>
            <div className='mainContainer'>
                <div className='addNutritionContainer'>
                        <AddWorkoutsMenu onSelect={(popNum) => {setOpenPopup(popNum)}}/>
                </div>
                <div className='dateContainer'>
                    <span className='displayDate'>{displayDate}</span>
                    <div className='datePickerContainer'>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker label="" value={dayjs(date.slice(0,4)+"-"+date.slice(4,6)+"-"+date.slice(6))} 
                                onChange={(newDate) => {
                                    let temp = newDate.year();
                                    let month = newDate.month() + 1;
                                    if(month.toString().length == 1)
                                        month = "0"+month;
                                    temp = temp +""+month;
                                    if(newDate.date().toString().length == 1)
                                        temp = temp + "0"+newDate.date().toString();
                                    else
                                        temp = temp+newDate.date().toString();
                                    setDate(temp);
                                }}/>
                        </LocalizationProvider>
                    </div>
                </div>
                <div className='logContainer'>
                    {workoutsTodayLog.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th className='logTableHeader' style={{width: "20%"}}><span className='logTableHeaderNameSpan'>Name</span></th>
                                    <th className='logTableHeader' style={{width: "15%"}}><span className='logTableHeaderSpan'>Sets</span></th>
                                    <th className='logTableHeader' style={{width: "15%"}}><span className='logTableHeaderSpan'>Reps</span></th>
                                    <th className='logTableHeader' style={{width: "15%"}}><span className='logTableHeaderSpan'>Measurement</span></th>
                                    <th className='logTableHeader' style={{width: "15%"}}><span className='logTableHeaderSpan'>Type</span></th>
                                    <th className='logTableHeader' style={{width: "10%"}}><span className='logTableHeaderSpan'>Time</span></th>
                                    <th className='logTableHeader' style={{width: "10%"}}><span className='logTableHeaderSpan'>Actions</span></th>
                                </tr>
                                
                            </thead>
                            <div className='logTableDivider'></div>
                            <tbody>
                                {workoutsTodayLog.map((element, index) => {
                                    let time = "";
                                    if(element["time"] === "-")
                                        time = "-";
                                    else{
                                        let numTime = Number(element["time"]);
                                        let amPm = "am";
                                        if(numTime > 1159)
                                            amPm = "pm";
                                        if(numTime > 1259){
                                            numTime = numTime - 1200;
                                        }
                                        if(numTime < 60)
                                            numTime = numTime + 1200;
                                        time = numTime.toString().slice(0, -2) + ":" + numTime.toString().slice(-2)+" "+amPm;
                                    }
                                    return(
                                        <tr key={index}>
                                            <td className='logTableData'>
                                                <span className='logTableDataNameSpan'>
                                                    {element["name"]}
                                                </span>
                                            </td>
                                            <td className='logTableData'>
                                                <span className='logTableDataSpan'>
                                                    {element["sets"] != -1 ? element["sets"] : "-"}
                                                </span>
                                            </td>
                                            <td className='logTableData'>
                                                <span className='logTableDataSpan'>
                                                    {element["reps"] != -1 ? element["reps"]: "-"}
                                                </span>
                                            </td>
                                            <td className='logTableData'>
                                                <span className='logTableDataSpan'>
                                                    {element["amount"] != -1 ? element["amount"] : "-"}
                                                </span>
                                            </td>
                                            <td className='logTableData'>
                                                <span className='logTableDataSpan'>
                                                    {element["amountType"] != -1 ? element["amountType"] : "-"}
                                                </span>
                                            </td>
                                            <td className='logTableData'>
                                                <span className='logTableDataSpan'>
                                                    {time}
                                                </span>
                                            </td>
                                            <td className='logTableData'>
                                                <span className='logTableDataActionSpan'>
                                                    <UpdateIcon className='updateIcon' fontSize='medium'
                                                        onClick={() => {
                                                            setUpdateIndex(index);
                                                            setOpenUpdatePopup(1);
                                                        }}
                                                    />
                                                    <DeleteIcon className='deleteIcon' fontSize='medium'
                                                        onClick={() => {
                                                            setDeleteIndex(index);
                                                        }}
                                                    />
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (    
                        "Nothing in Log"
                    )}
                </div>
            </div>
            <div className='popOverContainer' id='popOverContainer' style={popUpContainerStyle}>
                <Popover 
                    anchorEl={document.getElementById('popOverContainer')}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    open={openPopup == 1}
                    onClose={() => {
                        setOpenPopup(0);
                        setAddMessage("");
                        if(addSubmit == 0){
                            setAddName("");
                            setAddReps("");
                            setAddSets("");
                            setAddAmount("");
                            setAddAmountType("none");
                        }
                    }}
                    sx={{zIndex: "9997"}}
                    >
                    <div className='popOver' style={{height: "550px"}}>
                        <div className='popOverTitle'>
                            Add Workout
                        </div>
                        <div className='addMessageContainer'>
                            {addMessage}
                        </div>
                        <div className="addInputContainer" style={{marginTop: '5px'}}>
                            <label className="addLabel" htmlFor="foodItemName">Name*</label>
                            <input className="addInput" name="foodItemName" type="text" placeholder="Enter workout name" onChange={(e)=>{setAddName(e.target.value)}}/>
                        </div>
                        <div className="addInputContainer">
                            <label className="addLabel" htmlFor="foodItemName">Sets</label>
                            <input className="addInput" name="foodItemName" type="number" placeholder="Enter number of sets" onChange={(e)=>{setAddSets(""+e.target.value)}}/>
                        </div>
                        <div className="addInputContainer">
                            <label className="addLabel" htmlFor="foodItemName">Reps</label>
                            <input className="addInput" name="foodItemName" type="number" placeholder="Enter number of reps" onChange={(e)=>{setAddReps(""+e.target.value)}}/>
                        </div>
                        <div className="addInputContainer" style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <div style={{width: "60%", display: "inline-block", height: "100px"}}>
                                <label className="addLabel" htmlFor="foodItemName">Measurement</label>
                                <input className="addInput" name="foodItemName" type="number" placeholder="Enter measurement" onChange={(e)=>{setAddAmount(""+e.target.value)}}/>
                            </div>
                            <div style={{width: "40%", display: "inline-block", height: "100px", marginLeft: "10px"}}>
                                <div style={{display: "flex", alignItems: "center", height: "95%", marginTop: "4%"}}>
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        options={["none", "lbs", "kgs", "hrs", "mins"]}
                                        value={addAmountType}
                                        sx={{ width: 150, bgcolor: "#eee", borderRadius: "5px",
                                            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                                                border: "none"
                                            }
                                        }}
                                        size='small'
                                        renderInput={(params) => <TextField {...params} style={{border: "none"}} label="" />}
                                        onChange={(e, v) => {setAddAmountType(v)}}
                                        componentsProps={{
                                            popper: {
                                              modifiers: [
                                                {
                                                  name: 'flip',
                                                  enabled: false
                                                },
                                                {
                                                   name: 'preventOverflow',
                                                   enabled: false
                                                 }
                                              ]
                                            }
                                          }}
                                        ListboxProps={
                                            {
                                                style:{
                                                    maxHeight: '110px'
                                                }
                                            }
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        <button className="addNutritionButton"
                            style={{width: "200px", marginLeft: "calc((100% - 200px) / 2)", marginTop: "10px"}}
                            onClick={()=>{setAddSubmit(1)}}>
                                Add Workout
                        </button>
                    </div>
                </Popover>

                <Popover 
                    anchorEl={document.getElementById('popOverContainer')}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    open={openUpdatePopup == 1}
                    onClose={() => {
                        setOpenUpdatePopup(0);
                        setUpdateMessage("");
                        setUpdateIndex(-1);
                        if(updateSubmit == 0){
                            setUpdatedName("");
                            setUpdatedSets("");
                            setUpdatedReps("");
                            setUpdatedAmount("");
                            setUpdatedAmountType("none");
                        }
                    }}
                    sx={{zIndex: "9999"}}
                    >
                    <div className='popOver' style={{height: "550px"}}>
                        <div className='popOverTitle'>
                            Update Workout
                        </div>
                        <div className='addMessageContainer'>
                            {updateMessage}
                        </div>
                        <div className="addInputContainer" style={{marginTop: '5px'}}>
                            <label className="addLabel" htmlFor="foodItemName">Name*</label>
                            <input className="addInput" name="foodItemName" type="text" placeholder="Enter workout"
                                value={updatedName}
                                onChange={(e)=>{setUpdatedName(e.target.value)}}
                            />
                        </div>
                        <div className="addInputContainer">
                            <label className="addLabel" htmlFor="foodItemName">Sets</label>
                            <input className="addInput" name="foodItemName" type="number" placeholder="Enter number of sets"
                                value={updatedSets == "-1" ? "" : updatedSets}
                                onChange={(e)=>{setUpdatedSets(""+e.target.value)}}
                            />
                        </div>
                        <div className="addInputContainer">
                            <label className="addLabel" htmlFor="foodItemName">Reps</label>
                            <input className="addInput" name="foodItemName" type="number" placeholder="Enter number of reps" 
                                value={updatedReps == "-1" ? "" : updatedReps}
                                onChange={(e)=>{setUpdatedReps(""+e.target.value)}}
                            />
                        </div>
                        <div className="addInputContainer" style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <div style={{width: "60%", display: "inline-block", height: "100px"}}>
                                <label className="addLabel" htmlFor="foodItemName">Measurement</label>
                                <input className="addInput" name="foodItemName" type="number" placeholder="Enter measurement" 
                                    value={updatedAmount == "-1" ? "" : updatedAmount}
                                    onChange={(e)=>{setUpdatedAmount(""+e.target.value)}}
                                />
                            </div>
                            <div style={{width: "40%", display: "inline-block", height: "100px", marginLeft: "10px"}}>
                                <div style={{display: "flex", alignItems: "center", height: "95%", marginTop: "4%"}}>
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        options={["none", "lbs", "kgs", "hrs", "mins"]}
                                        value={updatedAmountType}
                                        sx={{ width: 150, bgcolor: "#eee", borderRadius: "5px",
                                            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                                                border: "none"
                                            }
                                        }}
                                        size='small'
                                        renderInput={(params) => <TextField {...params} style={{border: "none"}} label="" />}
                                        onChange={(e, v) => {setUpdatedAmountType(v)}}
                                        componentsProps={{
                                            popper: {
                                              modifiers: [
                                                {
                                                  name: 'flip',
                                                  enabled: false
                                                },
                                                {
                                                   name: 'preventOverflow',
                                                   enabled: false
                                                 }
                                              ]
                                            }
                                          }}
                                        ListboxProps={
                                            {
                                                style:{
                                                    maxHeight: '110px'
                                                }
                                            }
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        <button className="addNutritionButton" style={{width: "230px", marginLeft: "calc((100% - 230px) / 2)"}} 
                            onClick={()=>{setUpdateSubmit(1)}}>
                                Update Workout
                        </button>
                    </div>
                </Popover>
            </div>
            <div className='popOverBackground' style={popOverBackgroundStyle}></div>
        </div>
    );
}
