document.addEventListener('DOMContentLoaded', function(){
    /*
    let urlToHtmlExcelPainted = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSMUCyMmuAMSrvhxDIbede2LN9N7HDkvaESICz7FZhlD3aAzOg3hXta7FaaHjyJSySsBpC7_m3ucJgc/pubhtml";
    let pTagError = document.querySelector('p');
    let textArea = document.getElementById("displayer");

    function fillTextArea(content){
        textArea.value = content;
    }

    function cleanTextArea(){
        textArea.value = "";
    }

    function showError(errorMessage){
        pTagError.textContent = errorMessage;
    }

    function cleanErrorMessage(){
        pTagError.textContent = "";
    }

    function onCLick(){
        let workerName = document.querySelector('input');
        if (workerName.value === ""){
            //mostrar mensaje de error.
            showError("¡ERROR: Ingrese número de puerto!");
        }else{
            let workerstring = workerName.value;
            fetch(urlToHtmlExcelPainted)
                .then((result) => result.text()).then(function(text){

                    let parser = new DOMParser();
                    let doc = parser.parseFromString(text, "text/html");

                    let tabla = doc.getElementsByTagName("table")[0];

                    let cellNodes = tabla.getElementsByTagName("td");

                    let founded = "";
                    for (let i = 0; i<cellNodes.length;i++){
                        let currentData = cellNodes[i].textContent.toString();

                        if (currentData.includes(workerstring)) {
                            founded += "[Nombre: "+currentData+", extension: "+cellNodes[i+1].textContent+"]\n";//firstChild
                        }
                    }         
                    
                    if(founded){
                        fillTextArea(founded);
                    }else{
                        fillTextArea("No coincide!");
                    }

                })
                .catch(function(error) {
                    // This is where you run code if the server returns any errors
                    chrome.tabs.query({currentWindow:true,active:true}, function(tabs){
                        chrome.tabs.sendMessage(tabs[0].id,{type:"error",payload:error.message});
                    });
                });
        }
    }

    document.querySelector('button').addEventListener('click',onCLick,false);

    function whenInputisFocused(){
        cleanErrorMessage();
        cleanTextArea();
    }

    document.querySelector('input').addEventListener('focus',whenInputisFocused,false)

    */

    const createRow = function(rowObject){

        let tr = document.createElement("tr");
        let arrayOfKeys = Object.keys(rowObject);
        console.log("Array of keys: "+ arrayOfKeys);
        for (let i = 0;i<arrayOfKeys.length;i++){
            let td = document.createElement("td");
            let textNode = document.createTextNode(rowObject[arrayOfKeys[i]]);
            td.appendChild(textNode);
            tr.appendChild(td);
        }

        return tr;

    };

    const fillSubnetDisplayer = function(arrayOfRows){
        let subnetDisplayer = document.getElementById("subnetsDisplayer");
        for(let i = 0;i<arrayOfRows.length;i++){
            let createdTr = createRow(arrayOfRows[i]);
            subnetDisplayer.appendChild(createdTr);
        }
    };

    const cleanTable = function(){
        let table = document.getElementById("subnetsDisplayer");
        table.innerHTML = "<tr><th>SubnetIp</th><th>First useful</th><th>Last useful</th><th>Broadcast</th></tr>";
    };
    
    document.getElementById("txtNet").focus();
    document.getElementById("calculationForm").addEventListener("submit",calcularSubnets);

    function calcularSubnets(event){
        event.preventDefault();
        cleanTable();
        let txtNet = document.getElementById("txtNet").value;
        let txtMask = parseInt(document.getElementById("txtMask").value);
        let txtAmount = parseInt(document.getElementById("txtAmount").value);
        let subnetingInfo = getSubnets(txtNet,txtMask,txtAmount);
        fillSubnetDisplayer(subnetingInfo.rowsToDisplay);
    }
    
},false);