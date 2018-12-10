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
                self.vue.profile_list.unshift(new_profile);
                //self.process_profiles();
            }
        );
        console.log("end input");
    };

    //javascript for holding the image and allow for it to be passed to database
    self.image_changed = function (event) {
        let input = event.target;
        let file = input.files[0];
        if (file) {
            let reader = new FileReader();
            reader.addEventListener('load', function () {
                self.vue.image = reader.result
            }, false);
            reader.readAsDataURL(file);
        }
    };

    // self.get_profiles = function () {
    //     $.getJSON(get_profiles_URL, function (data) {
    //         self.vue.profile_list = data.profile_list;
    //         self.process_profiles();
    //         console.log("got list");
    //     });
    //     console.log("fired get");
    // };

    // self.process_profiles = function () {
    //     enumerate(self.vue.profile_list);
    //     self.vue.profile_list.map(function (e) {
    //         Vue.set(e, 'isSitter', false);
    //         Vue.set(e, 'isOwner', false);
    //     });
    // };

    // self.process_sitters = function () {
    //     enumrate(self.vue.sitter_list);
    //     self.vue.sitter_list.map(function (e) {
    //         Vue.set(e, 'isLive', e.live);
    //     });
    // };

    // self.process_owners = function () {
    //     enumrate(self.vue.owner_list);
    //     self.vue.owner_list.map(function (e) {
    //         Vue.set(e, 'pet_list', []);
    //         Vue.set(e, 'pet_description', "");
    //         Vue.set(e, 'isLive', e.live);
    //     });
    // };

    self.add_sitter = function() {
        console.log("add_sitter called");
        let sent_sitter_descript = self.vue.sitter_description;
        $.post(add_sitter_URL, {
                description: sent_sitter_descript,
                live: true,
            }, function(data) {
                self.vue.sitter_description="";
                let new_sitter = {
                    id: data.sitter_id,
                    description: sent_sitter_descript,
                };
                self.vue.sitter_list.unshift(new_sitter);
                //self.process_sitters();
            }
        );
    };

    self.add_owner = function() {
        console.log("add_owner called");
        let sent_owner_descript = self.vue.owner_description
        $.post(add_owner_URL, {
                description: sent_owner_descript,
                live: true,
            }, function(data) {
                self.vue.owner_description="";
                let new_owner = {
                    id: data.owner_id,
                    description: sent_owner_descript,
                };
                self.vue.owner_list.unshift(new_owner);
                //self.process_owners();
            }
        );
    };

    self.add_pet = function (p_idx, o_idx) {
        let o = self.vue.profile_list[p_idx].owner_list[o_idx];
        let new_pet = {
            ownerID: o.id,
            pet_name: o.pet_name,
            species: o.species,
            description: o.pet_description,
        };
        $.post(add_pet_URL, new_pet, function (response) {
            new_pet['id'] = response.id;
            o.unshift(new_pet);
            self.process_owners();
        });
        o.pet_description = "";
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

    self.fun = function () {
        alert("hello");
    };

    self.change_state = function (state_name) {
        self.vue.state = state_name;
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


    // Complete as needed.
    self.vue = new Vue({
        el: "#main",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            state: 'home',
            contact: "",
            fname: "",
            lname: "",
            city_name: "",
            profile_list: [],
            sitter_list: [],
            sitter_description: "",
            owner_list: [],
            owner_description: "",
            makingProfile: false,
            image: null,
            show_sitter_form: false,
            show_owner_form: false,
            show_both_form: false,
        },
        methods: {
            make_profile: self.make_profile,
            add_sitter: self.add_sitter,
            add_owner: self.add_owner,
            add_pet: self.add_pet,
            image_changed: self.image_changed,
            return_profileid: self.return_profileid,
            // get_profiles: self.get_profiles,
            is_user_adding: self.is_user_adding,
            //process_profiles: self.process_profiles,
            process_sitter: self.process_sitter,
            process_owners: self.process_owners,
            edit_profile: self.edit_profile,
            fun: self.fun,
            toggle_owner_form: self.toggle_owner_form,
            toggle_sitter_form: self.toggle_sitter_form,
            toggle_both_form: self.toggle_both_form,
            checkBlur: self.checkBlur,
            extend: self.extend,
            enumerate: self.enumerate,
        }
    });
    // self.get_profiles();

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function () { APP = app(); });
