let apikey = 'x35gV-p5u8QtHdwgi-we';
let start = new Date();
let end = new Date();
start.setDate(end.getDate()-5);
end = (end.getFullYear + (('0' + (end.getMonth()+1)).slice(-2)) + (('0' + end.getDate()).slice(-2)));
start = (start.getFullYear + (('0' + (start.getMonth()+1)).slice(-2)) + (('0' + start.getDate()).slice(-2)));
var data;
var goldPer = 0;
var goldPrice;
var goldRUrl = `https://www.quandl.com/api/v3/datasets/LBMA/GOLD.json?api_key=${apikey}&column_index=2&
start_date=${start}&end_date=${end}`;

console.log(goldRUrl);

fetch(goldRUrl)
    .then( r => r.json() )
    .then( json => {
        data = json;
        let i;
        for (i = 0; i < data.dataset.data.length; i++){
            goldPer += parseFloat(data.dataset.data[i][1]);
            goldPrice = goldPer / data.dataset.data.length;
        }
    });




var convValue;
var converter;
var money;
var conversion = function (value) {
    var tester = !/\D/.test(value);
    if (!tester){
        document.querySelector('#quandl').textContent = `You have to put in a number value or it wont work!!!!!!`;
    }
    else{
        let convUrl = `http://127.0.0.1:8000/unitconv/convert?from=lbs&to=t_oz&value=${value}`;
        fetch(convUrl)
            .then(x => x.json())
            .then(json =>{
                convValue = json;
                converter = parseFloat(convValue.value);
                money = (goldPrice *  converter);
                document.querySelector('#quandl').textContent = `You would be worth ${money} dollars if you were made of gold!!!!!!`;
            });

    }
};