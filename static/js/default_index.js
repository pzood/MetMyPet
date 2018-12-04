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
        var sent_name = self.vue.profile_name;
        var sent_info = self.vue.contact;
        var sent_city = self.vue.city_name;
        $.post(make_profile_URL,
            {
                name: self.vue.profile_name,
                contact_info: self.vue.contact,
                sent_city: self.vue.city_name,
            },
            function(data) {
                self.vue.profile_name="";
                self.vue.contact="";
                self.vue.city_name="";
                var new_profile = {
                    id: data.profile_entry.id,
                    name: sent_name,
                    contact_info: sent_info,
                    sent_city: sent_city,
                };
                self.vue.profile_entry.unshift(new_profile);
                self.process_profiles();
            }
        );
    };

    self.process_profiles = function() {
        enumerate(self.vue.profile_list);
        self.vue.profile_list.map(function(e) {
            Vue.set(e, 'sitter_list', []);
            Vue.set(e, 'sitter_description', "");
            Vue.set(e, 'owner_list', []);
            Vue.set(e, 'owner_description', "");
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
        var new_sitter= {
            profileID: self.vue.profile_list[p_idx].id;
            description: self.vue.profile_list[p_idx].sitter_description;
        };
        $.post(add_sitter_URL, new_sitter, function(response)
        {
            new_sitter['id']=response.id;
            self.vue.profile_list[p_idx].sitter_list.unshift(new_sitter);
            self.process_sitter(p_idx);
        });
        self.vue.profile_list[p_idx].sitter_description="";
    };

    self.add_owner = function(p_idx) {
        var new_owner= {
            profileID: self.vue.profile_list[p_idx].id;
            description: self.vue.profile_list[p_idx].owner_description;
        };
        $.post(add_owner_URL, new_owner, function(response)
        {
            new_owner['id']=response.id;
            self.vue.profile_list[p_idx].sitter_list.unshift(new_sitter);
            self.process_sitter(p_idx);
        });
        self.vue.profile_list[p_idx].owner_description="";
    };

    self.add_pet = function(p_idx, o_idx) {
        var o = self.vue.profile_list[p_idx].owner_list[o_idx];
        var new_pet = {
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

    // Complete as needed.
    self.vue = new Vue({
        el: "#main",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            state: 'home',
            contact: "",
            profile_name: "",
            city_name: "",
            profile_list: [],
        },
        methods: {
            make_profile: self.make_profile,
            add_sitter: self.add_sitter,
            add_owner: self.add_owner,
            add_pet: self.add_pet,
            process_profiles: self.process_profiles,
            process_sitter: self.process_sitter,
            process_owners: self.process_owners,
        }
    });


    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
