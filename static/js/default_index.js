// This is the js for the default/index.html view.
//$.post(get_profiles_list_url);

$.post(get_profiles_list_url, {}, function (data) {
    //self.vue.profile_list = data.profile_list;
    //console.log(data);
});

var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    // Enumerates an array
    var enumerate = function(v) { var k=0; return v.map(function(e) {e._idx = k++;});};

    // Allows us to keep one page app
    self.change_state = function(state_name) {
        self.vue.state = state_name;
        
    };

    // Controls what profiles will load
    self.load_listings = function(state_name, data_to_load){
        self.vue.state = state_name;

        $.getJSON(get_profiles_list_url, 
            {
                //Pretty sure this is where filters will be
            }, 

            function (data) 
            {
                
                //self.vue.profile_list = data.profile_list;
                self.vue.cities = data.cities;
                self.vue.profile_data = data.result;
                console.log(data);

            });
    };

    

    // Complete as needed.
    self.vue = new Vue({
        el: "#main",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            state: 'home',
            profile_data: [],
            cities: []

        },
        methods: {
            change_state: self.change_state,
            load_listings: self.load_listings
        }

    });



    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
