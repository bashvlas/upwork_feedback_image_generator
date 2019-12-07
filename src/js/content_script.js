
	( function () {

		function get_text ( element, selector ) {

			try {

				return element.querySelector( selector ).innerText.trim();

			} catch ( e ) {

				return "";

			};

		};

		var feedback_data_arr = [];
		var feedback_element_arr = Array.from( document.querySelectorAll( "#oProfileAssignments li[data-ng-repeat]" ) );

		for ( i = 0; i < feedback_element_arr.length; i++ ) {

			var rating_number = get_text( feedback_element_arr[ i ], "h4+ul strong" );
			var text = get_text( feedback_element_arr[ i ], "em" );

			if ( rating_number === "5.00" && text ) {

				feedback_data_arr.push({

					title: get_text( feedback_element_arr[ i ], "h4" ),
					text: text,
					rating_number: rating_number,

				});

			};

		};

		return feedback_data_arr;

	} () )