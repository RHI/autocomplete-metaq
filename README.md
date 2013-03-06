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
| jsonp      | Use JSONP for the request to the API |
| categories | Array of category objects that capture responses from the API |

#####Categories

| Parameter | Value |
| category  | Name of category, will be available to templates as *this.category* |
| dataKey   | Some implementations will use a delimited string to store category-specific data.  This is the name of that property in the JSON response
| delimiter | If a delimiter is defined, then the dataKey above will attempt to be accessed and split using this delimiter
| dataLimit | Sets a limit on how many results are returned to the template |
| template  | location of the Handlebars template to be used for this category |
