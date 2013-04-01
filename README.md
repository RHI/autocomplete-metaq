MetaQ Integrated Autocomplete Widget
===========================

JavaScript Library Requirements
---

* [jQuery](//jquery.com)
* [Handlebars](//handlebarsjs.com)

Design Motivation
---

This widget accounts for a response where multiple categories of data are returned. These categories are defined during instantiation of the *autocomplete* object.

For example, let's assume the implementation site is a movie database.  If our input is "Bi," the response from the Autocomplete MetaQ service will return *Big Daddy,* which is a movie, and *Bill Murray,* who is an actor.  This widget allows the differentiation and rendering of these categories separately.

Implementation
---

This widget creates a function on the window object named *autocomplete*.  The constructor takes an options hash as a parameter. 

````
var ac = new autocomplete({
	search: "#search",
	results: "#list .ac-results-container .ac-results-list",
	api: "//publishing.ramp.com/autocomplete/crackle",
	searchLocation: "//sitename.com/search?searchTerm=",
	searchTemplate: "tpl/search.handlebars",
	jsonp: true,
	//api: "test.json",
	
	categories: [
		{
			category: "Movies",
			dataType: "movie",
			template: "tpl/movie.handlebars"
		},
		{
			category: "Shows",
			dataType: "show",
			template: "tpl/movie.handlebars"
		},
		{
			category: "Actors",
			delimiter: "~",
			// must be set if using delimiter
			dataType: "actor",
			dataKey: "Movie",
			dataLimit: 4,
			template: "tpl/actor.handlebars"							
		}
	]
});
````

####Options

| Parameter  | Value   |
| ---------- | ------- |
| search     | css-style selector for elements that intend to be used as input |
| results    | css-style selector for elements that intend to be used as result container |
| api        | RAMP's MetaQ Autocomplete API URL |
| searchLocation | URL for the site that does a search on term, with term appended to the end of the URL |
| searchTemplate | location of Handlebars template to be used for the "search for term" portion of the results container |
| jsonp      | Use JSONP for the request to the API |
| categories | Array of category objects that capture responses from the API. See below for explanation of parameters |

#####Categories Array

| Parameter | Value |
| --------- | ----- |
| category  | Name of category, will be available to templates as *this.category* |
| dataKey   | Some implementations will use a delimited string to store category-specific data.  This is the name of that property in the JSON response
| delimiter | If a delimiter is defined, then the dataKey above will attempt to be accessed and split using this delimiter
| dataLimit | Sets a limit on how many results are returned to the template |
| template  | location of the Handlebars template to be used for this category |

####Template Use

##### Non-Delimeted Category

Any property of the response from the Autocomplete service that was generated through MetaQ will be available here, by name.  Also, the category name, as defined during instantation, is available.

````
<div class="ac-results-container">
	<ul class="ac-results-list">
		<div class="ac-category">
			<div class="ac-category-header ac-clearfix">
				{{this.category}}
			</div>
			<div class="ac-category-content">
				{{#each this.data}}
					<div class="ac-image-card-large">
						<a class="ac-image-caption-text-large" href="{{this.sp.path}}">
							{{#if this.displayName}}
								{{highlightMatch ../this.displayName ../../this.searchTerm}}
							{{else}}
								{{highlightMatch ../this.term ../../this.searchTerm}}
							{{/if}}
						</a>

						<div class="ac-image-items-large">
							<ul class="ac-image-items-list">
								{{#each this.data}}
									{{#with this}}
										<a class="ac-no-underline" href="{{[1]}}">
											<li class="ac-image-item-large {{mediaIcon [3]}}">
												{{[0]}}
											</li>
										</a>
									{{/with}}
								{{/each}}
							</ul>
						</div>
					</div>
					<div class="ac-clearfix"></div>
				{{/each}}
			</div>
		</div>
	</ul>
</div>
<div class="ac-clearfix"></div>
````

#####Delimited Category

To access the delimited data from the Autocomplete MetaQ response simply reference it by its position in the array that results from a *split* operation.  Again, the category name will be available.

````
<div class="ac-results-container">
	<ul class="ac-results-list">
		<div class="ac-category">
			<div class="ac-category-header ac-clearfix">
				{{this.category}}
			</div>
			
			<div class="ac-category-content">
				{{#each this.data}}
					{{#with this.data}}
						<a href="{{Link}}" title="{{Title}}">
							<div class="ac-image-card">
								<div class="ac-image-crop">
									<img class="ac-image" src="{{Thumbnail}}">
								</div>
								<div class="ac-image-caption-container">
									<div class="ac-image-caption-text">
										{{#if DisplayName}}
											{{highlightMatch DisplayName ../../../this.searchTerm}}
										{{else}}
											{{highlightMatch Title ../../../this.searchTerm}}
										{{/if}}
									</div>
								</div>
							</div>
						</a>
					{{/with}}
				{{/each}}
			</div>
		</div>
	</ul>
</div>
<div class="ac-clearfix"></div>
````

#####The Search Template

````
<div class="ac-search-for-term">
	Click <a href="{{searchLocation}}">here</a> for all <b>{{searchTerm}}</b> results.
</div>
````

Handlebars Helpers
---

Note that there are 2 Handlebars helper functions that we created to help us render content using thes templates.
These helpers are *highlightMatch* and *mediaIcon* and they were not included in the library itself to maintain a strict
divorce of content and presentation.

The *highlightMatch* helper:

````
Handlebars.registerHelper( "highlightMatch", function( label, searchTerm ) {
	if ( label instanceof Array ) {
		label = label[0];
	}
	// should use regex to ignore case
	return new Handlebars.SafeString( label.toLowerCase().replace( searchTerm.toLowerCase(), "<b>" +searchTerm +"</b>" ) );
});
````

The *mediaIcon* helper:

````
// looks at type, sent in from template, and returns the css
// class for the appropriate image icon
Handlebars.registerHelper( "mediaIcon", function( type ) {
	switch ( type ) {
		case "Clips":
		case "Trailer":
			return "ac-image-item-clip";
			break;
		case "movie":
			return "ac-image-item-movie";
			break;
		case "show":
			return "ac-image-item-show";
			break;
	}
});
````

Example
---

[MetaQ Autocomplete Example Implementation](http://rhi.github.com/autocomplete-metaq/example/example.html)