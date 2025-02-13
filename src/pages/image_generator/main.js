
	Vue.component( 'fire_style_feedback', {

		template: document.querySelector( "#templates .fire_style_feedback" ).outerHTML,
		props: [ "feedback_data" ],
		methods: {},

	});

	Vue.component( 'upwork_style_feedback', {

		template: document.querySelector( "#templates .upwork_style_feedback" ).outerHTML,
		props: [ "feedback_data" ],
		methods: {

			get_upwork_style_text: function ( text ) {

				if ( text && text.length > 150 ) {

					var words = text.split( /\s+/g );
					var i = 0;

					text = "";

					while ( text.length < 150 ) {

						text += words[ i ] + " ";
						i += 1;

					};

					text = text.slice( 0, -1 ) + "...";

				};

				return	`“${ text }”`;

			},

		},

	});

	Vue.component( 'dark_wood_style_feedback', {

		template: document.querySelector( "#templates .dark_wood_style_feedback" ).outerHTML,
		props: [ "feedback_data" ],
		methods: {},

	});

	Vue.component( 'christmas_style_feedback', {

		template: document.querySelector( "#templates .christmas_style_feedback" ).outerHTML,
		props: [ "feedback_data" ],
		methods: {},

	});

	new Vue({

		el: "#root",
		data: {

			feedback_image_type: "upwork_style",
			feedback_data_arr: [],
			active_step_name: '1',

			selected_feedback_data: null,
			selected_style_name: null,

			style_name_arr: [

				// "christmas_style_feedback",
				// "fire_style_feedback",
				"upwork_style_feedback",
				"dark_wood_style_feedback",

			],

		},
		methods: {

			download_as_image: async function ( feedback_data, event ) {

				var image_container = $( event.target ).closest( ".feedback-card" ).find( ".feedback_image_container" ).get( 0 );

				var image_url = await this.element_to_image_url( image_container );

				this.download_file( "feedback.png", image_url );

			},

			download_file: function ( name, url ) {

				var link = document.createElement( "a" );
				link.download = name;
				link.href = url;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				delete link;

			},

			select_feedback: async function ( feedback_data ) {

				this.selected_feedback_data = feedback_data;
				this.active_step_name = '2';

			},

			select_style: function ( style_name ) {

				this.selected_style_name = style_name;
				this.active_step_name = '3';

			},

			element_to_image_url: async ( element ) => {

				var canvas = await html2canvas( element );

				var img_url = canvas.toDataURL( "image/png" );

				return img_url;

			},

			step_item_click: function ( step_item_name ) {

				if ( step_item_name === "select_feedback" ) {

					this.active_step_name = "1";

				} else if ( step_item_name === "select_style" && this.selected_feedback_data ) {

					this.active_step_name = "2";

				};

			},

			get_upwork_style_text: function ( text ) {

				if ( text && text.length > 150 ) {

					var words = text.split( /\s+/g );
					var i = 0;

					text = "";

					while ( text.length < 150 ) {

						text += words[ i ] + " ";
						i += 1;

					};

					text = text.slice( 0, -1 ) + "...";

				};

				return	`“${ text }”`;

			},

		},

		created: function () {

			chrome.storage.local.get([ "feedback_data_arr" ], ( storage ) => {

				this.feedback_data_arr = storage.feedback_data_arr;

			});

			chrome.storage.local.get([ "feedback_data_arr" ], ( storage ) => {

				console.log( storage.feedback_data_arr );

			});

		},

	});