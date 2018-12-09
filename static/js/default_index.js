// This is the js for the default/index.html view.

var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    // Enumerates an array.
    var enumerate = function(v) { var k=0; return v.map(function(e) {e._idx = k++;});};

    self.make_profile = function() {
        console.log("yo");
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
            function(data) {
                $.web2py.enableElement($("#make-profile"));
                self.vue.fname="";
                self.vue.lname="";
                self.vue.contact="";
                self.vue.city_name="";
                self.vue.image=null;
                let new_profile = {
                    id: data.profile_entry,
                    first_name: sent_fname,
                    last_name: sent_lname,
                    contact_info: sent_info,
                    city: sent_city,
                    image: sent_image,
                };
                console.log(new_profile);
                self.vue.profile_list.unshift(new_profile);
                self.process_profiles();
            }
        );
        console.log("end input");
    };

    self.image_changed = function(event){
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

    // self.get_profiles = function() {
    //     $.getJSON(get_profiles_URL, function(data) {
    //         self.vue.profile_list=data.profile_list;
    //         console.log(data.profile_list);
    //         self.process_profiles();
    //         console.log("got list");
    //     });
    //     console.log("fired get");
    // };

    self.process_profiles = function() {
        enumerate(self.vue.profile_list);
        self.vue.profile_list.map(function(e) {
            Vue.set(e, 'sitter_list', []);
            Vue.set(e, 'sitter_description', "");
            Vue.set(e, 'isSitter', false);
            Vue.set(e, 'owner_list', []);
            Vue.set(e, 'owner_description', "");
            Vue.set(e, 'isOwner', false);
            Vue.set(e, 'user_id', e.userID);
        });
    };

    self.process_sitter = function(p_idx) {
        enumrate(self.vue.profile_list[p_idx].sitter_list);
        self.vue.profile_list[p_idx].sitter_list.map(function(e) {
            Vue.set(e, 'isLive', e.live);
        });
    };

    self.process_owners = function(p_idx) {
        enumrate(self.vue.profile_list[p_idx].owner_list);
        self.vue.profile_list[p_idx].owner_list.map(function(e) {
            Vue.set(e, 'pet_list', []);
            Vue.set(e, 'pet_description', "");
            Vue.set(e, 'isLive', e.live);
        });
    };

    self.add_sitter = function(p_idx) {
        let new_sitter= {
            profileID: self.vue.profile_list[p_idx].id,
            description: self.vue.profile_list[p_idx].sitter_description,
        };
        $.post(add_sitter_URL, new_sitter, function(response)
        {
            new_sitter['id']=response.id;
            self.vue.profile_list[p_idx].sitter_list.unshift(new_sitter);
            self.process_sitter(p_idx);wa
        });
        self.vue.profile_list[p_idx].sitter_description="";
    };

    self.add_owner = function(p_idx) {
        let new_owner= {
            profileID: self.vue.profile_list[p_idx].id,
            description: self.vue.profile_list[p_idx].owner_description,
        };
        $.post(add_owner_URL, new_owner, function(response)
        {
            new_owner['id']=response.id;
            self.vue.profile_list[p_idx].owner_list.unshift(new_owner);
            self.process_sitter(p_idx);
        });
        self.vue.profile_list[p_idx].owner_description="";
    };

    self.add_pet = function(p_idx, o_idx) {
        let o = self.vue.profile_list[p_idx].owner_list[o_idx];
        let new_pet = {
            ownerID: o.id,
            pet_name: o.pet_name,
            species: o.species,
            description: o.pet_description,
        };
        $.post(add_pet_URL, new_pet, function(response) {
            new_pet['id']=response.id;
            o.unshift(new_pet);
            self.process_owners(p_idx);
        });
        o.pet_description="";
    };

    self.edit_profile = function(p_idx) {
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
            makingProfile: false,
            image: null,
        },
        methods: {
            make_profile: self.make_profile,
            add_sitter: self.add_sitter,
            add_owner: self.add_owner,
            add_pet: self.add_pet,
            image_changed: self.image_changed,
            // get_profiles: self.get_profiles,
            is_user_adding: self.is_user_adding,
            process_profiles: self.process_profiles,
            process_sitter: self.process_sitter,
            process_owners: self.process_owners,
            edit_profile: self.edit_profile,
            fun: self.fun,
        }
    });
    // self.get_profiles();

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
