// Add Select Column IDs = this.sDefaultId + this.iSelectCounter
// Add Where conditions = wherecond + this.iWhereCounter
// ODiv IDs = "line"+this.iSelectCounter
// Add Button IDs = "button"+this.iSelectCounter
// Remove Button IDs = "buttonrem"+this.iSelectCounter


// On page load it will first generate the initial select and the where clause add condition
function onInit(){
    this.sDefaultId = "SelectElement";
    this.sWDefaultId = "WhereElement";
    this.iSelectCounter = 0; //select clauses
    this.iWhereCounter = 0; // where conditions
    this.iSelectBoxId = []; // select clauses id
    this.iWhereOptId = []; // where cond id
    this.iSelectButtonId = []; // add select button id
    this.iRemoveButtonId = []; // remove select button id
    this.iWhereButtonId = []; // add where button id
    this.iWhereButtonRemId = []; // remove where button id
    this.iTextBoxId = []; // subobject box id
    this.iOperatorId = []; // operator id

    // Generate initial selection criteria
    generateObjectDiv(1);
    generateWhereDiv(true);
}

// Generate the select column dropdown
function generateSelect(onInit){
   if(onInit == 1 && iSelectBoxId.length == 0){
        var aColumns = ["*","anonymousid","context","integrations","messageid","receivedat","timestamp","sentat","originaltimestamp","type","userid","traits","event","properties","name","groupid","previousid"];
    }
    else{
        var aColumns = ["anonymousid","context","integrations","messageid","receivedat","timestamp","sentat","originaltimestamp","type","userid","traits","event","properties","name","groupid","previousid"];
    }

    var oSelect = document.createElement("select");
    oSelect.setAttribute("id",this.sDefaultId + this.iSelectCounter);
    oSelect.setAttribute("style","margin:5px;");
    oSelect.setAttribute("onchange", "onSelectChange(this)");
    iSelectBoxId.push(this.sDefaultId + this.iSelectCounter); 

    aColumns.forEach(function(sText){
        var oOption = document.createElement("option");
        oOption.appendChild(document.createTextNode(sText));
        oOption.setAttribute("value",sText);
        oSelect.appendChild(oOption);
    });

    return oSelect;

}

// Generate the divs where the columns and buttons are going to be
function generateObjectDiv(onInit){
    var oDiv = document.createElement("div");
    oDiv.setAttribute("class","flex-container");
    oDiv.setAttribute("id","line"+this.iSelectCounter);


    //Add first Select Object and text
    var oSelect = this.generateSelect(onInit);
    //var oText = document.createTextNode("Col:");

    //Generate add object button (hidden per default)
    var oBtn = document.createElement("button");
    oBtn.setAttribute("class","btn tooltip");
    oBtn.setAttribute("id","button"+this.iSelectCounter);
    iSelectButtonId.push("button"+this.iSelectCounter);

    oBtn.appendChild(document.createTextNode("+"));
    var oSpan = document.createElement("span");
    oSpan.setAttribute("class", "tooltiptext");
    oBtn.appendChild(oSpan);
    oBtn.setAttribute("onclick","addColumn(this)");

    //oDiv.appendChild(oText);
    oDiv.appendChild(oSelect);
    oDiv.appendChild(oBtn);

    // generate remove button
    var oBtn2 = document.createElement("button");
    oBtn2.setAttribute("class","btn tooltip");
    oBtn2.setAttribute("id","buttonrem"+this.iSelectCounter);
    iRemoveButtonId.push("buttonrem"+this.iSelectCounter);

    var oSpan2 = document.createElement("span");
    oSpan2.setAttribute("class", "tooltiptext");
    oSpan2.appendChild(document.createTextNode("Remove"));
    oBtn2.appendChild(oSpan2);
    oBtn2.setAttribute("onclick","removeColumn(this)");
    oDiv.appendChild(oBtn2);
    

    document.getElementById("selectioncriteria").appendChild(oDiv);
    document.getElementById(iRemoveButtonId[0]).style.visibility = "hidden"; 

    var selVal = document.getElementById(iSelectBoxId[0]);
    // dunno if second condition is worth it
    if (selVal.options[selVal.selectedIndex].value == "*" && iSelectButtonId.length == 1){
        oBtn.style.visibility = "hidden";
    }
    else{
        document.getElementById(iRemoveButtonId[0]).style.visibility = "visible";
        document.getElementById(iSelectButtonId[iSelectButtonId.length-2]).style.visibility = "hidden";
    } 
}

function generateOperators(pos){
    var aColumns = ["=",">","<",">=","<=","!=","IN","NOT IN","LIKE"];
    var oSelect = document.createElement("select");
    oSelect.setAttribute("id","opId" + pos);
    oSelect.setAttribute("style","margin:5px;");
    iOperatorId.push("opId" + this.iWhereCounter); 

    aColumns.forEach(function(sText){
        var oOption = document.createElement("option");
        oOption.appendChild(document.createTextNode(sText));
        oOption.setAttribute("value",sText);
        oSelect.appendChild(oOption);
    });

    return oSelect;

}

// Add column if button add column is pressed
function addColumn(obj) {
    this.iSelectCounter++;
    generateObjectDiv(1);
} 

// Add where condition if button add cond is pressed
function addWhere(obj) {
    this.iWhereCounter++;
    generateWhereDiv(true);
} 

// On Column Change show/hide add object button: Possible to add column to the SELECT if the criteria is not *
function onSelectChange(obj){
    var index = iSelectBoxId.indexOf(obj.id);
    var selectedValue = obj.options[obj.selectedIndex].value;
    if (selectedValue != "*"){
        document.getElementById(iSelectButtonId[index]).style.visibility = "visible";
    }
    else{
        document.getElementById(iSelectButtonId[index]).style.visibility = "hidden";
    }
}

// On Where Column Change add list or textbox
function onWhereChange(obj){
    //integrations, traits, properties - add textbox e.g. Google Analytics = true
    objId = obj.id;
    var pos = obj.id[obj.id.length -1];
    var selVal = obj.options[obj.selectedIndex].value;
    if (selVal == "integrations" || selVal == "traits" || selVal == "properties" || selVal == "context.traits"){
        
        // get number of where obj, if texbox element exists dont do anything, if not create new one
        if (iTextBoxId.length == 0 || (iTextBoxId.includes("textBox"+pos) == false)){
            var oTextBox = document.createElement("input");
            oTextBox.type = "text";
            // crear textbox con el mismo numero del whereelement
            oTextBox.setAttribute("id","textBox" + pos);
            iTextBoxId.push("textBox" + pos);
            obj.parentNode.insertBefore(oTextBox, obj.nextSibling);
        }
    }
    else {
        // if textbox exists remove
        if (iTextBoxId.includes("textBox"+pos) == true){
            var index = iTextBoxId.indexOf("textBox"+pos);
            document.getElementById("textBox"+pos).remove();
            iTextBoxId.splice(index, 1);
        }
    }
    
    // if operator does not exists create
    if (iOperatorId.includes("opId"+pos) == false){
        var oOperator = generateOperators(pos);
        obj.parentElement.appendChild(oOperator);

        var oValue = document.createElement("input");
        oValue.type = "text";
        // crear textbox con el mismo numero del whereelement
        oValue.setAttribute("id","valueBox" + pos);
        obj.parentElement.appendChild(oValue);
    }

}

// Remove select column
function removeColumn(oButton){
    var id = oButton.id;
    oButton.parentElement.remove();
    var index = iRemoveButtonId.indexOf(id);
    iRemoveButtonId.splice(index, 1);
    iSelectButtonId.splice(index, 1);
    iSelectBoxId.splice(index, 1);

    //make the plus visible
    if (iSelectButtonId.length == index && iRemoveButtonId.length > 1){
        document.getElementById(iSelectButtonId[index-1]).style.visibility = "visible";
    }
    //hide the remove and make the plus visible
    else if (iRemoveButtonId.length == 1){
        document.getElementById(iSelectButtonId[0]).style.visibility = "visible";
        document.getElementById(iRemoveButtonId[0]).style.visibility = "hidden";
    }
}

// Remove where condition
function removeWhere(oButton){
    var id = oButton.id;
    var oDiv = oButton.parentElement;
    oDiv.parentElement.remove();

    // if it´s the first element in the where, remove and/or in the next element

    var index = iWhereButtonRemId.indexOf(id);
    iWhereButtonId.splice(index, 1);
    iWhereButtonRemId.splice(index, 1);
    iWhereOptId.splice(index, 1);

    if (index == 0){
        var lastChar = iWhereOptId[0].substr(-1);
        document.getElementById("andOr"+lastChar).remove();
    }

    //make the plus visible
    if (iWhereButtonId.length == index && iWhereButtonRemId.length > 1){
        document.getElementById(iWhereButtonId[index-1]).style.visibility = "visible";
    }
    //hide the remove and make the plus visible
    else if (iWhereButtonRemId.length == 1){
        document.getElementById(iWhereButtonId[0]).style.visibility = "visible";
        document.getElementById(iWhereButtonRemId[0]).style.visibility = "hidden";
    }
}

// Generate the WHERE Conditions
function generateWhereDiv(onInit){

    // odiv contains odiv2 and odiv3
    var oDiv = document.createElement("div");
    oDiv.setAttribute("class","flex-container");
    oDiv.setAttribute("id","cond"+ this.iWhereCounter);

    var pos = oDiv.id[oDiv.id.length -1];

    // odiv2 is div with condition
    var oDiv2 = document.createElement("div");
    oDiv2.setAttribute("class","flex-container");
    //oDiv2.setAttribute("id","andorDiv"+ this.iWhereCounter);

    // And/Or switch going in odiv2
    if (iWhereOptId.length > 0){
        var aCols = ["AND","OR"];

        var oSel = document.createElement("select");
        oSel.setAttribute("id","andOr"+pos);
        oSel.setAttribute("style","margin:5px;");

        aCols.forEach(function(sText){
            var oOpt = document.createElement("option");
            oOpt.appendChild(document.createTextNode(sText));
            oOpt.setAttribute("value",sText);
            oSel.appendChild(oOpt);
        }); 

        oDiv2.appendChild(oSel);
    }

    //where condition increments TODO ADD MORE
    var aColumns = ["Add Object","anonymousid","messageid","timestamp","originaltimestamp","type","userid",
    "event","name","groupid","previousid","integrations","traits","properties","context.ip","context.app.name",
    "context.app.version","context.campaign.source", "context.campaign.medium","context.traits"];

    var oSelect = document.createElement("select");
    oSelect.setAttribute("id",this.sWDefaultId + this.iWhereCounter);
    oSelect.setAttribute("style","margin:5px;");
    oSelect.setAttribute("onchange", "onWhereChange(this)");
    iWhereOptId.push(this.sWDefaultId + this.iWhereCounter);

    aColumns.forEach(function(sText){
        var oOption = document.createElement("option");
        oOption.appendChild(document.createTextNode(sText));
        oOption.setAttribute("value",sText);
        oSelect.appendChild(oOption);
    });

    oDiv2.appendChild(oSelect);
    oDiv.appendChild(oDiv2); 
    
    // odiv3 is ADD REMOVE options
    var oDiv3 = document.createElement("div");
    oDiv3.setAttribute("class","flex-container");
    oDiv3.setAttribute("id","condbuttons"+ this.iWhereCounter);

    var oBtn = document.createElement("button");
    oBtn.setAttribute("class","btn tooltip");
    oBtn.setAttribute("id","wherebutton"+this.iWhereCounter);
    iWhereButtonId.push("wherebutton"+this.iWhereCounter);

    var oSpan = document.createElement("span");
    oSpan.setAttribute("class", "tooltiptext");
    oBtn.appendChild(oSpan);
    oBtn.setAttribute("onclick","addWhere(this)");
    oBtn.appendChild(document.createTextNode("+"));
    oDiv3.appendChild(oBtn);

    var oBtn2 = document.createElement("button");
    oBtn2.setAttribute("class","btn tooltip");
    oBtn2.setAttribute("id","buttonwrem"+this.iWhereCounter);
    iWhereButtonRemId.push("buttonwrem"+this.iWhereCounter);

    var oSpan2 = document.createElement("span");
    oSpan2.setAttribute("class", "tooltiptext");
    oSpan2.appendChild(document.createTextNode("Remove"));
    oBtn2.appendChild(oSpan2);
    oBtn2.setAttribute("onclick","removeWhere(this)");

    oDiv3.appendChild(oBtn2);
    oDiv.appendChild(oDiv3);

    if (iWhereButtonId.length == 1){
        oBtn2.style.visibility = "hidden";
    }
    else{
        document.getElementById(iWhereButtonRemId[0]).style.visibility = "visible";
        document.getElementById(iWhereButtonId[iWhereButtonId.length-2]).style.visibility = "hidden";
    } 
    
    document.getElementById("whereclause").appendChild(oDiv);
}

function generateAthenaScript(){
    var finalSelect = "SELECT ";
    var sel = document.getElementById(iSelectBoxId[0]);
    var temp = sel.options[sel.selectedIndex].value;

    // GET COLUMNS for SELECT criteria
    if (temp == "*"){
        finalSelect += '*';
    }

    else{
        var temp2 = "";
        iSelectBoxId.forEach(function(sText){
            var e1 = document.getElementById(sText);
            var temp1 = e1.options[e1.selectedIndex].value + ",";
            temp2+= temp1;    
        });

        temp2 = temp2.substring(0, temp2.length - 1);
        finalSelect += temp2;
    }
    
    finalSelect += ' FROM "apilogs"."' + document.getElementById("tablename").value+'" ';
    finalSelect = finalSelect.split('""').join('"');

    // GET WHERE CONDITIONS 
    var where = document.getElementById(iWhereOptId[0]);
    if (where.options[where.selectedIndex].value != "Add Object"){
        var temp3 = "WHERE ";
        iWhereOptId.forEach(function(sText){

            // Get Property/Object e.g. integrations, anonymousiId
            var col1 = document.getElementById(sText);
            col1 = col1.options[col1.selectedIndex].value

            // Get whereelement id e.g. if WhereElement0 get all the objects ending in id0
            var pos = sText.substr(-1);
            if (iWhereOptId.indexOf(sText) >= 1){
                var col4 = document.getElementById("andOr"+pos);
                col4 = col4.options[col4.selectedIndex].value;
                temp3 += " "+col4+" ";
            }

            // if properties are first level and no nested objects G1
            var oProps1 = ["anonymousid","messageid","receivedat","timestamp","sentat","originaltimestamp","type","userid","event","name","groupid","previousid"];
            // second level properties with textbox G2
            var oProps2 = ["integrations","traits","properties"];
            // second level properties from context object G3
            var oProps3 = ["context.ip"];
            // third level properties from context object G4 
            // TODO ADD MORE
            var oProps4 = ["context.app.name","context.app.version","context.campaign.source", "context.campaign.medium"];
            // third level properties from context traits and textbox G5
            var oProps5 = ["context.traits"]

            // Get Operator ID equals, not equals, ...
            var col2 = document.getElementById("opId"+pos);
                col2 = col2.options[col2.selectedIndex].value;

            if (oProps1.includes(col1)){
                switch(col2) {
                    case "IN":
                    case "NOT IN":{
                        var res = document.getElementById("valueBox"+pos).value;
                        res = res.split(", ").join(",");
                        res = res.split(",").join("','");
                        temp3 += col1 + " " + col2 + " ('" + res + "')";
                    }
                    break;
                    default:
                        temp3 += col1 + " " + col2 + " '" + document.getElementById("valueBox"+pos).value + "'";
                }
            }
            else if(oProps2.includes(col1)){
                switch(col2) {
                    case "IN":
                    case "NOT IN":{
                        var res = document.getElementById("valueBox"+pos).value;
                        res = res.split(", ").join(",");
                        res = res.split(",").join("','");
                        temp3 += col1+"['"+ document.getElementById("textBox"+pos).value +"'] " + col2 + " ('" + res + "')";
                    }
                    break;
                    default:
                        temp3 += col1+"['"+ document.getElementById("textBox"+pos).value +"'] " + col2 + " '" + document.getElementById("valueBox"+pos).value + "'";
                }
            }
            else if(oProps3.includes(col1)){
                switch(col2) {
                    case "IN":
                    case "NOT IN":{
                        var res = document.getElementById("valueBox"+pos).value;
                        res = res.split(", ").join(",");
                        res = res.split(",").join("','");
                        temp3 += "context['ip'] " + col2 + " ('" + res + "')";
                    }
                    break;
                    default:
                        temp3 += "context['ip'] "+ col2 +" '" + document.getElementById("valueBox"+pos).value + "'";
                } 
            }
            else if(oProps4.includes(col1)){
                var col3 = col1.split(".");
                switch(col2) {
                    case "IN":
                    case "NOT IN":{
                        var res = document.getElementById("valueBox"+pos).value;
                        res = res.split(", ").join(",");
                        res = res.split(",").join("','");
                        temp3 += "json_extract_scalar("+col3[0]+"['"+col3[1]+"'],'$."+ col3[2] + "') " + col2 + " ('" + res + "')";
                    }
                    break;
                    default:
                        temp3 += "json_extract_scalar("+col3[0]+"['"+col3[1]+"'],'$."+ col3[2] + "') " + col2 + " '" + document.getElementById("valueBox"+pos).value + "'";
                }   
            }
            else if(oProps5.includes(col1)){
                switch(col2) {
                    case "IN":
                    case "NOT IN":{
                        var res = document.getElementById("valueBox"+pos).value;
                        res = res.split(", ").join(",");
                        res = res.split(",").join("','");
                        temp3 += "json_extract_scalar(context['traits'],'$."+document.getElementById("textBox"+pos).value + "') " + col2 + " ('" + res + "')";
                    }
                    break;
                    default:
                        temp3 += "json_extract_scalar(context['traits'],'$."+document.getElementById("textBox"+pos).value + "') " + col2 + " '" + document.getElementById("valueBox"+pos).value + "'";
                }   
            }
        });

        finalSelect += temp3;
        
    }
    finalSelect += ";";
    document.getElementById('sqlcode').value = finalSelect;
}

function copySql(){
    var textarea = document.getElementById("sqlcode");
    textarea.select();
    document.execCommand("copy");
}


function clearSelect(){
    iSelectBoxId.forEach(function(sText){
        var elem = document.getElementById(sText);
        elem.parentElement.remove();
    });

    iSelectBoxId = []; // select clauses id
    iSelectButtonId = []; // add select button id
    iRemoveButtonId = []; // remove select button id

    //var oSelect = this.generateSelect(1);
    generateObjectDiv(1);
}


function clearWhere(){
    iWhereOptId.forEach(function(sText){
        var elem = document.getElementById(sText);
        elem = elem.parentElement;
        elem.parentElement.remove();
    });

    //clean all the arrays and remove parents divs
    iWhereOptId = []; // where cond id
    iWhereButtonId = []; // add where button id
    iWhereButtonRemId = []; // remove where button id

    //not sure if
    iTextBoxId = []; // subobject box id
    iOperatorId = []; // operator id

    generateWhereDiv(true);

}
