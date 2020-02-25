# ReadMe - Icicle
To view this graph, open "Anaconda3 5.2.0 - Python 3.6.5" using the apphub. Then using the command prompt run a webserver in the folder using the command. "python -m http.server"
Full documentation can be found by opening "index.html" in the "out" folder.
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


