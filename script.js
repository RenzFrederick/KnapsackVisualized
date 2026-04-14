function kpItem(itemName, itemValue, itemWeight){
    this.itemName = itemName;
    this.itemValue = itemValue;
    this.itemWeight = itemWeight;
}

const inputName = document.getElementById("itemName");
const inputValue = document.getElementById("itemValue");
const inputWeight = document.getElementById("itemWeight");
const inputCapacity = document.getElementById("capacity");

const itemDisplay = document.getElementById("itemDisplay");
const displayHeader = 
    `<tr>
        <th>Name</th>
        <th>Value</th>
        <th>Weight</th>
    </tr>`;
    
const dpDisplay = document.getElementById("dpDisplay");
const solution = document.getElementById("solution");
const errorText = document.getElementById("errorText");

let itemList = [];
let errors = [];

function addItem() {
    errorText.innerHTML = "";
    if (itemList.length < 4) {
        if (inputName.value == "" || inputValue.value == "" || inputWeight.value == ""){
            errorText.innerHTML = "Error: Please fill in all fields";
            return;
        }
        let newItem = new kpItem(
            inputName.value, 
            Number(inputValue.value), 
            Number(inputWeight.value));
        itemList.push(newItem);
        
        displayTable();
    }
    else{
        errorText.innerHTML = "Error: Maximum of 4 items allowed";
    }
}

function displayTable(){
    if (itemList.length > 0){
        itemDisplay.innerHTML = displayHeader;
        for (let i = 0; i < itemList.length; i++){
            let row = itemDisplay.insertRow(-1);
            let displayName = row.insertCell(0);
            let displayValue = row.insertCell(1);
            let displayWeight = row.insertCell(2);

            displayName.innerHTML = itemList[i].itemName;
            displayValue.innerHTML = itemList[i].itemValue;
            displayWeight.innerHTML = itemList[i].itemWeight;
    }
    }
}

//DP core
let dp = [];
let n = 0; 
let W = 0;

function generateDP(){
    errorText.innerHTML = "";
    if (itemList.length == 0){
        errorText.innerHTML = "Error: Please add at least 1 item";
        return;
    }
    if (inputCapacity.value == ""){
        errorText.innerHTML = "Error: Please enter a capacity";
        return;
    }
    if (inputCapacity.value < 0){
        errorText.innerHTML = "Error: Capacity cannot be negative";
        return;
    }
    if (inputCapacity.value > 7){
        errorText.innerHTML = "Error: Capacity cannot be greater than 7";
        return;
    }
    dp = []
    n = itemList.length;
    W = Number(inputCapacity.value);
    for (let y = 0; y <= n; y++){
        row = []
        for (let x = 0; x <= W; x++){
           row.push(0) 
        }
        dp.push(row)
    }

    for (let y = 0; y <= n; y++){
        for (let x = 0; x <= W; x++){
            if (y == 0 || x == 0){
                dp[y][x] = 0;
            }
            else {
                let pick = 0;

                if (itemList[y-1].itemWeight <= x){
                    pick = (itemList[y-1].itemValue +
                        dp[y-1][x-itemList[y-1].itemWeight]
                    );
                }

                let notPick = dp[y-1][x];

                dp[y][x] = Math.max(pick, notPick);
            }
        }
    }

    displayDP();
    backtrack();
    
}

function displayDP(){
    dpDisplay.innerHTML = ''
    for (let i = 0; i < dp.length; i++){
        let row = dpDisplay.insertRow(-1);
        let label = row.insertCell(-1);
        if (i>0){
            label.innerHTML = itemList[i-1].itemName;
        }
        else{
            label.innerHTML = 'None'
        }
        for (let j = 0; j < dp[i].length; j++){
            let cell = row.insertCell(-1);
            cell.innerHTML = dp[i][j];
            cell.className = "cell"
        }
    }
}

function backtrack(){
    
    let ib = n;
    let kb = W;

    let item_output = [];

    solution.innerHTML = ''
    let row = solution.insertRow(-1);
    row.innerHTML = "Solution"

    while (ib > 0 && kb > 0){
        
        if (dp[ib][kb] != dp[ib-1][kb]){
            iName = itemList[ib-1].itemName;
            item_output.push(iName);
            kb = kb - itemList[ib-1].itemWeight;
            ib = ib-1;
        }
        else{
            ib = ib-1;
        }
    
    }

    if (item_output.length > 0){
        for (let k = 0; k < item_output.length; k++){
            let row = solution.insertRow(-1);
            row.innerHTML = item_output[k]
        } 
    }
    else{
        let row = solution.insertRow(-1);
        row.innerHTML = "None"
    }

}