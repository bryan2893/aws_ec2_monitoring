document.addEventListener('DOMContentLoaded', function(){

    /*
    Configuracion amazon aws-jdk
    ID de clave de acceso: AKIAI5GNXU5CNWHMAC4Q
    Clave de acceso secreta: 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

    version = 2012-10-17
    */

    AWS.config.region = 'us-east-1'; // Región
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-1:9125dd84-5a17-4879-b6dd-093e3fa3f419',
    });

    AWS.config.credentials.get(function(err) {
        if (err) console.log(err);
        else {
            console.log(AWS.config.credentials);
        }
    });

    /*
    Statistics: [
          "SampleCount" | "Average" | "Sum" | "Minimum" | "Maximum"
        ]

    Unit: "Seconds" | "Microseconds" | "Milliseconds" | "Bytes" | "Kilobytes" | "Megabytes" | "Gigabytes" 
    | "Terabytes" | "Bits" | "Kilobits" | "Megabits" | "Gigabits" | "Terabits" | "Percent" | "Count" 
    | "Bytes/Second" | "Kilobytes/Second" | "Megabytes/Second" | "Gigabytes/Second" | "Terabytes/Second" 
    | "Bits/Second" | "Kilobits/Second"
    | "Megabits/Second" | "Gigabits/Second" | "Terabits/Second" | "Count/Second" | "None"
    */

    let params = {
        EndTime: '2019-11-15T21:30:00Z',
        MetricName: 'CPUUtilization',
        Dimensions:[{Name:"yAxis",Value:"left"}],
        Namespace: 'AWS/EC2',
        Period: 300,
        StartTime: '2019-11-15T18:00:00Z',
        Statistics: ["Maximum"],
        Unit: "Seconds"
    };
    
    let cloudwatch = new AWS.CloudWatch({apiVersion: '2012-10-17'});

    cloudwatch.getMetricStatistics(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
    });


    /*App logic*/
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