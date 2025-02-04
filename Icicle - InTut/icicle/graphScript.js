/** Diagram Class used to create graphs */
export default class Diagram{
  /**  Constructor that sets default values for the graph's attributes
  * @constructor
  * @param {} runtime - Needed by the observable module, imported from "runtime.js"
  * @param {} observer - Needed by the observable module, defines where graph will be created
  * @param {string} data - Data for the graph to represent
  */
  constructor(runtime,observer,data) {
    this.FillOpac = 0.8;
    this.Runtime = runtime;
    this.Observer = observer;
    this.Data = data;
    this.Height = 2400;
    this.Width = 975;
    this.blueList = ["DarkBlue","MediumBlue","SteelBlue","RoyalBlue","CornflowerBlue","LightSkyBlue"];
    this.redList = ["DarkRed","Red","FireBrick","IndianRed","Salmon","LightCoral"];
    this.purpleList = ["Indigo","Purple","DarkViolet","BlueViolet","MediumOrchid","MediumPurple"];
    this.listSelector = "Blue";
    this.fontSize = "10px";
    this.fontColour = "White";
    this.xTextOff = 4;
    this.yTextOff = 13;
  }
  /** Sets the opacity of the graph's text and cells
  * @param {float} opacity - The new opacity value
  */
  setFillOpac(opacity){
    this.FillOpac = opacity
  }
  /** Returns the opacity of the graph's text and cells */
  getFillOpac(){
    return this.FillOpac
  }
  /** Sets the data for the graph to represent
  * @param {string} filepath - The file path of the new data set
  */
  setData(filepath){
    this.Data = filepath;
  }
  /** Returns the filepath of the data */
  getData(){
    return this.Data
  }
  /** Sets the height of the graph
  * @param {float} toSet - The new height
  */
  setHeight(toSet){
    this.Height = toSet
  }
    /** Returns the height of the graph */
  getHeight(){
    return this.Height
  }
  /** Sets the width of the graph
  * @param {float} toSet - The new width
  */
  setWidth(toSet){
    this.Width = toSet;
  }
    /** Returns the width of the graph */
  getWidth(){
    return this.Width;
  }
  /** Sets the value of the variable used to select a colour list
  * @param {string} value - The new value of the variable
  */
  setListSelector(value){
    this.listSelector = value;
  }
    /** Returns value of listSelector, used to pick a colour list */
  getListSelector(){
    return this.listSelector
  }
  getXTextOff(){
    return this.xTextOff;
  }
  getYTextOff(){
    return this.yTextOff;
  }

  /** Depending on the value of listSelector, returns the corresponding colour list */
  getCurrentList(){
    switch (this.getListSelector()) {
      case "Blue":
          return this.blueList;
        break;
      case "Red":
          return this.redList;
        break;
      case "Purple":
          return this.purpleList;
        break;

    }
  }
  /** Sets the font colour of the graph
  * @param {string} value - The new font colour
  */
  setfontColour(value){
    this.fontColour = value;
  }
  /** Returns the value of the graph's font colour */
  getfontColour(){
    return this.fontColour;
  }
  /** Sets the font size of the graph
  * @param {int} value - The new font size
  */
  setFontSize(value){
      this.fontSize = value;
  }
  /** Returns the value of the graph's font size */
  getFontSize(){
    return this.fontSize;
  }

  /** Main function used to generate the graph.
  * @param {} runtime - Needed by the observable module, imported from "runtime.js"
  * @param {} observer - Needed by the observable module, defines where graph will be created
  * @param {string} data - Data for the graph to represent
  * @param {float} opacity - Opacity of the graph
  * @param {float} height - Height of the graph
  * @param {float} width - Width of the graph
  * @param {array} colourList - List of colours to be used in the graph
  * @param {string} fontColour - Font colour of the graph
  * @param {int} fontSize - Font size of the graph
  * @param {int} xOff -X offset of the text in each cell
  * @param {int} yOff - Y offset of the text in each cell
  */
  define(runtime, observer,data,opacity,height,width,colourList,fontColour,fontSize,xOff,yOff)
  {
    var font = fontSize + "px "+ "sans-serif" //Adds the font size to the font family so it can be used.
    const main = runtime.module();
    main.variable(observer("chart")).define("chart", ["partition","data","d3","width","height","color","format"], function(partition,data,d3,width,height,color,format)
    {
      const root = partition(data);
      const svg = d3.create("svg")
          .attr("viewBox", [0, 0, width, height])
           //Sets the font of the text using the font parameter
          .style("font", font);

      const cell = svg
        .selectAll("g")
        .data(root.descendants())
        .join("g")
          .attr("transform", d => `translate(${d.y0},${d.x0})`);

      cell.append("rect")
          .attr("width", d => d.y1 - d.y0)
          .attr("height", d => d.x1 - d.x0)
          //Opacity of each cell, set by the opacity parameter
          .attr("fill-opacity", opacity)
          /*Function to colour the graph, iterates through the colour list by the depth of the current data,
          uses modulus operator to loop through the list if depth is larger than length of list
          */
          .attr("fill", d => {
            color = colourList[(d.depth%colourList.length)];
            return color
            }
          );

      const text = cell.filter(d => (d.x1 - d.x0) > 16).append("text")
          .attr("x", xOff) //X coordinate of the text within each cell
          .attr("fill",fontColour) //Sets the font colour of the graph's text
          .attr("y", yOff); //Y coordinate of the text within each cell

      text.append("tspan")
          .attr("fill-opacity", opacity)
          .text(d => d.data.name); //Name of the block

      text.append("tspan")
          .attr("fill-opacity", opacity) //Text fill opacity
          .text(d => ` ${format(d.value)}`); //Value of the block

      cell.append("title")
          .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);

      return svg.node();
    }
    );
      main.variable(observer("data")).define("data", ["d3"], function(d3){return(d3.json(data))});  //Data to be represented inputted here as "data"
      main.variable(observer("partition")).define("partition", ["d3","height","width"], function(d3,height,width){return(
        data => d3.partition()
        .size([height, width])
        .padding(1)
      (d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.height - a.height || b.value - a.value))
    )});
      main.variable(observer("color")).define("color", ["d3","data"], function(d3,data){return(d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1)))});
      main.variable(observer("format")).define("format", ["d3"], function(d3){return(d3.format(",d"))});
      main.variable(observer("width")).define("width", function(){return(width)}); //Defines the width of the graph
      main.variable(observer("height")).define("height", function(){return(height)}); //Defines the height of the graph
      main.variable(observer("d3")).define("d3", ["require"], function(require){return(require("d3@5"))});
      return main;
  }
  /** Calls the define function and passes in the relevant parameters
  * @param {} this.runtime - Needed by the observable module, imported from "runtime.js"
  * @param {} this.observer - Needed by the observable module, defines where graph will be created
  * @param {string} this.getData() - Data for the graph to represent
  * @param {float}  this.getOpacity() - Opacity of the graph
  * @param {float}  this.getHeight() - Height of the graph
  * @param {float}  this.getWidth() - Width of the graph
  * @param {array}  this.getCurrentList() - List of colours to be used in the graph
  * @param {string}  this.getFontColour() - Font colour of the graph
  * @param {int}  this.getFontSize() - Font size of the graph
  * @param {int}  this.getXTextOff() - X offset of the text in each cell
  * @param {int}  this.getYTextOff() - Y offset of the text in each cell
  */
  createGraph(){
    this.define(this.Runtime,this.Observer,this.getData(),this.getFillOpac(),this.getHeight(),this.getWidth(),this.getCurrentList(),this.getfontColour(),this.getFontSize(),this.getXTextOff(),this.getYTextOff())

  }

}
