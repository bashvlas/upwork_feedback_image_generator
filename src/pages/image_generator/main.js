
	new Vue({

		el: "#root",
		data: {

			feedback_image_type: "dark_wood_style",
			feedback_data_arr: [],

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

			element_to_image_url: async ( element ) => {

				var canvas = await html2canvas( element );

				var img_url = canvas.toDataURL( "image/png" );

				return img_url;

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