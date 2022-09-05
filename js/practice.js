// database connection
const data ={
    variationName : [],
    VariationVal : [],
    mixVariationVal : []
}
// function for id selection 
const id = id => document.getElementById(id);
// function for class selection
const _class = _class => document.getElementsByClassName(_class);


// load option 
const loadOption = (n)=>{
    for (const d of data.VariationVal[n]) {
        _class("push")[n].innerHTML +=`
        <option value="${d}">${[d]}</option>
       `
    }
}
id("add-variation-prop-btn").disabled = true;
// select option setup
const selectOptSet = () => {
    const tarSelectField = id("selectPushField");
    tarSelectField.innerHTML = '';
    for (let i = 0; i < data.variationName.length; i++) {
        let dynamicData = [];
        dynamicData = data.VariationVal[i];
        dynamicData.unshift(data.variationName[i].trim());
        tarSelectField.innerHTML += `
        <div class="w-100 m-1">
        <select id="dataEmpty" name="" class="w-100 push">
            
        </select>
        </div>
        `;
        loadOption(i);
        dynamicData.splice(0,1);
    }

}

// event
const addVariationBtn = id("add-variation-btn");
addVariationBtn.addEventListener('click', async function(){
    const tarVariaNameVal = id("inp-varia-name").value.trim();
    const tarVariaNamePropVal = id("inp-varia-name-property").value.trim();

    if(tarVariaNameVal === '' || tarVariaNamePropVal === ''){
        alert("please insert string value");
    }else{
        if(data.variationName.includes(tarVariaNameVal)){
            alert("OOps ! variation already exits");
        }else{
            const splitVal = tarVariaNamePropVal.split('|');
            data.variationName.push(tarVariaNameVal);
            data.VariationVal.push(splitVal);
            // call function 
            selectOptSet();
            // input field erase
            id("inp-varia-name").value = '';
            id("inp-varia-name-property").value = '';
            id("add-variation-prop-btn").disabled = false;
        }
    }
});

const getOptionProp = () => {
    const selectOptionArr = [];
    const selectLen = data.variationName.length;
    for (let i = 0; i <selectLen; i++) {
        const select = document.getElementsByClassName('push')[i];
        const element = select.options[select.selectedIndex].value;
        selectOptionArr.push(element.trim());
    }
    // check data already insert or not
    const isValid = isRightSelection(selectOptionArr);
    if(isValid){
        alert("Please select option correctly!!");
    }else{
        const res = isInsertBefore(selectOptionArr);
        // console.log(isValid);
        //  console.log(isValid);
        if(res === 1){
            alert("data already exits")
        }else{
            const formDataRes = getDataForm();
            if(formDataRes === false){
                alert("Please fill all field");
            }else{
                updateData(selectOptionArr, formDataRes);
                allPrev();
                pushTableBodyItems();
            }
        }
    }
}

//  check data already insert or not ==========////return  true or false
const isInsertBefore = (selectedOption) => {
    const selectedOptionLen = selectedOption.length;
    const mixVariationLen = data.mixVariationVal.length;
    if(mixVariationLen < 1){
        return 0; // it's means data not exits
    }else{
        let dynamicArr = [];
        for (let i = 0; i < data.mixVariationVal.length; i++) {
            dynamicArr = [];
            selectedOption.forEach( element => {
                if(data.mixVariationVal[i].mixName.includes(element)){
                    // alert(i, "push true");
                    // alert(selectedOption);
                    dynamicArr.push(true);
                }
            });
            if(selectedOptionLen === dynamicArr.length ){
                return 1 ; // it's means data already exits
            }
        }
        if(selectedOptionLen === dynamicArr.length ){
            return 1 ; // it's means data already exits
        }else{
            return 0 ; // data not exits in array
        }
    }
}
// data update in array
const updateData = (selectedMixVal, formDataRes) => {
    const dynamicObject = {};
    dynamicObject.mixName = [];
    dynamicObject.mixName.push(...selectedMixVal);
    dynamicObject.regularPrice = formDataRes.regPrice;
    dynamicObject.sellPrice = formDataRes.sellPrice;
    dynamicObject.stockManage = formDataRes.stockManage;
    dynamicObject.inputThumLink = formDataRes.inputThumLink;
    dynamicObject.btnImgLink = formDataRes.btnImgLink;
    data.mixVariationVal.push(dynamicObject);
    removeInputField();
    // console.log(data.mixVariationVal);
}

// check valid option true or false
const isRightSelection = (selectedMixVal) => {
    let isValid = false;
    selectedMixVal.forEach(element => {
        if(data.variationName.includes(element)){
            isValid = true ; // it's means data select is not valid
        }
    });
    return isValid;
}

// data fetch from form
const getDataForm = () => {
    let formDataObj = {};

    const inputRegPrice = _class("input-regular-price")[0].value.trim();
    const inputSellPrice = _class("input-sell-price")[0].value.trim();
    const stockManage = _class("stock-manage")[0].value.trim();
    const inputThumLink = _class("input-thumnail-link")[0].value.trim();
    const btnImgLink = _class("btn-img-link")[0].value.trim();

    formDataObj.regPrice = inputRegPrice;
    formDataObj.sellPrice = inputSellPrice;
    formDataObj.stockManage = stockManage;
    formDataObj.inputThumLink = inputThumLink;
    formDataObj.btnImgLink = btnImgLink;

    if(inputRegPrice == '' || inputSellPrice == ''|| stockManage == '' || inputThumLink == '' || btnImgLink == ''){
        return false ;
    }else{
        return formDataObj;
    }

}


// remove all input field
const removeInputField = () => {
    _class("input-regular-price")[0].value=''
    _class("input-sell-price")[0].value=''
    _class("stock-manage")[0].value=''
    _class("input-thumnail-link")[0].value=''
    _class("btn-img-link")[0].value=''
}

// all prev setup 
const allPrev = () => {
    id("all-prev-header-id").innerHTML = '';
    const headers = id("all-prev-header-id");
    headers.innerHTML +=`
        <th scope="col">#</th>
        `;

    data.variationName.forEach(element => {
        headers.innerHTML += `
            <th scope="col">${element}</th>
        `
    });

    headers.innerHTML +=`
    <th scope="col">regular price</th>
    <th scope="col">Sell price</th>
    <th scope="col">Stock</th>
    <th scope="col">Thumbnail</th>
    <th scope="col">Btn img link</th>
    <th>Action</th>
    `;
}

// push table body all items
const pushTableBodyItems = () => {
    let dynamicShowData = [];
    id('body-item-id').innerHTML = '';
    const tableBodyItems = id('body-item-id');
    // loop 
    for (let i = 0; i < data.mixVariationVal.length; i++) {
        tableBodyItems.innerHTML += "<tr class='pushDataEachRow'></tr>";
        data.mixVariationVal[i].mixName.forEach(element => {
            dynamicShowData.push(element);
        });
        dynamicShowData.push(data.mixVariationVal[i].regularPrice);
        dynamicShowData.push(data.mixVariationVal[i].sellPrice);
        dynamicShowData.push(data.mixVariationVal[i].stockManage);
        dynamicShowData.push(data.mixVariationVal[i].inputThumLink);
        dynamicShowData.push(data.mixVariationVal[i].btnImgLink);
        dynamicShowData.push(i);
        dynamicShowData.unshift(i+1);

        //   previous data load
        for (let j = 0; j < dynamicShowData.length; j++) {
            if(j<dynamicShowData.length - 1 ){
                _class("pushDataEachRow")[i].innerHTML += `
                <td>${dynamicShowData[j]}</td>
            `
            }else{
                _class("pushDataEachRow")[i].innerHTML += `
                <td>
                    <button onclick="deleteMixValue(${dynamicShowData[j]})" class="btn btn-danger btn-sm">Delete</button>
                    <button data-mdb-toggle="modal" data-mdb-target="#exampleModal" onclick="UpdateMixValue(${dynamicShowData[j]})" class="btn btn-info btn-sm">Update</button>
                </td>
            `  
            }
        }
        id("add-variation-btn").disabled = true;
        dynamicShowData = [];
    }
}

// delete mix value
const deleteMixValue = (i) => {
    data.mixVariationVal.splice(i,1);
    // console.log(data.mixVariationVal);
    pushTableBodyItems();
}
// update mix value
const UpdateMixValue = (i) => {
    // console.log(data);
    setBackInformation(i);
}
// set background information in input field
const setBackInformation = (i) => {
    id("selected-ind-id").setAttribute("selected-index", i);
    // show options
    id("update-dyn-option-show").innerHTML = '';
    data.variationName.forEach(element => {
        id("update-dyn-option-show").innerHTML += `
            <div class="col-md-4 col-lg-3 col-6 ">
                <p>${element}</p>
                <select class="updateOptions" name="" id="">

                </select>
            </div
        `
    });
    // alert("Option Load");
    optionLoad(i);
    id("regular-price").value = data.mixVariationVal[i].regularPrice;
    id("sell-price").value = data.mixVariationVal[i].sellPrice;
    id("stock").value = data.mixVariationVal[i].stockManage;
    id("thumnail").value = data.mixVariationVal[i].inputThumLink;
    id("btn-img").value = data.mixVariationVal[i].btnImgLink;

    
}

// Option load
const optionLoad = (tarIndex) => {
    // console.log(tarIndex);
    for (let i = 0; i < data.variationName.length; i++) {
        _class("updateOptions")[i].innerHTML = '';
        data.VariationVal[i].forEach(options => {
            _class("updateOptions")[i].innerHTML +=`
                <option>${options}</option>
            `
            // console.log(options);
        });
    }
    autoSelectOptions(tarIndex);
}
// auto select when open update modal
const autoSelectOptions = (tarIndex) => {
    for (let i = 0; i < data.mixVariationVal[tarIndex].mixName.length; i++) {
        let options = _class("updateOptions")[i].options;
        let selectedVal = data.mixVariationVal[tarIndex].mixName[i].trim();
        for(let j = 0; j<options.length; j++){
            if(options[j].innerText.trim() == selectedVal){
                options[j].selected = true;
                break;
            }
        }
    }
}
// final update all information push an array
const finalUpdateData = () => {
    const tarIndex = id("selected-ind-id").getAttribute("selected-index");
    for(let i=0; i<data.mixVariationVal[tarIndex].mixName.length;i++){
        let selectOption = _class("updateOptions")[i].value;
        data.mixVariationVal[tarIndex].mixName[i] = selectOption;
    }
    data.mixVariationVal[tarIndex].regularPrice = id("regular-price").value;
    data.mixVariationVal[tarIndex].sellPrice = id("sell-price").value;
    data.mixVariationVal[tarIndex].stockManage = id("stock").value;
    data.mixVariationVal[tarIndex].inputThumLink = id("thumnail").value;
    data.mixVariationVal[tarIndex].btnImgLink = id("btn-img").value;
    pushTableBodyItems();
    id("exampleModal").setAttribute("aria-hidden", true);
    id("exampleModal").setAttribute("aria-modal", false);
    id("exampleModal").style.display = "none";
    id("exampleModal").classList.remove("show");
    _class("modal-backdrop")[0].classList.remove("show");
    _class("modal-backdrop")[0].classList.remove("fade");
    _class("modal-backdrop")[0].classList.remove("modal-backdrop");
}