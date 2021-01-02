
	function controller () {

		var _pub = {

			init_cxt: async () => {

				chrome.contextMenus.removeAll( () => {

					chrome.contextMenus.create({

						id: "main",
						type: "normal",
						title: "Generate Images",
						contexts: [ "page" ],
						documentUrlPatterns: [ "https://www.upwork.com/fl/*", "https://www.upwork.com/freelancers/*", "https://www.upwork.com/o/profiles/*" ]

					});

				});

			},

			handle_ctx_click: async ( info, tab ) => {

				chrome.tabs.executeScript( tab.id, { file: "/js/content_script.js" }, ( result ) => {

					if ( result && result[ 0 ] ) {

						chrome.storage.local.set({ feedback_data_arr: result[ 0 ] }, () => {

							chrome.tabs.create({

								active: true,
								url: chrome.extension.getURL( "/pages/image_generator/index.html" ),

							});

						});

					};

				});

			},

			add_observers: () => {

				chrome.contextMenus.onClicked.addListener( ( info, tab ) => {

					_pub.handle_ctx_click( info, tab );

				});

			},

			init: () => {

				_pub.add_observers();
				_pub.init_cxt();

			},

		};

		return _pub;

	};

	( function () {

		var controller = window.controller();
		controller.init();

	} () )
