var finalSelect="Set your SQL here";
var source = $("#tablescript-hdbs").html();
var client;

function setSqlData() {
  var data = {};
  data.finalSelect = finalSelect;
  return data;
}

function renderPage(data) {
  var context = data;
  var template = Handlebars.compile(source);
  var html = template(context);
  $("#content").html(html);
}

function renderSqlData() {
  source = $("#tablescript-hdbs").html();
  renderPage(setSqlData());
  onInit();
}

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

    var oValue1 = generateTextBox("groupBox","2",0);
    var oValue2 = generateTextBox("orderBox","2",0);
    var oSelect = generateSelectMenu("asdescSel",["ASC","DESC"],0); 
    var oValue = generateTextBox("limitBox","3",0);

    document.getElementById("group").appendChild(oValue1);
    document.getElementById("order").appendChild(oValue2);
    document.getElementById("order").appendChild(oSelect);
    document.getElementById("limit").appendChild(oValue);

    generateColumnsDiv(1);
    generateWhereDiv(true);
}

function generateSelect(onInit){
   if(onInit == 1 && iSelectBoxId.length == 0){
        var aColumns = ["*","COUNT(*)","anonymousid","context","integrations","messageid","receivedat","timestamp","sentat","originaltimestamp","type","userid","traits","event","properties","name","groupid","previousid"];
    }
    else{
        var aColumns = ["anonymousid","context","integrations","messageid","receivedat","timestamp","sentat","originaltimestamp","type","userid","traits","event","properties","name","groupid","previousid","COUNT(*)"];
    }

    var oSelect = generateSelectMenu(this.sDefaultId + this.iSelectCounter,aColumns,1);
    oSelect.setAttribute("onchange", "onSelectChange(this)");
    iSelectBoxId.push(this.sDefaultId + this.iSelectCounter); 
    return oSelect;
}

function generateColumnsDiv(onInit){
    var oDiv = document.createElement("div");
    var oSelect = this.generateSelect(onInit);
    var oBtn = generateButton("button"+this.iSelectCounter,"+",1);
    iSelectButtonId.push("button"+this.iSelectCounter);
    oBtn.setAttribute("onclick","addColumn(this)");

    oDiv.appendChild(oSelect);
    oDiv.appendChild(oBtn);

    var oBtn2 = generateButton("buttonrem"+this.iSelectCounter,"Remove",1);
    iRemoveButtonId.push("buttonrem"+this.iSelectCounter);
    oBtn2.setAttribute("onclick","removeColumn(this)");
    oDiv.appendChild(oBtn2);
    
    document.getElementById("selectioncriteria").appendChild(oDiv);
    document.getElementById(iRemoveButtonId[0]).style.visibility = "hidden"; 

    var selVal = document.getElementById(iSelectBoxId[0]);
    if (selVal.options[selVal.selectedIndex].value == "*" && iSelectButtonId.length == 1){
        oBtn.style.visibility = "hidden";
    }
    else{
        document.getElementById(iRemoveButtonId[0]).style.visibility = "visible";
        document.getElementById(iSelectButtonId[iSelectButtonId.length-2]).style.visibility = "hidden";
    } 
}

function generateOperators(pos){
    var aColumns = ["=",">","<",">=","<=","!=","IN","NOT IN","LIKE","NOT LIKE","IS NULL","IS NOT NULL"];
    var oSelect = generateSelectMenu("opId" + pos,aColumns,1);
    oSelect.setAttribute("onchange", "onOperatorChange(this)");
    iOperatorId.push("opId" + this.iWhereCounter);
    return oSelect;
}

function addColumn(obj) {
    this.iSelectCounter++;
    generateColumnsDiv(1);
} 

function addWhere(obj) {
    this.iWhereCounter++;
    generateWhereDiv(true);
} 

function onSelectChange(obj){
    var index = iSelectBoxId.indexOf(obj.id);
    var selectedValue = obj.options[obj.selectedIndex].value;
    if (selectedValue != "*"){
        document.getElementById(iSelectButtonId[index]).style.visibility = "visible";
    }
    else if (index < iSelectBoxId.length-1){
        document.getElementById(iSelectButtonId[index]).style.visibility = "hidden";
    }
}

function onWhereChange(obj){
    objId = obj.id;
    var pos = obj.id[obj.id.length -1];
    var selVal = obj.options[obj.selectedIndex].value;
    if (selVal == "integrations" || selVal == "traits" || selVal == "properties" || selVal == "context.traits"){
        if (iTextBoxId.length == 0 || (iTextBoxId.includes("textBox"+pos) == false)){
            var oTextBox = generateTextBox("textBox" + pos,20,1);
            iTextBoxId.push("textBox" + pos);
            obj.parentNode.insertBefore(oTextBox, obj.nextSibling);
        }
    }
    else {
        if (iTextBoxId.includes("textBox"+pos) == true){
            var index = iTextBoxId.indexOf("textBox"+pos);
            document.getElementById("textBox"+pos).remove();
            iTextBoxId.splice(index, 1);
        }
    }
    if (iOperatorId.includes("opId"+pos) == false){
        var oOperator = generateOperators(pos);
        obj.parentElement.appendChild(oOperator);
        var oValue = generateTextBox("valueBox" + pos,20,1);
        obj.parentElement.appendChild(oValue);    
    }
}

function onOperatorChange(obj){
    var temp = obj.id.substr(-1);
    if(obj.value == "IS NULL" || obj.value == "IS NOT NULL"){
        document.getElementById("valueBox"+temp).style.visibility = "hidden";
    }  
    else{
        document.getElementById("valueBox"+temp).style.visibility = "visible";
    } 
}

function removeColumn(oButton){
    var id = oButton.id;
    oButton.parentElement.remove();
    var index = iRemoveButtonId.indexOf(id);
    iRemoveButtonId.splice(index, 1);
    iSelectButtonId.splice(index, 1);
    iSelectBoxId.splice(index, 1);

    if (iSelectButtonId.length == index && iRemoveButtonId.length > 1){
        document.getElementById(iSelectButtonId[index-1]).style.visibility = "visible";
    }
    else if (iRemoveButtonId.length == 1){
        document.getElementById(iSelectButtonId[0]).style.visibility = "visible";
        document.getElementById(iRemoveButtonId[0]).style.visibility = "hidden";
    }
}

function removeWhere(oButton){
    var id = oButton.id;
    var oDiv = oButton.parentElement;
    oDiv.parentElement.remove();

    var index = iWhereButtonRemId.indexOf(id);
    iWhereButtonId.splice(index, 1);
    iWhereButtonRemId.splice(index, 1);
    iWhereOptId.splice(index, 1);

    if (index == 0){
        var lastChar = iWhereOptId[0].substr(-1);
        document.getElementById("andOr"+lastChar).remove();
    }

    if (iWhereButtonId.length == index && iWhereButtonRemId.length > 1){
        document.getElementById(iWhereButtonId[index-1]).style.visibility = "visible";
    }
    else if (iWhereButtonRemId.length == 1){
        document.getElementById(iWhereButtonId[0]).style.visibility = "visible";
        document.getElementById(iWhereButtonRemId[0]).style.visibility = "hidden";
    }
}

function generateWhereDiv(onInit){
    var oDiv = document.createElement("div");
    var oDiv2 = document.createElement("div");
    var oDiv3 = document.createElement("div");

    if (iWhereOptId.length > 0){
        var oSel = generateSelectMenu("andOr"+this.iWhereCounter,["AND","OR"],1);
        oDiv2.appendChild(oSel);
    }

    var aColumns = ["Add Object","anonymousid","messageid","timestamp","originaltimestamp","type","userid",
    "event","name","groupid","previousid","integrations","traits","properties","context.ip","context.app.name",
    "context.app.version","context.campaign.name","context.campaign.source", "context.campaign.medium","context.device.id",
    "context.device.advertisingid","context.device.adtrackingenabled","context.device.token","context.library.name","context.page.referrer","context.traits"];

    if (iWhereOptId.length > 0){
        aColumns.shift();
    }

    var oSelect = generateSelectMenu(this.sWDefaultId + this.iWhereCounter,aColumns,1);
    oSelect.setAttribute("onchange", "onWhereChange(this)");
    iWhereOptId.push(this.sWDefaultId + this.iWhereCounter);
    oDiv2.appendChild(oSelect);

    if (iWhereOptId.length > 1){
            var oOperator = generateOperators(this.iWhereCounter);
            oDiv2.appendChild(oOperator);
            var oValue = generateTextBox("valueBox" + this.iWhereCounter,20,1);
            oDiv2.appendChild(oValue);
    }
    oDiv.appendChild(oDiv2); 
      
    var oBtn = generateButton("wherebutton"+this.iWhereCounter,"+",1);
    oBtn.setAttribute("onclick","addWhere(this)");
    iWhereButtonId.push("wherebutton"+this.iWhereCounter);
    oDiv3.appendChild(oBtn);

    var oBtn2 = generateButton("buttonwrem"+this.iWhereCounter,"Remove",1);
    oBtn2.setAttribute("onclick","removeWhere(this)");
    iWhereButtonRemId.push("buttonwrem"+this.iWhereCounter);
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

function generateSQLScript(){
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
            var oProps4 = ["context.app.name","context.app.version","context.campaign.name","context.campaign.source", "context.campaign.medium","context.device.id",
            "context.device.advertisingid","context.device.adtrackingenabled","context.device.token","context.library.name","context.page.referrer"];
            // third level properties from context traits and textbox G5
            var oProps5 = ["context.traits"];



            var col2 = document.getElementById("opId"+pos);
            col2 = col2.options[col2.selectedIndex].value;
            var res = document.getElementById("valueBox"+pos).value;
            res = res.split(", ").join(",");
            res = res.split("'").join("");
            res = res.split('"').join("");
            res = res.split(",").join("','");

            textbox = document.getElementById("textBox"+pos).value;
            if (col1 == "traits" || col1 == "properties" || col1 == "context.traits"){
                textbox = textbox.toLowerCase();
            }
            
            if (oProps1.includes(col1)){
                switch(col2) {
                    case "IN":
                    case "NOT IN":{
                        temp3 += col1 + " " + col2 + " ('" + res + "')";
                    }
                    break;
                    case "IS NULL":
                    case "IS NOT NULL":{
                        temp3 += col1 + " " +col2;
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
                        temp3 += col1+"['"+ textbox +"'] " + col2 + " ('" + res + "')";
                    }
                    break;
                    case "IS NULL":
                    case "IS NOT NULL":{
                        temp3 += col1 +"['"+ textbox +"'] " + col2;
                    }
                    break;
                    default:
                        temp3 += col1+"['"+ textbox +"'] " + col2 + " '" + document.getElementById("valueBox"+pos).value + "'";
                }
            }
            else if(oProps3.includes(col1)){
                switch(col2) {
                    case "IN":
                    case "NOT IN":{
                        temp3 += "context['ip'] " + col2 + " ('" + res + "')";
                    }
                    break;
                    case "IS NULL":
                    case "IS NOT NULL":{
                        temp3 += "context['ip'] " +col2;
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
                        temp3 += "json_extract_scalar("+col3[0]+"['"+col3[1]+"'],'$."+ col3[2] + "') " + col2 + " ('" + res + "')";
                    }
                    break;
                    case "IS NULL":
                    case "IS NOT NULL":{
                        temp3 += "json_extract_scalar("+col3[0]+"['"+col3[1]+"'],'$."+ col3[2] + "') " + col2;
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
                        temp3 += "json_extract_scalar(context['traits'],'$."+ textbox + "') " + col2 + " ('" + res + "')";
                    }
                    break;
                    case "IS NULL":
                    case "IS NOT NULL":{
                        temp3 += "json_extract_scalar(context['traits'],'$."+ textbox + "') " + col2;
                    }
                    break;
                    default:
                        temp3 += "json_extract_scalar(context['traits'],'$."+ textbox + "') " + col2 + " '" + document.getElementById("valueBox"+pos).value + "'";
                }   
            }
        });

        finalSelect += temp3;
        
    }

    if(document.getElementById("addGroup").checked){
        finalSelect += " GROUP BY " + document.getElementById("groupBox").value;
    }
    if(document.getElementById("addOrder").checked){
        finalSelect += " ORDER BY " + document.getElementById("orderBox").value + " " + document.getElementById("asdescSel").value;
    }
    if(document.getElementById("addLimit").checked){
        finalSelect += " LIMIT " + document.getElementById("limitBox").value;
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
    generateColumnsDiv(1);
}


function clearWhere(){
    iWhereOptId.forEach(function(sText){
        var elem = document.getElementById(sText);
        elem = elem.parentElement;
        elem.parentElement.remove();
    });

    iWhereOptId = []; // where cond id
    iWhereButtonId = []; // add where button id
    iWhereButtonRemId = []; // remove where button id
    iTextBoxId = []; // subobject box id
    iOperatorId = []; // operator id
    generateWhereDiv(true);

}

function addGroup(checkboxElem) {
  if (checkboxElem.checked) {
    document.getElementById("groupBox").style.visibility = "visible"; 
  } else {
    document.getElementById("groupBox").style.visibility = "hidden"; 
  }
}

function addOrder(checkboxElem) {
  if (checkboxElem.checked) {
    document.getElementById("orderBox").style.visibility = "visible"; 
    document.getElementById("asdescSel").style.visibility = "visible"; 
  } else {
    document.getElementById("orderBox").style.visibility = "hidden"; 
    document.getElementById("asdescSel").style.visibility = "hidden"; 
  }
}

function addLimit(checkboxElem) {
  if (checkboxElem.checked) {
    document.getElementById("limitBox").style.visibility = "visible"; 
  } else {
    document.getElementById("limitBox").style.visibility = "hidden"; 
  }
}

function generateTextBox(id,size,visib){
    var oValue = document.createElement("input");
    oValue.type = "text";
    oValue.setAttribute("id",id);
    oValue.setAttribute("size",size);
    if (visib == 0){
        oValue.style.visibility = "hidden"; 
    }
    return oValue;
}

function generateSelectMenu(id,columns,visib){
    var oSelect = document.createElement("select");
    oSelect.setAttribute("id",id);
    oSelect.setAttribute("style","margin:2px;");
    if (visib == 0){
        oSelect.style.visibility = "hidden"; 
    }
    
    columns.forEach(function(sText){
        var oOption = document.createElement("option");
        oOption.appendChild(document.createTextNode(sText));
        oOption.setAttribute("value",sText);
        oSelect.appendChild(oOption);
    });
    return oSelect;
}

function generateButton(id,text,visib){
    var oBtn = document.createElement("button");
    oBtn.setAttribute("id",id);

    if (visib == 0){
        oBtn.style.visibility = "hidden"; 
    }
    
    oBtn.appendChild(document.createTextNode(text));
    var oSpan = document.createElement("span");
    oBtn.appendChild(oSpan);

    return oBtn;
}
