const fs = require("fs");
var mapString = fs.readFileSync("./map.obj").toString("utf-8");
var isStartOfLine = true;
var lineIsVector = false;
var points = [];
var validNumber = ['-', '0','1','2','3','4','5','6','7','8','9','.']
function isValidNumber(character){
    let bool = false;
    for(let i = 0; i < validNumber.length; i++){
        let charCheck = validNumber[i];
        if(charCheck==character){
            bool = true;
            break;
        }
    }
    return bool;
}
let tempPointIndex = -1;
let tempPoint = [];
for(let i = 0; i < mapString.length; i++){
    if(mapString[i]=="\n"){
        isStartOfLine=true;
        continue;
    }
    if(isStartOfLine){
        if(lineIsVector){
            points.push(tempPoint);
            tempPoint = [];
            tempPointIndex = -1;
        }
        if(mapString[i]=="v"){
            lineIsVector = true;
        }else{
            lineIsVector = false;
        }
    }
    if(lineIsVector){
       if(isValidNumber(mapString[i])){
        if(tempPoint[tempPointIndex]==undefined){tempPoint[tempPointIndex]=''}
        tempPoint[tempPointIndex]+=mapString[i];
       }else{
        if(mapString[i]==` `){
            tempPointIndex++
        }
       }
    }
    isStartOfLine = false;
}
let finalString = `[\n`;
for(let i = 0; i < points.length; i++){
    finalString+=`\tnew Vector2(`;
    let point = points[i];
    for(let k = 0; k < point.length;k++){
        if(k==1){continue};
        finalString+=point[k];
        if(k==0){
            finalString+=`, `;
        }
    }
    finalString+=`),\n`
}
finalString+=`]`
console.log(finalString);