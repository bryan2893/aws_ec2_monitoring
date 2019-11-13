const equivalenceTable = [1,2,4,8,16,32,64,128];

const maskClasses = [8,16,24];//contiene las máscaras de red válidas.

const ipv4Length = 32;

const reverseString = function(string){
    let newString = "";
    for (let i = string.length - 1; i >= 0; i--) { 
        newString += string[i];
    }
    return newString;
}

const transformBinaryOctectToDecimal = function(octect){
    let reversedString = reverseString(octect);//Se invierte la secuencia para efectos de calculo.

    let decimalEquivalent = 0;
    for(let i= 0;i<reversedString.length;i++){
        if(reversedString[i] === "1"){
            decimalEquivalent += equivalenceTable[i];
        }
    }
    return decimalEquivalent;
};


const transformBinaryIpToDecimalIp = function(binaryIp){//decimalIp is something like this "255.255.224.0"
    let octectsArray = binaryIp.split(".");

    let arrayOfDecimalOctets = [];
    for(let i = 0;i<octectsArray.length;i++){
        try{
            arrayOfDecimalOctets.push(transformBinaryOctectToDecimal(octectsArray[i]));
        }catch(error){
            return new Error(error.message);
        }
    }

    return arrayOfDecimalOctets.join(".");
};

const transformDecimalOctectToBinary = function(decimalNumber){
    if(0 <= decimalNumber <= 255){
        stringResult = "";
        let currentDecimal = decimalNumber;
        for(let i = 0;i<equivalenceTable.length;i++){
            if(currentDecimal >= equivalenceTable[(equivalenceTable.length-1)-i]){
                stringResult += "1";
                currentDecimal -= equivalenceTable[(equivalenceTable.length-1)-i];
            }else{
                stringResult += "0";
            }
        }
        return stringResult;
    }else{
        throw new Error("El numero no puede ser menor a 0 ni mayor a 255");
    }
}

const transformDecimalIpToBinaryIp = function(decimalIp){//decimalIp is something like this "255.255.224.0"
    let octectsArray = decimalIp.split(".");

    let arrayOfInts = octectsArray.map(function(decimal){
        return parseInt(decimal);
    });

    let arrayOfBinaryOctets = [];
    for(let i = 0;i<arrayOfInts.length;i++){
        try{
            arrayOfBinaryOctets.push(transformDecimalOctectToBinary(arrayOfInts[i]));
        }catch(error){
            return new Error(error.message);
        }
    }

    return arrayOfBinaryOctets.join(".");
};

//2 elevado N >= C ========> C = cantidad de subredes a crear, N es lo que determina la funcion.
const resolveFormula = function(amountOfNetworksNeeded){
    for(let i = 0;i<equivalenceTable.length;i++){
        if(amountOfNetworksNeeded <= equivalenceTable[i]){
            return i;
        }
    }
    return null;
};

const getBinaryIpFromShortDecimalNetMaskRepresentation = function(shortNetMaskRepresentation){ //netMaskShortRepresentation = 24 -> 11111111.11111111.11111111.00000000
    let cont = 0;
    let onesCounter = 0;
    let octectsArray = [];
    while(cont < 4){
        let binaryOctect = "";
        let cont2 = 0;
        while(cont2 < 8){
            if(onesCounter < shortNetMaskRepresentation){
                binaryOctect += "1";
                onesCounter += 1;
            }else{
                binaryOctect += "0";
            }
            cont2++;
        }
        octectsArray.push(binaryOctect);
        cont++;
    }
    return octectsArray.join(".");
};

const countOnesInBinaryMask = function(binaryMaskString){
    let counter = 0;
    for(let i = 0;i<binaryMaskString.length;i++){
        if(binaryMaskString[i] === "1"){
            counter += 1;
        }
    }
    return counter;
}

const getSkipedSubnetDirection = function(ip,netMask,netSkip){
    let decimalOctets = ip.split(".");
    let transformedOctetsToNumbers = decimalOctets.map(function(stringOctect){
        return parseInt(stringOctect);
    });
    let byteThatChange = null;
    if(netMask === 8){
        byteThatChange = 1;
    }else if(netMask === 16){
        byteThatChange = 2;
    }else if(netMask === 24){
        byteThatChange = 3;
    }else{
        return new Error("Máscara inválida!");
    }
    transformedOctetsToNumbers[byteThatChange] += netSkip;
    return transformedOctetsToNumbers.join(".");
};

const getSubnetFirstLastAndBroadcast = function(subnetDecimalIpSecuence,netMask,netSkip){

    let decimalOctets = subnetDecimalIpSecuence.split(".");
    let transformedOctetsToNumbers = decimalOctets.map(function(stringOctect){
        return parseInt(stringOctect);
    });

    let firstIp,lastIp,broadcast = null;
    if(netMask === 8){
        let first = [...transformedOctetsToNumbers];
        first[3] += 1
        firstIp = first;
        let last = [...first];
        last[1] += netSkip-1;
        last[2] = 255;
        last[3] = 254;
        lastIp = last;
        let broad = [...last];
        broad[2] = 255;
        broad[3] = 255;
        broadcast = broad;
    }else if(netMask === 16){
        let first = [...transformedOctetsToNumbers];
        first[3] += 1
        firstIp = first;
        let last = [...first];
        last[2] += netSkip-1;
        last[3] = 254;
        lastIp = last;
        let broad = [...last];
        broad[3] = 255;
        broadcast = broad;
    }else if(netMask === 24){
        let first = [...transformedOctetsToNumbers];
        first[3] += 1
        firstIp = first;
        let last = [...transformedOctetsToNumbers];
        last[3] += netSkip - 2;
        lastIp = last;
        let broad = [...transformedOctetsToNumbers];
        broad[3] += netSkip - 1;
        broadcast = broad;
    }else{
        return new Error("Máscara inválida!");
    }
    
    let rowPortion = {subnet:transformedOctetsToNumbers.join(".")
                        ,first:firstIp.join("."),
                        last:lastIp.join("."),
                        broadcast:broadcast.join(".")};

    return rowPortion;
};


const getSubnets = function(decimalNetworkAddresIp,shortNetMaskRepresentation,amountOfSubnetsNeeded){

    let subnetIfo = {
        networkAddress:decimalNetworkAddresIp,
        netMask: null,
        amountOfSubnets: null,
        newMask: null,
        hostsPerSubnet: null,
        networkSkip: null,
        rowsToDisplay:[]
    };

    let N = resolveFormula(amountOfSubnetsNeeded);
    let amountOfSubnets = Math.pow(2,N); //cantidad de subredes que se crearán.
    let binaryRepOfNetMask = getBinaryIpFromShortDecimalNetMaskRepresentation(shortNetMaskRepresentation);

    let newShortDecimalMaskRepresentation = shortNetMaskRepresentation + N;

    let newbinaryRepOfNetMask = getBinaryIpFromShortDecimalNetMaskRepresentation(newShortDecimalMaskRepresentation);

    let M = ipv4Length - countOnesInBinaryMask(newbinaryRepOfNetMask);//representa la cantidad de ceros o de bits destinados a host.

    let hostsPerSubnet = (Math.pow(2,M)) - 2;

    let modifiedOctectBinaryRep = "1".repeat(N) + "0".repeat(8-N);

    let networkSkip = 256 - transformBinaryOctectToDecimal(modifiedOctectBinaryRep); //representa el salto de red.


    subnetIfo.netMask = transformBinaryIpToDecimalIp(binaryRepOfNetMask);
    subnetIfo.amountOfSubnets = amountOfSubnets;
    subnetIfo.newMask = transformBinaryIpToDecimalIp(newbinaryRepOfNetMask);
    subnetIfo.networkSkip = networkSkip;
    subnetIfo.hostsPerSubnet = hostsPerSubnet;

    let i = 0;
    let currentDirection = decimalNetworkAddresIp;
    while(i < amountOfSubnets){
        let rowinfo = getSubnetFirstLastAndBroadcast(currentDirection,shortNetMaskRepresentation,networkSkip);
        subnetIfo.rowsToDisplay.push(rowinfo);
        let nextSkip = getSkipedSubnetDirection(currentDirection,shortNetMaskRepresentation,networkSkip);
        currentDirection = nextSkip;
        i++;
    }

    return subnetIfo;
};