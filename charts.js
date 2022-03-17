/*run local server to load external file: use git bash to 
nav to this folder and run 'python -m http.server'
then localhost:8000 in browser */

function init() {
  // Grab a reference to the dropdown select element
  let selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    let sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    let firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}


// Create the buildCharts function.
function buildCharts(sample) {
  
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);
    
    // Create a variable that holds the selected sample in the samples array. 
    let allSamples = data.samples;
    let filteredSample = allSamples.filter(sampleObj =>sampleObj.id ==sample);
    let selectedSample = filteredSample[0];
    console.log(selectedSample);
    
    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otuIDarray = selectedSample.otu_ids;
    console.log(otuIDarray)
    let otuLabelArray = selectedSample.otu_labels;
    console.log(otuLabelArray)
    let sampleValuesArray = selectedSample.sample_values;
    console.log(sampleValuesArray)

    ////////////////////////////////////////////////////////////////////////////////////
    //                  DELIVERABLE 1: BAR CHART
    ///////////////////////////////////////////////////////////////////////////////////
    
    // Create the yticks for the bar chart.
    let yticks = otuIDarray.slice(0,10).map(id=>`OTU ${id}`).reverse();
    
    // Create the trace for the bar chart. 
    let barData = [{
      x: sampleValuesArray.slice(0,10).reverse(),
      text: otuLabelArray.slice(0,10).reverse(),
      y: yticks,
      type: "bar",
      orientation: "h",
      marker: {
        color: sampleValuesArray,
        colorscale: "Bluered",
        }
    }];
    
    // Create the layout for the bar chart. 
    let barLayout = {title: "Top 10 Bacterial Cultures Found"};
    
    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    //////////////////////////////////////////////////////////////////////////////////
    //                    DELIVERABLE 2: BUBBLE CHART
    //////////////////////////////////////////////////////////////////////////////////
    
    // Create the trace for the bubble chart.   
    let bubbleData = [{
      x: otuIDarray,
      y: sampleValuesArray,
      text: otuIDarray.map(id=>`OTU ${id}`),
      mode: 'markers',
      marker: { 
        size: sampleValuesArray,
        color: otuIDarray,
        colorscale: "Bluered" }
    }];
    
    // Create the layout for the bubble chart.
    let bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      hovermode: "closest"
    };
    
    // Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    /////////////////////////////////////////////////////////////////////////////
    //                        DELIVERABLE 3: GAUGE CHART
    /////////////////////////////////////////////////////////////////////////////
    
    // Create a variable that filters the metadata array and holds the selected sample
    let filteredMeta = data.metadata.filter(sampleObj => sampleObj.id == sample);
    console.log(filteredMeta);
    let selectedMeta = filteredMeta[0]; 
    console.log(selectedMeta);
    
    // Create a variable that holds the washing frequency.
    washFreq = selectedMeta.wfreq;
    console.log(washFreq);

    // Create the trace for the gauge chart.
    var gaugeData = [{
      value: washFreq,
      title: {text: "Belly Button Washing Frequency<br>Scrubs per week"},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {range: [null, 10]},
        bar: {color: "midnightblue"},
        steps: [
          {range: [0,2], color: "royalblue"},
          {range: [2,4], color: "darkorchid"},
          {range: [4,6], color: "mediumvioletred"},
          {range: [6,8], color: "rgba(221,77,111,0.9)"},
          {range: [8,10], color: "rgb(255,86,86,0.8)"},          
        ]
      }
    }];
    
    // Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 400,
      height: 300,
      margin: {t:100, r:25, l:15, b:0}   
    };

    // Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
