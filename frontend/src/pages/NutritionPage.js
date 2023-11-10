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
    let _ud = localStorage.getItem('user_data');
    let ud = JSON.parse(_ud);
    let userId = ud["id"];
    let firstName = ud["firstName"];
    let lastName = ud["lastName"];

    let tracked = ud["tracked"];
    tracked = Object.keys(tracked).sort().reduce(
        (obj, key) => { 
          obj[key] = tracked[key]; 
          return obj;
        }, 
        {}
    );
    let trackedKeys = Object.keys(tracked);

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

    useEffect(() => {
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
        setDate(year+month+day);
        setDisplayDate(numToDay[temp.getDay()]+", "+numToMonth[temp.getMonth()]+" "+temp.getDate()+suffix);

        axios
            .post(buildPath('api/fetchConsumed'), 
                {
                    "userId": userId,
                    "date": (year+month+day)
                })
            .then((response) => {
                if(response["data"]["error"] == "")
                    setConsumed(response["data"]["info"])
            })
    }, []);

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
            
            console.log(consumedToday);
            if(consumedToday.length > 0){
                let consumedTodayDup = consumedToday.slice();
                let consumedTodayOrdered = [];
                let latest = consumedTodayDup[0];
                let latestIndex = 0;
                let length = consumedTodayDup.length;
                for (let i=0; i<length; i++){
                    consumedTodayDup.forEach((element, index) => {
                        if(element["time"] > latest["time"]){
                            latest = element;
                            latestIndex = index;
                        }
                    });
                    consumedTodayOrdered.push(latest);
                    consumedTodayDup.splice(latestIndex, 1);
                    latest = consumedTodayDup[0];
                }
                setConsumedTodayLog(consumedTodayOrdered);
                
            }
        }
    }, [consumed]);

    console.log(consumedTodayLog);
    return (
        <div>
            <NavDrawer />
            <div className='mainContainer'>
                <div className='dateContainer'>
                    <span className='displayDate'>{displayDate}</span>
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
                                                        {tracked[elem]}
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
                    <table>
                        <thead>
                            <tr>
                                <th className='logTableHeader' style={{width: "6%"}}><span className='logTableHeaderSpan'>Type</span></th>
                                <th className='logTableHeader' style={{width: "20%"}}><span className='logTableHeaderNameSpan'>Name</span></th>
                                <th className='logTableHeader' style={{width: "12.8%"}}><span className='logTableHeaderSpan'>Calories</span></th>
                                <th className='logTableHeader' style={{width: "12.8%"}}><span className='logTableHeaderSpan'>Carbs</span></th>
                                <th className='logTableHeader' style={{width: "12.8%"}}><span className='logTableHeaderSpan'>Fat</span></th>
                                <th className='logTableHeader' style={{width: "12.8%"}}><span className='logTableHeaderSpan'>Protein</span></th>
                                <th className='logTableHeader' style={{width: "12.8%"}}><span className='logTableHeaderSpan'>Amount</span></th>
                                <th className='logTableHeader' style={{width: "10%"}}><span className='logTableHeaderSpan'>Time</span></th>
                            </tr>
                            
                        </thead>
                        <div className='logTableDivider'></div>
                        <tbody>
                            {consumedTodayLog.map((element, index) => {
                                let time = "";
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
                                if(element["type"] == "food"){
                                    return(
                                        <tr>
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
                                        </tr>
                                    );
                                }
                                else{
                                    return(
                                        <tr>
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
                                        </tr>
                                    );
                                }
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
