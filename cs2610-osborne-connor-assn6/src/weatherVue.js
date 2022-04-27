var app = new Vue({
    el: '#app',
    data: {
        loaded: false,
        likely_count: 0,
        normal_count: 0,
        unlikely_count: 0,

        city: " ",
        state: " ",
        country: " ",

        forecast_list: null,
        daily_list: null,
        current_date: null,

        count: 0,
        dates: [],
        styles:[],
        styleObject: {
            'border-radius': '15px',
            background: 'gray',
            width: '300px',
            border:'2px solid gray',
            color: 'white',
            'font-family': '"Noto Sans", sans-serif',
            'text-align': 'center',
            display: 'inline-block',
            margin: '10px'},
    },
    methods: {
        vote: function(n) {
            if (app.styles[n].background == "gray") {
                app.styles[n].background = "green";
                app.normal_count--;
                app.likely_count++;
            }
            else if (app.styles[n].background == "green") {
                app.styles[n].background = "red";
                app.likely_count--;
                app.unlikely_count++;
            }
            else if (app.styles[n].background == "red") {
                app.styles[n].background = "gray";
                app.unlikely_count--;
                app.normal_count++;
            }
        }
    },
    created(){
        let locapi = 'cd0fcc9ee9e5b3710c59881c23299809';
        let weatherapi = '1725f80349b6e441b93de80777b0c6dc';
        var locURL = `http://api.ipstack.com/check?access_key=${locapi}`;

        fetch(locURL)
            .then(l => l.json())
            .then(locData => {
                app.city = locData.city;
                app.state = locData.region_name;
                app.country = locData.country_name;
                let lat = locData.latitude;
                let lon = locData.longitude;
                var weatherURL = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${weatherapi}&units=imperial`;
                fetch(weatherURL)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (json) {
                        app.daily_list = json;
                        app.current_date = convert(Number(app.daily_list.dt));
                    });

                var forecastURL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&APPID=${weatherapi}&units=imperial`;

                fetch(forecastURL)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (json) {
                        app.forecast_list = json;

                        app.count = Number(app.forecast_list.list.length);
                        app.normal_count = app.count - 1;

                        for (i = 0; i < app.count; i++) {
                            app.dates.push(convert(Number(app.forecast_list.list[i].dt)));

                            var copy = Object.assign({}, app.styleObject);
                            app.styles.push(copy);
                        }
                    });
            });
        app.loaded = true;
    }
});

function convert(timestamp) {
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var d = new Date(timestamp * 1000),
        yyyy = d.getFullYear(),
        mm = ('0' + (d.getMonth() + 1)).slice(-2),
        dd = ('0' + d.getDate()).slice(-2),
        hh = d.getHours(),
        h = hh,
        min = ('0' + d.getMinutes()).slice(-2),
        ampm = 'AM',
        time;

    if (hh > 12) {
        h = hh - 12;
        ampm = 'PM';
    } else if (hh === 12) {
        h = 12;
        ampm = 'PM';
    } else if (hh == 0) {
        h = 12;
    }

    month = months[Number(mm)];
    time = month + " " + dd + " " + yyyy +' at ' + h + ':' + min + ' ' + ampm;

    return time;
}
