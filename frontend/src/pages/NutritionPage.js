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
import AddNutritionMenu from '../components/AddNutritionMenu.js';
import Popover from '@mui/material/Popover';
import UpdateIcon from '@mui/icons-material/Update';
import DeleteIcon from '@mui/icons-material/Delete';

function LinearProgressWithLabel(props) {
    let value = "";
    if(typeof props.value == "number"){
        return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">
                    {`${Math.round(props.value)}%`}
                </Typography>
            </Box>
        </Box>
        );
    }
    else{
        return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" value="0" sx={{backgroundColor: "#7d7d7d", borderRadius: "5px"}}/>
                </Box>
                <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2" color="text.secondary">
                        -
                    </Typography>
                </Box>
            </Box>
            );
    }
  }

export default function NutritionPage(props){
    let numToDay = {0: "Sunday", 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday"}
    let numToMonth = {0: "January", 1: "February", 2: "March", 3: "April", 4: "May", 5: "June", 6: "July", 7: "August", 8: "September", 9: "October", 10: "November", 11: "December"}

    const [consumed, setConsumed] = useState({});
    const [date, setDate] = useState("");
    const [displayDate, setDisplayDate] = useState("");

    const [curCalories, setCurCalories] = useState(0);
    const [curCarbs, setCurCarbs] = useState(0);
    const [curFat, setCurFat] = useState(0);
    const [curProtein, setCurProtein] = useState(0);
    const [curSteps, setCurSteps] = useState(0);
    const [curWater, setCurWater] = useState(0);
    const [consumedTodayLog, setConsumedTodayLog] = useState([]);

    const [openPopup, setOpenPopup] = useState(0);
    const [tracked, setTracked] = useState({});
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userId, setUserId] = useState(null);

    const [addName, setAddName] = useState("");
    const [addSubmit, setAddSubmit] = useState(0);
    const [addCalories, setAddCalories] = useState("-1");
    const [addCarbs, setAddCarbs] = useState("-1");
    const [addFat, setAddFat] = useState("-1");
    const [addProtein, setAddProtein] = useState("-1");
    const [addAmount, setAddAmount] = useState("");
    const [addMessage, setAddMessage] = useState("");
    
    const [trackedCalories, setTrackedCalories] = useState(null);
    const [trackedCarbs, setTrackedCarbs] = useState(null);
    const [trackedFat, setTrackedFat] = useState(null);
    const [trackedProtein, setTrackedProtein] = useState(null);
    const [trackedSteps, setTrackedSteps] = useState(null);
    const [trackedWater, setTrackedWater] = useState(null);
    const [trackedCaloriesGoal, setTrackedCaloriesGoal] = useState("-1");
    const [trackedCarbsGoal, setTrackedCarbsGoal] = useState("-1");
    const [trackedFatGoal, setTrackedFatGoal] = useState("-1");
    const [trackedProteinGoal, setTrackedProteinGoal] = useState("-1");
    const [trackedStepsGoal, setTrackedStepsGoal] = useState("-1");
    const [trackedWaterGoal, setTrackedWaterGoal] = useState("-1");
    const [mainErrorMessage, setMainErrorMessage] = useState("");

    const [openUpdatePopup, setOpenUpdatePopup] = useState(0);
    const [updateIndex, setUpdateIndex] = useState(-1);
    const [updatedName, setUpdatedName] = useState("");
    const [updatedCalories, setUpdatedCalories] = useState("");
    const [updatedCarbs, setUpdatedCarbs] = useState("");
    const [updatedFat, setUpdatedFat] = useState("");
    const [updatedProtein, setUpdatedProtein] = useState("");
    const [updatedAmount, setUpdatedAmount] = useState("");
    const [updateMessage, setUpdateMessage] = useState("");
    const [updateSubmit, setUpdateSubmit] = useState(0);

    const [deleteIndex, setDeleteIndex] = useState(-1);

    const getTracked = async (userIdTemp) => {
        let trackedTemp = {};
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
                    trackedTemp = response["data"]["info"]["tracked"];
                    localStorage.setItem('accessToken', response["data"]["token"]["accessToken"]);
                }
                else {
                    setMainErrorMessage(response["data"]["error"]);
                }
            });

        trackedTemp = Object.keys(trackedTemp).sort().reduce(
            (obj, key) => { 
            obj[key] = trackedTemp[key]; 
            return obj;
            }, 
            {}
        );
        setTracked(trackedTemp);

        let trackedKeysTemp = Object.keys(trackedTemp);
        setTrackedCalories(trackedKeysTemp.includes("calories"));
        setTrackedCarbs(trackedKeysTemp.includes("carbs"));
        setTrackedFat(trackedKeysTemp.includes("fat"));
        setTrackedProtein(trackedKeysTemp.includes("protein"));
        setTrackedSteps(trackedKeysTemp.includes("steps"));
        setTrackedWater(trackedKeysTemp.includes("water"));

        if(trackedKeysTemp.includes("calories"))
            setTrackedCaloriesGoal(trackedTemp["calories"]);
        if(trackedKeysTemp.includes("carbs"))
            setTrackedCarbsGoal(trackedTemp["carbs"]);
        if(trackedKeysTemp.includes("fat"))
            setTrackedFatGoal(trackedTemp["fat"]);
        if(trackedKeysTemp.includes("protein"))
            setTrackedProteinGoal(trackedTemp["protein"]);
        if(trackedKeysTemp.includes("steps"))
            setTrackedStepsGoal(trackedTemp["steps"]);
        if(trackedKeysTemp.includes("water"))
            setTrackedWaterGoal(trackedTemp["water"]);
    } 

    useEffect(() => {
        let _ud = localStorage.getItem('user_data');
        let ud = JSON.parse(_ud);
        let userIdTemp = ud["id"];
        setUserId(userIdTemp);

        getTracked(userIdTemp);

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
            .post(buildPath('api/fetchConsumed'), 
                {
                    "userId": userIdTemp,
                    "date": (year+month+day),
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
                .post(buildPath('api/fetchConsumed'), 
                    {
                        "userId": userId,
                        "date": date,
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
        }
    }, [date]);

    useEffect(() => {
        let consumedToday = [];
        if(Object.keys(consumed).includes("dates")){
            consumedToday = consumed["dates"][date];
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
            setCurProtein(protein);
            setCurCalories(calories);
            setCurCarbs(carbs);
            setCurFat(fat);
            setCurSteps(steps);
            setCurWater(water);
            
            if(consumedToday.length > 0){
                setConsumedTodayLog(consumedToday.reverse());
            }
            else{
                setConsumedTodayLog([]);
            }
        }
    }, [consumed]);

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
                .post(buildPath("api/addConsumedItem"), {
                    "userId": userId,
                    "date": date,
                    "item": {
                        "time": time,
                        "type": "food",
                        "name": addName,
                        "calories": addCalories == "" ? "-1" : addCalories,
                        "fat": addFat == "" ? "-1" : addFat,
                        "protein": addProtein == "" ? "-1" : addProtein,
                        "carbs": addCarbs == "" ? "-1" : addCarbs
                    },
                    "accessToken": localStorage.getItem('accessToken')
                })
                .then((response)=>{
                    if(response["data"]["error"] == ""){
                        setConsumed(response["data"]["info"]);
                        localStorage.setItem('accessToken', response["data"]["token"]["accessToken"]);
                    }
                    else{
                        setMainErrorMessage(response["data"]["error"]);
                    }
                    setAddName("");
                    setAddCalories("-1");
                    setAddFat("-1");
                    setAddCarbs("-1");
                    setAddProtein("-1");
                    setAddSubmit(0);
                })
        }

        if(addSubmit == 2 && addAmount == ""){
            setAddMessage("Amount Cannot Be Empty");
            setAddSubmit(0);
        }
        else if(addSubmit == 2){
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
                .post(buildPath("api/addConsumedItem"), {
                    "userId": userId,
                    "date": date,
                    "item": {
                        "time": time,
                        "type": "water",
                        "amount": addAmount
                    },
                    "accessToken": localStorage.getItem('accessToken')
                })
                .then((response)=>{
                    if(response["data"]["error"] == ""){
                        setConsumed(response["data"]["info"]);
                        localStorage.setItem('accessToken', response["data"]["token"]["accessToken"]);
                    }
                    else{
                        setMainErrorMessage(response["data"]["error"]);
                    }
                    setAddAmount("");
                    setAddSubmit(0);
                })
        }

        if(addSubmit == 3 && addAmount == ""){
            setAddMessage("Amount Cannot Be Empty");
            setAddSubmit(0);
        }
        else if(addSubmit == 3){
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
                .post(buildPath("api/addConsumedItem"), {
                    "userId": userId,
                    "date": date,
                    "item": {
                        "time": time,
                        "type": "steps",
                        "amount": addAmount
                    },
                    "accessToken": localStorage.getItem('accessToken')
                })
                .then((response)=>{
                    if(response["data"]["error"] == ""){
                        setConsumed(response["data"]["info"]);
                        localStorage.setItem('accessToken', response["data"]["token"]["accessToken"]);
                    }
                    else{
                        setMainErrorMessage(response["data"]["error"]);
                    }
                    setAddAmount("");
                    setAddSubmit(0);
                })
        }

        if(addSubmit == 4){
            if(!trackedCalories && trackedCaloriesGoal != "-1" && trackedCaloriesGoal != ""){
                setAddMessage("Must Track Calories To Add Goal");
                setAddSubmit(0);
            }
            else if(!trackedCarbs && trackedCarbsGoal != "-1" && trackedCarbsGoal != ""){
                setAddMessage("Must Track Carbs To Add Goal");
                setAddSubmit(0);
            }
            else if(!trackedFat && trackedFatGoal != "-1" && trackedFatGoal != ""){
                setAddMessage("Must Track Fat To Add Goal");
                setAddSubmit(0);
            }
            else if(!trackedProtein && trackedProteinGoal != "-1" && trackedProteinGoal != ""){
                setAddMessage("Must Track Protein To Add Goal");
                setAddSubmit(0);
            }
            else if(!trackedSteps && trackedStepsGoal != "-1" && trackedStepsGoal != ""){
                setAddMessage("Must Track Steps To Add Goal");
                setAddSubmit(0);
            }
            else if(!trackedWater && trackedWaterGoal != "-1" && trackedWaterGoal != ""){
                setAddMessage("Must Track Water To Add Goal");
                setAddSubmit(0);
            }
            else{
                let newTracked = {};
                if(trackedCalories)
                    newTracked["calories"] = (trackedCaloriesGoal != "") ? trackedCaloriesGoal : "-1";
                if(trackedCarbs)
                    newTracked["carbs"] = (trackedCarbsGoal != "") ? trackedCarbsGoal : "-1";
                if(trackedFat)
                    newTracked["fat"] = (trackedFatGoal != "") ? trackedFatGoal : "-1";
                if(trackedProtein)
                    newTracked["protein"] = (trackedProteinGoal != "") ? trackedProteinGoal : "-1";
                if(trackedSteps)
                    newTracked["steps"] = (trackedStepsGoal != "") ? trackedStepsGoal : "-1";
                if(trackedWater)
                    newTracked["water"] = (trackedWaterGoal != "") ? trackedWaterGoal : "-1";

                setAddMessage("");
                setOpenPopup(0);
                axios
                    .post(buildPath("api/updateTracked"), {
                        "userId": userId,
                        "tracked": newTracked,
                        "accessToken": localStorage.getItem('accessToken')
                    })
                    .then((response)=>{
                        if(trackedCaloriesGoal == "")
                            setTrackedCaloriesGoal("-1");
                        if(trackedCarbsGoal == "")
                            setTrackedCarbsGoal("-1");
                        if(trackedFatGoal == "")
                            setTrackedFatGoal("-1");
                        if(trackedProteinGoal == "")
                            setTrackedProteinGoal("-1");
                        if(trackedStepsGoal == "")
                            setTrackedStepsGoal("-1");
                        if(trackedWaterGoal == "")
                            setTrackedWaterGoal("-1");

                        if(response["data"]["error"] == ""){
                            setTracked(newTracked);
                            localStorage.setItem('accessToken', response["data"]["token"]["accessToken"]);
                        }
                        else{
                            setMainErrorMessage(response["data"]["error"]);
                        }
                        setAddSubmit(0);
                    })
            }
        }
    }, [addSubmit]);

    useEffect(() => {
        if(openUpdatePopup == 1){
            setUpdatedName(consumedTodayLog[updateIndex]["name"]);
            setUpdatedCalories(consumedTodayLog[updateIndex]["calories"]);
            setUpdatedCarbs(consumedTodayLog[updateIndex]["carbs"]);
            setUpdatedFat(consumedTodayLog[updateIndex]["fat"]);
            setUpdatedProtein(consumedTodayLog[updateIndex]["protein"]);
        }
        else if(openUpdatePopup == 2 || openUpdatePopup == 3){
            setUpdatedAmount(consumedTodayLog[updateIndex]["amount"]);
        }
    }, [openUpdatePopup]);

    useEffect(() => {
        if(updateSubmit == 1 && updatedName == ""){
            setUpdateMessage("Name Cannot Be Empty");
            setUpdateSubmit(0);
        }
        else if(updateSubmit == 1){
            let updatedConsumedToday = consumedTodayLog.slice();
            updatedConsumedToday[updateIndex]["name"] = updatedName;
            updatedConsumedToday[updateIndex]["calories"] = updatedCalories == "" ? "-1" : updatedCalories;
            updatedConsumedToday[updateIndex]["carbs"] = updatedCarbs == "" ? "-1" : updatedCarbs;
            updatedConsumedToday[updateIndex]["fat"] = updatedFat == "" ? "-1" : updatedFat;
            updatedConsumedToday[updateIndex]["protein"] = updatedProtein == "" ? "-1" : updatedProtein;
            updatedConsumedToday = updatedConsumedToday.reverse();

            setUpdateMessage("");
            setOpenUpdatePopup(0);
            axios
                .post(buildPath("api/updateConsumedItem"), {
                    "userId": userId,
                    "date": date,
                    "item": updatedConsumedToday,
                    "accessToken": localStorage.getItem('accessToken')
                })
                .then((response)=>{
                    setUpdatedName("");
                    setUpdatedCalories("");
                    setUpdatedCarbs("");
                    setUpdatedFat("");
                    setUpdatedProtein("");

                    if(response["data"]["error"] == ""){
                        setConsumed(response["data"]["info"]);
                        localStorage.setItem('accessToken', response["data"]["token"]["accessToken"]);
                    }
                    else{
                        setMainErrorMessage(response["data"]["error"]);
                    }
                    setUpdateSubmit(0);
                    setUpdateIndex(-1);
                })
        }

        if(updateSubmit == 2 && updatedAmount == ""){
            setUpdateMessage("Amount Cannot Be Empty");
            setUpdateSubmit(0);
        }
        else if(updateSubmit == 2){
            let updatedConsumedToday = consumedTodayLog.slice();
            updatedConsumedToday[updateIndex]["amount"] = updatedAmount;
            updatedConsumedToday = updatedConsumedToday.reverse();

            setUpdateMessage("");
            setOpenUpdatePopup(0);
            axios
                .post(buildPath("api/updateConsumedItem"), {
                    "userId": userId,
                    "date": date,
                    "item": updatedConsumedToday,
                    "accessToken": localStorage.getItem('accessToken')
                })
                .then((response)=>{
                    setUpdatedAmount("");
                    if(response["data"]["error"] == ""){
                        setConsumed(response["data"]["info"]);
                        localStorage.setItem('accessToken', response["data"]["token"]["accessToken"]);
                    }
                    else{
                        setMainErrorMessage(response["data"]["error"]);
                    }
                    setUpdateSubmit(0);
                    setUpdateIndex(-1);
                })
        }

        if(updateSubmit == 3 && updatedAmount == ""){
            setUpdateMessage("Amount Cannot Be Empty");
            setUpdateSubmit(0);
        }
        else if(updateSubmit == 3){
            let updatedConsumedToday = consumedTodayLog.slice();
            updatedConsumedToday[updateIndex]["amount"] = updatedAmount;
            updatedConsumedToday = updatedConsumedToday.reverse();

            setUpdateMessage("");
            setOpenUpdatePopup(0);
            axios
                .post(buildPath("api/updateConsumedItem"), {
                    "userId": userId,
                    "date": date,
                    "item": updatedConsumedToday,
                    "accessToken": localStorage.getItem('accessToken')
                })
                .then((response)=>{
                    setUpdatedAmount("");
                    if(response["data"]["error"] == ""){
                        setConsumed(response["data"]["info"]);
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
            let updatedConsumedToday = consumedTodayLog.slice(0, deleteIndex).concat(consumedTodayLog.slice(deleteIndex+1));
            updatedConsumedToday = updatedConsumedToday.reverse();
            axios
                .post(buildPath("api/deleteConsumedItem"), {
                    "userId": userId,
                    "date": date,
                    "item": updatedConsumedToday,
                    "accessToken": localStorage.getItem('accessToken')
                })
                .then((response)=>{
                    if(response["data"]["error"] == ""){
                        setConsumed(response["data"]["info"]);
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
                <NavDrawer page='nutrition' name={firstName + " "+ lastName}/>
                <div className='mainContainer'>
                    {mainErrorMessage}
                </div>
            </div>
        );

    let popOverBackgroundStyle={};
    if(openPopup == 0 && openUpdatePopup == 0)
        popOverBackgroundStyle={display: "none"};

    let popUpContainerStyle = {width: "500px", height: "630px", left: "calc((100vw - 500px) / 2)", top: "calc((100vh - 630px) / 2)"};
    if(openPopup == 2 || openPopup == 3 || openUpdatePopup == 2 || openUpdatePopup == 3)
        popUpContainerStyle = {width: "500px", height: "630px", left: "calc((100vw - 500px) / 2)", top: "calc((100vh - 380px) / 2)"};
    else if(openPopup == 4)
        popUpContainerStyle = {width: "500px", height: "630px", left: "calc((100vw - 600px) / 2)", top: "calc((100vh - 600px) / 2)"};
    
    let popOverTitleStyle = {}
    if(addMessage == "")
        popOverTitleStyle = {marginBottom: "20px"};

    let trackedKeys = Object.keys(tracked);
    return (
        <div>
            <NavDrawer page='nutrition' name={firstName + " "+ lastName}/>
            <div className='mainContainer'>
                <div className='addNutritionContainer'>
                        <AddNutritionMenu onSelect={(popNum) => {setOpenPopup(popNum)}}/>
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
                <div className='progressContainer'>
                    {trackedKeys.length > 0 ? (
                        <table>
                            <thead>
                                <tr className="progressTableHeaderRow">
                                    <th className="progressTableHeader"><span className='progressTableHeaderSpan'>Metric</span></th>
                                    <th className="progressTableHeader"><span className='progressTableHeaderSpan'>Current</span></th>
                                    <th className="progressTableHeader"><span className='progressTableHeaderSpan'>Goal</span></th>
                                </tr>
                            </thead>
                            <div className='progressTableDivider'></div>
                            <tbody>
                                {trackedKeys.map((elem, index) => {
                                    let current = elem == "calories" ? curCalories : elem == "carbs" ? curCarbs : elem == "fat" ? curFat : elem == "protein" ? curProtein : elem == "steps" ? curSteps : curWater;
                                    let barColor = elem == "calories" ? "#CA00F7DD" : elem == "carbs" ? "#00EBF7FF" : elem == "fat" ? "#00F756FF" : elem == "protein" ? "#F7EF00FF" : elem == "steps" ? "#F78400FF" : "#1976d2";
                                    let backColor = elem == "calories" ? "#CA00F730" : elem == "carbs" ? "#00EBF730" : elem == "fat" ? "#00F75630" : elem == "protein" ? "#F7EF0040" : elem == "steps" ? "#F7840030" : "#a7caed";
                                    let label = elem.charAt(0).toUpperCase()+""+elem.slice(1);
                                    if(tracked[elem] != -1){
                                        let progress = (current/tracked[elem]) * 100; 
                                        if(progress > 100)
                                            progress = 100;
                                        return(
                                            <tr className='trackedContainer' key={index}>
                                                <td className='progressTableMetricsData'>
                                                    {label}
                                                    <LinearProgressWithLabel value={progress} sx={{borderRadius: "5px", backgroundColor: backColor, '& .MuiLinearProgress-bar': {backgroundColor: barColor}}} />
                                                </td>
                                                <td className='progressTableCurrentData'>
                                                    <span className='progressTableCurrentDataSpan'>
                                                        {elem == "calories" ? curCalories+" cals" : elem == "carbs" ? curCarbs+"g" : elem == "fat" ? curFat+"g" : elem == "protein" ? curProtein+"g" : elem == "steps" ? curSteps+" steps" : curWater+"ml"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className='progressTableGoalDataSpan'>
                                                        {elem == "calories" ? tracked[elem]+" cals" : elem == "carbs" ? tracked[elem]+"g" : elem == "fat" ? tracked[elem]+"g" : elem == "protein" ? tracked[elem]+"g" : elem == "steps" ? tracked[elem]+" steps" : tracked[elem]+"ml"}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    }
                                    else{
                                        return(
                                            <tr className='trackedContainer' key={index}>
                                                <td className='progressTableMetricsData'>
                                                    {label}
                                                    <LinearProgressWithLabel value={"-"} />
                                                </td>
                                                <td className='progressTableCurrentData'>
                                                    <span className='progressTableCurrentDataSpan'>
                                                        {elem == "calories" ? curCalories+" cals" : elem == "carbs" ? curCarbs+"g" : elem == "fat" ? curFat+"g" : elem == "protein" ? curProtein+"g" : elem == "steps" ? curSteps+" steps" : curWater+"ml"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className='progressTableGoalDataSpan'>
                                                        -
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    }
                                })}
                            </tbody>
                        </table> 
                    ) : (
                        "No Tracked Metrics"
                    )}
                </div>
                <div className='logContainer'>
                    {consumedTodayLog.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th className='logTableHeader' style={{width: "8%"}}><span className='logTableHeaderSpan'>Type</span></th>
                                    <th className='logTableHeader' style={{width: "18%"}}><span className='logTableHeaderNameSpan'>Name</span></th>
                                    <th className='logTableHeader' style={{width: "11%"}}><span className='logTableHeaderSpan'>Calories</span></th>
                                    <th className='logTableHeader' style={{width: "11%"}}><span className='logTableHeaderSpan'>Carbs</span></th>
                                    <th className='logTableHeader' style={{width: "11%"}}><span className='logTableHeaderSpan'>Fat</span></th>
                                    <th className='logTableHeader' style={{width: "11%"}}><span className='logTableHeaderSpan'>Protein</span></th>
                                    <th className='logTableHeader' style={{width: "11%"}}><span className='logTableHeaderSpan'>Amount</span></th>
                                    <th className='logTableHeader' style={{width: "11%"}}><span className='logTableHeaderSpan'>Time</span></th>
                                    <th className='logTableHeader' style={{width: "8%"}}><span className='logTableHeaderSpan'>Actions</span></th>
                                </tr>
                                
                            </thead>
                            <div className='logTableDivider'></div>
                            <tbody>
                                {consumedTodayLog.map((element, index) => {
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
                                    if(element["type"] == "food"){
                                        return(
                                            <tr key={index}>
                                                <td className='logTableData'>
                                                    <span className='logTableDataTypeSpan'>
                                                        <LunchDiningIcon fontSize="large" sx={{ color: "#757575" }}/>
                                                    </span>
                                                </td>
                                                <td className='logTableData'>
                                                    <span className='logTableDataNameSpan'>
                                                        {element["name"]}
                                                    </span>
                                                </td>
                                                <td className='logTableData'>
                                                    <span className='logTableDataSpan'>
                                                        {element["calories"] != -1 ? element["calories"]+" cals" : "-"}
                                                    </span>
                                                </td>
                                                <td className='logTableData'>
                                                    <span className='logTableDataSpan'>
                                                        {element["carbs"] != -1 ? element["carbs"]+"g" : "-"}
                                                    </span>
                                                </td>
                                                <td className='logTableData'>
                                                    <span className='logTableDataSpan'>
                                                        {element["fat"] != -1 ? element["fat"]+"g" : "-"}
                                                    </span>
                                                </td>
                                                <td className='logTableData'>
                                                    <span className='logTableDataSpan'>
                                                        {element["protein"] != -1 ? element["protein"]+"g" : "-"}
                                                    </span>
                                                </td>
                                                <td className='logTableData'><span className='logTableDataSpan'>-</span></td>
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
                                    }
                                    else{
                                        return(
                                            <tr key={index}>
                                                <td className='logTableData'>
                                                    <span className='logTableDataTypeSpan'>
                                                        {element["type"] == "water" ? <WaterDropIcon fontSize='large' sx={{ color: "#757575" }}/> : <DirectionsRunIcon fontSize='large' sx={{ color: "#757575" }}/> }
                                                    </span>
                                                </td>
                                                <td className='logTableData'>
                                                    <span className='logTableDataNameSpan'>
                                                        {element["type"].slice(0, 1).toUpperCase()+element["type"].slice(1)}
                                                    </span>
                                                </td>
                                                <td className='logTableData'><span className='logTableDataSpan'>-</span></td>
                                                <td className='logTableData'><span className='logTableDataSpan'>-</span></td>
                                                <td className='logTableData'><span className='logTableDataSpan'>-</span></td>
                                                <td className='logTableData'><span className='logTableDataSpan'>-</span></td>
                                                <td className='logTableData'>
                                                    <span className='logTableDataSpan'>
                                                        {element["type"] == "water" ? element["amount"] + "ml" : element["amount"]+" steps"}
                                                    </span>
                                                </td>
                                                <td className='logTableData'><span className='logTableDataSpan'>{time}</span></td>
                                                <td className='logTableData'>
                                                    <span className='logTableDataActionSpan'>
                                                        <UpdateIcon className='updateIcon' fontSize='medium'
                                                            onClick={() => {
                                                                setUpdateIndex(index);
                                                                if(element["type"] == "water")
                                                                    setOpenUpdatePopup(2);
                                                                else
                                                                    setOpenUpdatePopup(3);
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
                                    }
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
                            setAddCalories("-1");
                            setAddFat("-1");
                            setAddCarbs("-1");
                            setAddProtein("-1");
                        }
                    }}
                    sx={{zIndex: "9999"}}
                    >
                    <div className='popOver'>
                        <div className='popOverTitle'>
                            Add Food Item
                        </div>
                        <div className='addMessageContainer'>
                            {addMessage}
                        </div>
                        <div className="addInputContainer" style={{marginTop: '5px'}}>
                            <label className="addLabel" htmlFor="foodItemName">Name*</label>
                            <input className="addInput" name="foodItemName" type="text" placeholder="Enter name" onChange={(e)=>{setAddName(e.target.value)}}/>
                        </div>
                        <div className="addInputContainer">
                            <label className="addLabel" htmlFor="foodItemName">Calories</label>
                            <input className="addInput" name="foodItemName" type="number" placeholder="Enter calories" onChange={(e)=>{setAddCalories(""+e.target.value)}}/>
                        </div>
                        <div className="addInputContainer">
                            <label className="addLabel" htmlFor="foodItemName">Carbs (g)</label>
                            <input className="addInput" name="foodItemName" type="number" placeholder="Enter carbs" onChange={(e)=>{setAddCarbs(""+e.target.value)}}/>
                        </div>
                        <div className="addInputContainer">
                            <label className="addLabel" htmlFor="foodItemName">Fat (g)</label>
                            <input className="addInput" name="foodItemName" type="number" placeholder="Enter fat" onChange={(e)=>{setAddFat(""+e.target.value)}}/>
                        </div>
                        <div className="addInputContainer">
                            <label className="addLabel" htmlFor="foodItemName">Protein (g)</label>
                            <input className="addInput" name="foodItemName" type="number" placeholder="Enter protein" onChange={(e)=>{setAddProtein(""+e.target.value)}}/>
                        </div>
                        <button className="addNutritionButton" onClick={()=>{setAddSubmit(1)}}>Add Food</button>
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
                    open={openPopup == 2}
                    onClose={() => {
                        setOpenPopup(0);
                        setAddMessage("");
                        if(addSubmit == 0){
                            setAddAmount("");
                        }
                    }}
                    sx={{zIndex: "9999"}}
                    >
                    <div className='popOverWater'>
                        <div className='popOverTitle'>
                            Add Water
                        </div>
                        <div className='addMessageContainer'>
                            {addMessage}
                        </div>
                        <div className="addInputContainer" style={{marginTop: '5px'}}>
                            <label className="addLabel" htmlFor="foodItemName">Amount (ml)*</label>
                            <input className="addInput" name="foodItemName" type="number" placeholder="Enter amount" onChange={(e)=>{setAddAmount(""+e.target.value)}}/>
                        </div>
                        <button className="addNutritionButton addWaterButton" onClick={()=>{setAddSubmit(2)}}>Add Water</button>
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
                    open={openPopup == 3}
                    onClose={() => {
                        setOpenPopup(0);
                        setAddMessage("");
                        if(addSubmit == 0){
                            setAddAmount("");
                        }
                    }}
                    sx={{zIndex: "9999"}}
                    >
                    <div className='popOverWater'>
                        <div className='popOverTitle'>
                            Add Steps
                        </div>
                        <div className='addMessageContainer'>
                            {addMessage}
                        </div>
                        <div className="addInputContainer" style={{marginTop: '5px'}}>
                            <label className="addLabel" htmlFor="foodItemName">Amount*</label>
                            <input className="addInput" name="foodItemName" type="number" placeholder="Enter amount" onChange={(e)=>{setAddAmount(""+e.target.value)}}/>
                        </div>
                        <button className="addNutritionButton addWaterButton" onClick={()=>{setAddSubmit(3)}}>Add Steps</button>
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
                    open={openPopup == 4}
                    onClose={() => {
                        setOpenPopup(0);
                        setAddMessage("");
                        setTrackedCalories(trackedKeys.includes("calories"));
                        setTrackedCarbs(trackedKeys.includes("carbs"));
                        setTrackedFat(trackedKeys.includes("fat"));
                        setTrackedProtein(trackedKeys.includes("protein"));
                        setTrackedSteps(trackedKeys.includes("steps"));
                        setTrackedWater(trackedKeys.includes("water"));

                        if(trackedKeys.includes("calories"))
                            setTrackedCaloriesGoal(tracked["calories"]);
                        else
                            setTrackedCaloriesGoal("-1");
                        if(trackedKeys.includes("carbs"))
                            setTrackedCarbsGoal(tracked["carbs"]);
                        else
                            setTrackedCarbsGoal("-1");
                        if(trackedKeys.includes("fat"))
                            setTrackedFatGoal(tracked["fat"]);
                        else
                            setTrackedFatGoal("-1");
                        if(trackedKeys.includes("protein"))
                            setTrackedProteinGoal(tracked["protein"]);
                        else
                            setTrackedProteinGoal("-1");
                        if(trackedKeys.includes("steps"))
                            setTrackedStepsGoal(tracked["steps"]);
                        else
                            setTrackedStepsGoal("-1");
                        if(trackedKeys.includes("water"))
                            setTrackedWaterGoal(tracked["water"]);
                        else
                            setTrackedWaterGoal("-1");
                    }}
                    sx={{zIndex: "9999"}}
                    >
                    <div className='popOverMTG'>
                        <div className='popOverTitle' style={popOverTitleStyle}>
                            Modify Trackers and Goals
                        </div>
                        <div className='addMessageContainer' style={{fontSize: "18px"}}>
                            {addMessage}
                        </div>
                        <table className='mtgTable'>
                            <thead>
                                <tr>
                                    <th style={{width: "10%"}}>Select</th>
                                    <th style={{width: "30%"}}>Tracker</th>
                                    <th>Goal</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className='mtgTableBodyRow'>
                                    <td className='mtgTableSelectData'><input type='checkbox' checked={trackedCalories}
                                        onChange={(e)=>{setTrackedCalories(!trackedCalories)}}
                                    /></td>
                                    <td className='mtgTableTrackerData'>Calories</td>
                                    <td className='mtgTableGoalData'><input className="addInput" type="number" placeholder="Add calorie goal" 
                                        value={trackedCaloriesGoal != "-1" ? trackedCaloriesGoal : ""}
                                        onChange={(e)=>{setTrackedCaloriesGoal(""+e.target.value)}}
                                    /></td>
                                </tr>
                                <tr className='mtgTableBodyRow'>
                                    <td className='mtgTableSelectData'><input type='checkbox' checked={trackedCarbs}
                                        onChange={(e)=>{setTrackedCarbs(!trackedCarbs)}}
                                    /></td>
                                    <td className='mtgTableTrackerData'>Carbs (g)</td>
                                    <td className='mtgTableGoalData'><input className="addInput" type="number" placeholder="Add carb goal" 
                                        value={trackedCarbsGoal != "-1" ? trackedCarbsGoal : ""}
                                        onChange={(e)=>{setTrackedCarbsGoal(""+e.target.value)}}
                                    /></td>
                                </tr>
                                <tr className='mtgTableBodyRow'>
                                    <td className='mtgTableSelectData'><input type='checkbox' checked={trackedFat}
                                        onChange={(e)=>{setTrackedFat(!trackedFat)}}
                                    /></td>
                                    <td className='mtgTableTrackerData'>Fat (g)</td>
                                    <td className='mtgTableGoalData'><input className="addInput" type="number" placeholder="Add fat goal" 
                                        value={trackedFatGoal != "-1" ? trackedFatGoal : ""}
                                        onChange={(e)=>{setTrackedFatGoal(""+e.target.value)}}
                                    /></td>
                                </tr>
                                <tr className='mtgTableBodyRow'>
                                    <td className='mtgTableSelectData'><input type='checkbox' checked={trackedProtein}
                                        onChange={(e)=>{setTrackedProtein(!trackedProtein)}}
                                    /></td>
                                    <td className='mtgTableTrackerData'>Protein (g)</td>
                                    <td className='mtgTableGoalData'><input className="addInput" type="number" placeholder="Add protein goal" 
                                        value={trackedProteinGoal != "-1" ? trackedProteinGoal : ""}
                                        onChange={(e)=>{setTrackedProteinGoal(""+e.target.value)}}
                                    /></td>
                                </tr>
                                <tr className='mtgTableBodyRow'>
                                    <td className='mtgTableSelectData'><input type='checkbox' checked={trackedSteps}
                                        onChange={(e)=>{setTrackedSteps(!trackedSteps)}}
                                    /></td>
                                    <td className='mtgTableTrackerData'>Steps</td>
                                    <td className='mtgTableGoalData'><input className="addInput" type="number" placeholder="Add step goal" 
                                        value={trackedStepsGoal != "-1" ? trackedStepsGoal : ""} 
                                        onChange={(e)=>{setTrackedStepsGoal(""+e.target.value)}}
                                    /></td>
                                </tr>
                                <tr className='mtgTableBodyRow'>
                                    <td className='mtgTableSelectData'><input type='checkbox' checked={trackedWater}
                                        onChange={(e)=>{setTrackedWater(!trackedWater)}}
                                    /></td>
                                    <td className='mtgTableTrackerData'>Water (ml)</td>
                                    <td className='mtgTableGoalData'><input className="addInput" type="number" placeholder="Add water goal" 
                                        value={trackedWaterGoal != "-1" ? trackedWaterGoal : ""}
                                        onChange={(e)=>{setTrackedWaterGoal(""+e.target.value)}}
                                    /></td>
                                </tr>
                            </tbody>
                        </table>
                        <button className="addNutritionButton" onClick={()=>{setAddSubmit(4)}}>Update</button>
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
                            setUpdatedCalories("");
                            setUpdatedFat("");
                            setUpdatedCarbs("");
                            setUpdatedProtein("");
                        }
                    }}
                    sx={{zIndex: "9999"}}
                    >
                    <div className='popOver'>
                        <div className='popOverTitle'>
                            Update Food Item
                        </div>
                        <div className='addMessageContainer'>
                            {updateMessage}
                        </div>
                        <div className="addInputContainer" style={{marginTop: '5px'}}>
                            <label className="addLabel" htmlFor="foodItemName">Name*</label>
                            <input className="addInput" name="foodItemName" type="text" placeholder="Enter name"
                                value={updatedName}
                                onChange={(e)=>{setUpdatedName(e.target.value)}}
                            />
                        </div>
                        <div className="addInputContainer">
                            <label className="addLabel" htmlFor="foodItemName">Calories</label>
                            <input className="addInput" name="foodItemName" type="number" placeholder="Enter calories"
                                value={updatedCalories == "-1" ? "" : updatedCalories}
                                onChange={(e)=>{setUpdatedCalories(""+e.target.value)}}
                            />
                        </div>
                        <div className="addInputContainer">
                            <label className="addLabel" htmlFor="foodItemName">Carbs (g)</label>
                            <input className="addInput" name="foodItemName" type="number" placeholder="Enter carbs" 
                                value={updatedCarbs == "-1" ? "" : updatedCarbs}
                                onChange={(e)=>{setUpdatedCarbs(""+e.target.value)}}
                            />
                        </div>
                        <div className="addInputContainer">
                            <label className="addLabel" htmlFor="foodItemName">Fat (g)</label>
                            <input className="addInput" name="foodItemName" type="number" placeholder="Enter fat"
                                value={updatedFat == "-1" ? "" : updatedFat}
                                onChange={(e)=>{setUpdatedFat(""+e.target.value)}}
                            />
                        </div>
                        <div className="addInputContainer">
                            <label className="addLabel" htmlFor="foodItemName">Protein (g)</label>
                            <input className="addInput" name="foodItemName" type="number" placeholder="Enter protein"
                                value={updatedProtein == "-1" ? "" : updatedProtein} 
                                onChange={(e)=>{setUpdatedProtein(""+e.target.value)}}
                            />
                        </div>
                        <button className="addNutritionButton" style={{width: "200px", marginLeft: "calc((100% - 200px) / 2)"}} 
                            onClick={()=>{setUpdateSubmit(1)}}>
                                Update Food
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
                    open={openUpdatePopup == 2}
                    onClose={() => {
                        setOpenUpdatePopup(0);
                        setUpdateMessage("");
                        setUpdateIndex(-1);
                        if(updateSubmit == 0){
                            setUpdatedAmount("");
                        }
                    }}
                    sx={{zIndex: "9999"}}
                    >
                    <div className='popOverWater'>
                        <div className='popOverTitle'>
                            Update Water
                        </div>
                        <div className='addMessageContainer'>
                            {updateMessage}
                        </div>
                        <div className="addInputContainer" style={{marginTop: '5px'}}>
                            <label className="addLabel" htmlFor="foodItemName">Amount (ml)*</label>
                            <input className="addInput" name="foodItemName" type="number" placeholder="Enter amount" 
                                value={updatedAmount}
                                onChange={(e)=>{setUpdatedAmount(""+e.target.value)}}
                            />
                        </div>
                        <button className="addNutritionButton addWaterButton" 
                            style={{width: "250px", marginLeft: "calc((100% - 250px) / 2)"}}
                            onClick={()=>{setUpdateSubmit(2)}}>
                                Update Water
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
                    open={openUpdatePopup == 3}
                    onClose={() => {
                        setOpenUpdatePopup(0);
                        setUpdateIndex(-1);
                        setUpdateMessage("");
                        if(updateSubmit == 0){
                            setUpdatedAmount("");
                        }
                    }}
                    sx={{zIndex: "9999"}}
                    >
                    <div className='popOverWater'>
                        <div className='popOverTitle'>
                            Update Steps
                        </div>
                        <div className='addMessageContainer'>
                            {updateMessage}
                        </div>
                        <div className="addInputContainer" style={{marginTop: '5px'}}>
                            <label className="addLabel" htmlFor="foodItemName">Amount*</label>
                            <input className="addInput" name="foodItemName" type="number" placeholder="Enter amount"
                                value={updatedAmount}
                                onChange={(e)=>{setUpdatedAmount(""+e.target.value)}}
                            />
                        </div>
                        <button className="addNutritionButton addWaterButton" 
                            style={{width: "250px", marginLeft: "calc((100% - 250px) / 2)"}}
                            onClick={()=>{setUpdateSubmit(3)}}>
                                Update Steps
                        </button>
                    </div>
                </Popover>
            </div>
            <div className='popOverBackground' style={popOverBackgroundStyle}></div>
        </div>
    );
}
