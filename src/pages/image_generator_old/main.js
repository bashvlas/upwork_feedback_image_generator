
	function controller () {

		var _app = null;
		var _exec = null;
		var _state = {};

		var _pub = {

			element_to_image_url: async ( element ) => {

				var canvas = await html2canvas( element );

				var img_url = canvas.toDataURL( "image/png" );

				return img_url;

			},

			feedback_element_to_feedback_data: ( element ) => {

				var feedback_data = {};

				feedback_data.title = $( "h4", element ).text();
				feedback_data.text = $( "em", element ).text().trim();
				feedback_data.rating_number = $( "h4+ul strong", element ).text();

				return feedback_data;

			},

			render_feedback_data: ( feedback_data, exec ) => {

				$( ".feedback-text" ).text( `“${ feedback_data.text }”` );

			},

			kickstart: async( exec ) => {

				var storage = await exec( "chrome", "call", "storage.local.get", null );

				exec( "controller", "render_feedback_data", storage.latest_feedback_data );

				await _app.x.util.wait( 1000 );

				var image_url = await exec( "controller", "element_to_image_url", $( ".feedback" ).get( 0 ) );

				chrome.tabs.create({

					active: true,
					url: image_url,

				});

			},

			init: ( app ) => {

				_app = app;
				_exec = _app.exec.exec;

				_exec( "controller", "kickstart" );

			},

		};

		return _pub;

	};

	( async function ( x ) {

		// create app

			var resources = await x.util.load_resources([

				[ "config", "json", "local/config.json" ],

			]);

			var app = {

				name: "background",

				x: x,
				config: resources.config,

				log: x.modules.log(),
				hub: x.modules.hub(),
				exec: x.modules.exec(),

				chrome: x.modules.chrome(),
				bg_api: x.modules.bg_api(),

				controller: window.controller(),

			};

		// init modules

			app.log.init( app );
			app.hub.init( app );
			app.exec.init( app );

			app.chrome.init( app );
			app.bg_api.init( app );

		// register exec modules

			app.exec.add_module( "log", app.log );
			app.exec.add_module( "chrome", app.chrome );
			app.exec.add_module( "controller", app.controller );

		// register bg_api

			app.controller.init( app );

			app.bg_api.register( "controller", app.controller );

	} ( window[ window.webextension_library_name ] ) )
