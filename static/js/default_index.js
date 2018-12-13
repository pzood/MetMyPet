// This is the js for the default/index.html view.
//$.post(get_profiles_list_url);

var app = function () {

	var self = {};

	Vue.config.silent = false; // show all warnings

	// Extends an array
	self.extend = function (a, b) {
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
		self.vue.show_search_bar = true;
		// Reset fields to default
		self.vue.searchLocation = '';
		self.vue.searchRole = type;
		self.vue.searchEmail = '';
		self.vue.searchPet = '';

		// Do default search
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
				enumerate(self.vue.profile_data);
				console.log(data);
			});
	};

	// Enumerates an array.
	self.make_profile = function () {
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
		let sent_owner_descript = self.vue.owner_description;
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
		});
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

	self.view_profile = function(user_id) {
		$.getJSON(view_profile_url, {
			userID: user_id,
		}, function(data) {
			self.vue.a_profile=data.currProfile;
			self.vue.image=data.image_url;
			console.log(data.currOwner.length>0);
			if ((data.currOwner.length>0)&&(data.currSitter.length>0)) {
				self.vue.a_sitter=data.currOwner;
				self.vue.a_owner=data.currSitter;
			}
			else if (data.currOwner.length>0) {
				self.vue.a_owner=data.currOwner;
			}
			else if (data.currSitter.length>0) {
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
		console.log(user_id);
		console.log(self.vue.is);
		console.log(self.vue.a_profile);
	};

	self.toggleFav = function (idx) {
		let p = self.vue.profile_data[idx];
        Vue.set(p, 'fav', !p.fav);
        $.post(toggle_favorite_url, {
        	id: p.auth_user.id
		});
	};

	self.initContacts = function () {
		self.vue.show_search_bar = false;
		$.post(get_favorites_list_url, {}, function (data) {
			console.log(data);
            self.vue.profile_data = data.favorites;
		});
	};
  
	// Complete as needed.
	self.vue = new Vue({
		el: "#vue-div",
		delimiters: ['${', '}'],
		unsafeDelimiters: ['!{', '}'],
		data: {
			state: 'home',
			searchLocation: '',
			searchRole: '',
			searchPet: '',
			searchEmail: '',
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
			logged_in_userID: logged_in_userID,
		},
		methods: {
			change_state: self.change_state,
			// load_listings: self.load_listings,
			make_profile: self.make_profile,
			add_sitter: self.add_sitter,
			add_owner: self.add_owner,
			add_pet: self.add_pet,
			image_changed: self.image_changed,
			view_profile: self.view_profile,
			// get_profiles: self.get_profiles,
			// is_user_adding: self.is_user_adding,
			//process_profiles: self.process_profiles,
			// process_sitter: self.process_sitter,
			// process_owners: self.process_owners,
			fun: self.fun,
			toggle_owner_form: self.toggle_owner_form,
			toggle_sitter_form: self.toggle_sitter_form,
			toggle_both_form: self.toggle_both_form,
			checkBlur: self.checkBlur,
			extend: self.extend,
			add_pet_alert: self.add_pet_alert,
			reset_species: self.reset_species,
			delete_pet: self.delete_pet,
			change_state: self.change_state,
			executeSearch: self.executeSearch,
			initSearch: self.initSearch,
			toggleFav: self.toggleFav,
			initContacts: self.initContacts,
		}
	});
	// self.get_profiles();


	return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function() { APP = app(); });
