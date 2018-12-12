// This is the js for the default/index.html view.

var app = function () {

    var self = {};

    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function (a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    // Enumerates an array.
    var enumerate = function (v) { var k = 0; return v.map(function (e) { e._idx = k++; }); };

    self.make_profile = function () {
        $.web2py.disableElement($("#make-profile"));
        let sent_fname = self.vue.fname;
        let sent_lname = self.vue.lname;
        let sent_info = self.vue.contact;
        let sent_city = self.vue.city_name;
        let sent_image = self.vue.image;
        $.post(make_profile_URL,
            {
                first_name: self.vue.fname,
                last_name: self.vue.lname,
                contact_info: self.vue.contact,
                city: self.vue.city_name,
                image: self.vue.image,
            },
            function (data) {
                $.web2py.enableElement($("#make-profile"));
                self.vue.fname = "";
                self.vue.lname = "";
                self.vue.contact = "";
                self.vue.city_name = "";
                self.vue.image = null;
                let new_profile = {
                    id: data.profile_id,
                    first_name: sent_fname,
                    last_name: sent_lname,
                    contact_info: sent_info,
                    city: sent_city,
                    image: sent_image,
                };
                console.log(new_profile);
                // self.vue.profile_list.unshift(new_profile);
                //self.process_profiles();
            }
        );
        $.web2py.enableElement($("#make-profile"));
        console.log("end input");
    };

    // javascript for holding the image and allow for it to be passed to database
    self.image_changed = function (event) {
        let input = event.target;
        let file = input.files[0];
        if (file) {
            let reader = new FileReader();
            reader.addEventListener('load', function () {
                self.vue.image = reader.result
                // console.log(self.vue.image);
            }, false);
            reader.readAsDataURL(file);
        }
    };

    self.process_owners = function () {
        enumrate(self.vue.owner_list);
        self.vue.owner_list.map(function (e) {
            Vue.set(e, 'pet_list', []);
            Vue.set(e, 'pet_description', "");
            Vue.set(e, 'isLive', e.live);
        });
    };

    self.add_sitter = function () {
        console.log("add_sitter called");
        let sent_sitter_descript = self.vue.sitter_description;
        $.post(add_sitter_URL, {
            description: sent_sitter_descript,
            live: true,
        }, function (data) {
            self.vue.sitter_description = "";
            let new_sitter = {
                id: data.sitter_id,
                description: sent_sitter_descript,
            };
            // self.vue.sitter_list.unshift(new_sitter);
            //self.process_sitters();
        });
    };

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
            }
        );
    };

    self.toggle_sitter_form = function () {
        self.vue.show_sitter_form = !self.vue.show_sitter_form;
        self.vue.show_owner_form = false;
        self.vue.show_both_form = false;
    };

    self.toggle_owner_form = function () {
        self.vue.show_owner_form = !self.vue.show_owner_form;
        self.vue.show_sitter_form = false;
        self.vue.show_both_form = false;
    };

    self.toggle_both_form = function () {
        self.vue.show_both_form = !self.vue.show_both_form;
        self.vue.show_owner_form = false;
        self.vue.show_sitter_form = false;
    };

    //checkBlur() takes care of de-highlighting the radio buttons when we ask the 
    //user to input owner and sitter decription.
    self.checkBlur = function () {
        if (!self.vue.show_both_form && !self.vue.show_sitter_form && !self.vue.show_owner_form) {
            document.getElementById('inlineRadio1').checked = false;
            document.getElementById('inlineRadio2').checked = false;
            document.getElementById('inlineRadio3').checked = false;
        }
    };

    self.fun = function () {
        alert("Test");
    };

    self.add_owner = function () {
        let sent_owner_descript = self.vue.owner_description
        $.post(add_owner_URL, {
            description: sent_owner_descript,
            live: true,
        }, function (data) {
            self.vue.owner_description = "";
            let new_owner = {
                id: data.owner_id,
                description: sent_owner_descript,
            };
            // self.vue.owner_list.unshift(new_owner);
            //self.process_owners();
        }
        );
    };

    self.add_pet = function () {
        let sent_name = self.vue.pet_name;
        let sent_species = self.vue.pet_species;
        let sent_description = self.vue.pet_description;
        $.post(add_pet_URL, {
            pet_name: sent_name,
            species: sent_species,
            description: sent_description,
        }, function (data) {
            self.vue.pet_name = "";
            self.vue.pet_species = "";
            self.vue.pet_description = "";
            let new_pet = {
                id: data.pet_id,
                pet_name: sent_name,
                species: sent_species,
                description: sent_description,
            };
            console.log(new_pet);
            self.vue.pet_list.unshift(new_pet);
            self.process_pets();
        });
    };

    self.add_pet_alert = function () {
        alert("Please Select A Pet!");
    };

    self.reset_species = function () {
        self.vue.pet_species = "";
    };

    // self.get_petlist = function(){
    //     $.getJSON(get_petlist_url,function(response){
    //         self.vue.pet_list = response.pet_list;
    //         self.process_pets();
    //     });
    // };

    self.process_pets = function(){
        var i=0;
        self.vue.pet_list.map(function(e){
            Vue.set(e,'idx', i++);
        });
    };

    self.delete_pet = function(idx){
        $.post(delete_pet_url, {
            id: self.vue.pet_list[idx].id,
        }, function(response){
            self.vue.pet_list.splice(idx,1);
            self.process_pets();
        });
    };

    // //for testing images
    // self.get_image = function (){
    //     console.log(logged_in_userID);
    //     $.getJSON(get_image_url, // https://host/app/api/get_image_url?post_id=4
    //         {
    //             profile_id: logged_in_userID,
    //         },
    //         function (data) {
    //             self.vue.received_image = data.image_url;
    //         });
    //     console.log(self.vue.received_image);
    // };

    self.view_profile = function(user_id) {
        $.getJSON(view_profile_url, {
            userID: user_id,
        }, function(data) {
            self.vue.a_profile=data.currProfile;
            self.vue.image=data.image_url;
            console.log(data.currOwner!=undefined);
            if ((data.currOwner!=undefined)&&(data.currSitter!=undefined)) {
                self.vue.a_sitter=data.currOwner;
                self.vue.a_owner=data.currSitter;
            }
            else if (data.currOwner!=undefined) {
                self.vue.a_owner=data.currOwner;
            }
            else if (data.currSitter!=undefined) {
                self.vue.a_sitter=data.currSitter;
            }
            console.log(self.vue.a_owner);
        });
        if ((self.vue.a_sitter!=undefined)&&(self.vue.a_owner!=undefined)) {
            self.vue.isOwner=true;
            self.vue.isSitter=true;
        }
        else if (self.vue.a_owner!=undefined) {
            self.vue.isOwner=true;
        }
        else if (self.vue.a_sitter!=undefined) {
            self.vue.isSitter=true;
        }
        console.log(self.vue.isOwner);
        console.log(logged_in_userID);
        console.log(self.vue.a_profile);
    };

    /* 
    //=====Below is the code for Various functions that we may or may not need=====
        
    self.add_pet = function(o_idx){
        let o = self.vue.profile_list.owner_list[o_idx];
        let new_pet = {
            ownerID: o.id,
            pet_name: o.pet_name,
            species: o.species,
            description: o.pet_description,
        };
        $.post(add_pet_URL, new_pet, function(response){
            new_pet['id'] = response.id;
            o.unshift(new_pet);
            //self.process_owners();
        });
        o.pet_description = "";
    };

    self.get_profiles = function () {
        $.getJSON(get_profiles_URL, function (data) {
            self.vue.profile_list = data.profile_list;
            self.process_profiles();
            console.log("got list");
        });
        console.log("fired get");
    };

    self.process_profiles = function () {
        enumerate(self.vue.profile_list);
        self.vue.profile_list.map(function (e) {
            Vue.set(e, 'isSitter', false);
            Vue.set(e, 'isOwner', false);
        });
    };

    self.process_sitters = function () {
        enumrate(self.vue.sitter_list);
        self.vue.sitter_list.map(function (e) {
            Vue.set(e, 'isLive', e.live);
        });
    };

    self.edit_profile = function (p_idx) {
        let p = self.vue.profile_list[p_idx];
        $.post(edit_profile_URL, {
            id: p.id,
            first_name: p.first_name,
            last_name: p.last_name,
            contact_info: p.contact_info,
            city: p.city,
        });
        console.log("updated");
    };
    */


    // Complete as needed.
    self.vue = new Vue({
        el: "#main",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            state: 'home',
            a_profile: [],
            a_sitter: [],
            a_owner: [],
            a_pets: [],
            isOwner: false,
            isSitter: false,
            contact: "",
            fname: "",
            lname: "",
            city_name: "",
            profile_data: [],
            cities: [],
            sitter_description: "",
            owner_description: "",
            pet_list: [],
            pet_name: "",
            pet_species: "",
            pet_description: "",
            image: null,
            show_sitter_form: false,
            show_owner_form: false,
            show_both_form: false,
        },
        methods: {
            change_state: self.change_state,
            load_listings: self.load_listings,
            make_profile: self.make_profile,
            add_sitter: self.add_sitter,
            add_owner: self.add_owner,
            add_pet: self.add_pet,
            image_changed: self.image_changed,
            view_profile: self.view_profile,
            // get_profiles: self.get_profiles,
            is_user_adding: self.is_user_adding,
            //process_profiles: self.process_profiles,
            process_sitter: self.process_sitter,
            process_owners: self.process_owners,
            fun: self.fun,
            toggle_owner_form: self.toggle_owner_form,
            toggle_sitter_form: self.toggle_sitter_form,
            toggle_both_form: self.toggle_both_form,
            checkBlur: self.checkBlur,
            extend: self.extend,
            enumerate: self.enumerate,
            add_pet_alert: self.add_pet_alert,
            reset_species: self.reset_species,
            get_image: self.get_image,
            delete_pet: self.delete_pet
        }
    });
    // self.get_profiles();

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function () { APP = app(); });
