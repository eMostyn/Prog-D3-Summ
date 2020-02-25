# ReadMe - Icicle
To view this graph, open a webserver in the same folder.
python -m http.server

# Sources
Original graph from - https://observablehq.com/@d3/icicle

Data sets provided with the graph.
Titanic Passengers - https://www.kaggle.com/c/titanic/data
Default Observable Data - https://raw.githubusercontent.com/d3/d3-hierarchy/v1.1.8/test/data/flare.json

# Json Formating
Data must be in a .json format in a "parent/child" format such as the example below.
<pre>
{
	"name" "Level 1",
	"children":
	[
		{
			"name": "Level 2",
			"value": 10
		}
	]
}
</pre>


