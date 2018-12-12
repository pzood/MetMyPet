// This is the js for the default/index.html view.
//$.post(get_profiles_list_url);



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

    self.initSearch = function(type) {
        self.vue.searchRole = type;
        self.executeSearch();
    };

    self.executeSearch = function () {
        $.getJSON(get_profiles_list_url,
            {
                role: self.vue.searchRole,
                location: self.vue.searchLocation,
                email: self.vue.searchEmail,
                pet: self.vue.searchPet
            },

            function (data)
            {
                self.vue.cities = data.cities;
                self.vue.profile_data = data.result;
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
            cities: [],
            searchLocation: '',
            searchRole: 0,
            searchPet: 0,
            searchEmail: '',

        },
        methods: {
            change_state: self.change_state,
            executeSearch: self.executeSearch,
            initSearch: self.initSearch
        }

    });



    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
