(function( jQuery ) {
	var autocomplete,
		$ = jQuery;

	autocomplete = window.autocomplete = function( options ) {
		this.init( options );
	};

	autocomplete.prototype = {
		init: function( options ) {
			var key, category,
				self = this;

			this.options = options;

			for ( key in options ) {
				if ( options.hasOwnProperty( key ) ) {
					this[ key ] = options[ key ];
				}
			}

			// get elements / set properties
			this.search = $( this.search );
			this.search.attr( "autocomplete", "off" );
			this.results = $( this.results );

			this.searchTimer = null;

			// fetch templates
			$.each(this.categories, function( index, category ) {
				$.ajax({
					url: category.template,
					dataType: "html"
				}).done(function( data ) {
					category.template = Handlebars.compile( data );
				});
			});

			this.bindListeners();
		},

		bindListeners: function() {
			var self = this;

			this.search.bind( "keydown", function( e ) {
				if ( this.searchTimer !== null ) {
					clearTimeout( this.searchTimer );
				}
				this.searchTimer = setTimeout( function() {
					self.getData();
				}, 300 );
			});

			this.search.bind( "blur", function() {
				self.results.hide();
			});

			this.results.bind( "blur", function() {
				self.results.hide();
			});
		},

		getData: function() {
			var deferred,
				self = this;

			deferred = $.ajax({
				type: "GET",
				url: this.options.api,
				dataType: this.options.jsonp ? "jsonp" : "json",
				jsonp: "callbackName",
				data: {
					q: this.search.val(),
					md: true
				},
				cache: false
			});

			deferred.done( function( data ) {
				self.process( data.ac.q );
			});
		},

		process: function( data ) {
			var category, currentData, categoryData, processedData = [ ],
				i, j, k,
				delimitedData,
				categories = this.categories,
				displayName;

			// consider doing this in a Web Worker if performance becomes an issue
			for ( i = 0; i < categories.length; i++ ) {
				category = categories[ i ];

				if ( !processedData[ i ] ) {
					processedData[ i ] = { };
					processedData[ i ].name = category.category;
					processedData[ i ].template = category.template;
					processedData[ i ].data = [ ];
				}

				for ( j = 0; j < data.length; j++ ) {
					currentData = data[ j ];

					if ( !currentData.m || !currentData.m.mq ) {
						continue;
					}



					if ( currentData.m.mq.DisplayName && currentData.m.mq.DisplayName[0] ) {
						displayName = currentData.m.mq.DisplayName;
					}
					else {
						displayName = null;
					}

					if ( category.dataType == currentData.m.mq.Type ) {
						categoryData = category.dataKey ? currentData.m.mq[ category.dataKey ] : categoryData = currentData.m.mq;

						if ( category.delimiter ) {
							delimitedData = [ ];
							for ( k = 0; k < categoryData.length; k++ ) {
								if ( category.dataLimit && category.dataLimit <= k ) {
									break;
								}
								delimitedData.push( categoryData[ k ].split( category.delimiter ) );
							}

							processedData[ i ].data.push({
								term: currentData.s,
								displayName: displayName,
								data: delimitedData,
								sp: currentData.m.sp
							});
						}
						else {
							processedData[ i ].data.push({
								term: currentData.s,
								displayName: displayName,
								data: categoryData,
								sp: currentData.m.sp
							});
						}
					}
				}
			}

			this.render( processedData );
		},

		render: function( processedData ) {
			var i = 0,
				length = processedData.length;

			// this needs to be optimized - don't do so many DOM inserts

			// clear
			this.results.html("");

			for ( ; i < length; i++ ) {
				if ( processedData[ i ].data.length > 0 ) {
					this.results.append( processedData[ i ].template( {
						category: processedData[ i ].name,
						data: processedData[ i ].data,
						searchTerm: this.search.val()
					} ) );
				}
			}

			this.results.show();
		}

	};

})( window.jQuery );