
	function controller () {

		var _app = null;
		var _exec = null;
		var _state = {};

		var _pub = {

			url_to_image_data: function ( url ) {

				return new Promise( function ( resolve ) {

					var img = new Image();

					img.onload = function() {

						var canvas = document.createElement('canvas');
						document.body.appendChild(canvas);
						canvas.width = img.width;
						canvas.height = img.height;

						var ctx = canvas.getContext('2d');
						ctx.drawImage(img, 0, 0);

						data = canvas.toDataURL('image/png').slice('data:image/png;base64,'.length);

						document.body.removeChild( canvas );

						resolve( data );

					}

					img.src = url;

				});

			},

			url_to_base64: function ( url ) {

				return new Promise( function ( resolve ) {

					var xhr = new XMLHttpRequest();
					xhr.onload = function() {
						var reader = new FileReader();
						reader.onloadend = function() {
							resolve(reader.result);
						}
						reader.readAsDataURL(xhr.response);
					};
					xhr.open('GET', url);
					xhr.responseType = 'blob';
					xhr.send();

				});

			},

			init_cxt: async ( exec ) => {

				await exec( "chrome", "call", "contextMenus.removeAll" );
				await exec( "chrome", "call", "contextMenus.create", {

					id: "main",
					type: "normal",
					title: "Generate Images",
					contexts: [ "page" ],
					documentUrlPatterns: [ "https://www.upwork.com/fl/*", "https://www.upwork.com/freelancers/*", "https://www.upwork.com/o/profiles/*" ]

				});

			},

			handle_ctx_click: async ( info, tab, exec ) => {

				var result = await exec( "chrome", "call", "tabs.executeScript", tab.id, { file: "/js/content_script.js" } );

				exec( "log", "write_exec", "result", result );

				if ( result && result[ 0 ] ) {

					await exec( "chrome", "call", "storage.local.set", { feedback_data_arr: result[ 0 ] } );

					chrome.tabs.create({

						active: true,
						url: chrome.extension.getURL( "/pages/image_generator/index.html" ),

					});

				};

			},

			add_observers: () => {

				chrome.contextMenus.onClicked.addListener( ( info, tab ) => {

					_exec( "controller", "handle_ctx_click", info, tab );

				});

			},

			init: ( app ) => {

				_app = app;
				_exec = _app.exec.exec;

				_exec( "controller", "add_observers" );
				_exec( "controller", "init_cxt" );

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
