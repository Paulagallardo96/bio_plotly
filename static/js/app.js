function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample

  var meta_sample = d3.json(`/metadata/${sample}`);

  meta_sample.then(sample => {
    var panel_body = d3.select(`#sample-metadata`);
    panel_body.html('');

    Object.entries(sample).forEach(([key, value]) => {
      panel_body.append('h6').text(`${key}: ${value}`);
      console.log(key, value);
  // Use `.html("") to clear any existing metadata   
  
    });

  });
};

function buildCharts(sample) {

  var chart_sample = d3.json(`/samples/${sample}`);

  chart_sample.then(sample => {

    var otu_ids = sample.otu_ids;
    var otu_labels = sample.otu_labels;
    var otu_values = sample.sample_values;

    var trace = {
      type: 'scatter',
      x: otu_ids,
      y: otu_values,
      mode: 'markers',
      marker: {
          size: otu_values,
          color: otu_ids,
          colorscale: "Earth"
    },
    text: otu_labels
  };

  var bubble_layout = {
    xaxis: { title: 'OTU ID' }
  };

  bubble_data = [trace];
  Plotly.newPlot('bubble', bubble_data, bubble_layout);

  var piechart = [
    {
      values: otu_values.slice(0,10),
      labels: otu_ids.slice(0,10),
      hovertext: otu_labels.slice(0,10),
      hoverinfo: "hovertext",
      type: 'pie'
    }
  ];

  var pie_layout = {
    margin: { t: 0, l: 0 } 
  };

  Plotly.plot("pie", piechart, pie_layout);
  });

  // @TODO: Use `d3.json` to fetch the sample data for the plots
    // @TODO: Build a Bubble Chart using the sample data
//   var labels = sample[0]['otu_ids'].map(function(item) {
//     return otudata[item]
//   });

//   var bubbleLayout = {
//       margin: { t: 0 },
//       hovermode: 'closest',
//       xaxis: { title: 'OTU ID' }
//   };
//   var bubbleData = [{
//       x: sample[0]['otu_ids'],
//       y: sample[0]['sample_values'],
//       text: labels,
//       mode: 'markers',
//       marker: {
//           size: sample[0]['sample_values'],
//           color: sample[0]['otu_ids'],
//           colorscale: "Earth",
//       }
//   }];
//   var BUBBLE = document.getElementById('bubble');
//   Plotly.plot(BUBBLE, bubbleData, bubbleLayout);

//   // @TODO: Build a Pie Chart
//   var pieData = [{
//     values: sample[0]['sample_values'].slice(0, 10),
//     labels: sample[0]['otu_ids'].slice(0, 10),
//     hovertext: labels.slice(0, 10),
//     hoverinfo: 'hovertext',
//     type: 'pie'
//   }];

//   var pieLayout = {
//     margin: { t: 0, l: 0 }
//   };

//   var PIE = document.getElementById('pie');
//   Plotly.plot(PIE, pieData, pieLayout);



    
//     // HINT: You will need to use slice() to grab the top 10 sample_values,
//     // otu_ids, and labels (10 each).
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  
  //Sample metadata 
  // d3.json("/metadata/${sample}").then((sampleNames) => {
  //   sampleNames.forEach((sample) => {
  //   });
  // });

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
