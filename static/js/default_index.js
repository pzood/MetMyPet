// This is the js for the default/index.html view.
//$.post(get_profiles_list_url);

$.post(get_profiles_list_url);
// $.getJSON(
// 	"http://getnearbycities.geobytes.com/GetNearbyCities?callback=?&radius=100&locationcode=Santa%20Cruz,%20CA&limit=20",
// 		 function (data) {
//
// 		 }
// 	 );

var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    self.change_state = function(state_name) {
        self.vue.state = state_name;
        
    };

    self.load_listings = function(state_name, data_to_load){
        self.vue.state = state_name;
    };

    // Complete as needed.
    self.vue = new Vue({
        el: "#main",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            state: 'home'
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
