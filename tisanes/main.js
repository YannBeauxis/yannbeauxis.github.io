App = {
  importJS: function(path) {
    var imported = document.createElement('script');
    imported.src = path;
    document.head.appendChild(imported);
  },

  loadJSON: function (filePath, callback) {   
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', filePath, true);
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
  },

  parts: function(drug) {
    indics = drug.ind_mel_tis_ansm;
    let res = {};
    indics.map( function(indic, indice) {
       res[indic.parts.join(', ')] = 0;
    });
    ['saveur', 'aspect'].forEach(function(i) {
        if (drug[i]) { 
          res[drug[i].join(', ')] = 0;}
    })
    return Object.keys(res);
  },

  capitalizeFirst: function(string) {
    return string.substr(0,1).toUpperCase()+string.substr(1);},

  vueComponents: {},

}

//$(document).ready(function(){
document.addEventListener("DOMContentLoaded", function(event) { 
  //App.importJS('./components/navBar.js');
  App.importJS('./components/processStep.js');
  App.importJS('./components/stepNav.js');
  App.importJS('./components/drugsView.js');
  App.importJS('./components/indicsView.js');
  App.importJS('./vueApp.js');

});
