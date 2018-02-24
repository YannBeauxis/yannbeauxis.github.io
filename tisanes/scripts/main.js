App = {
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
}

Vue.component('drug--name-common', {
  props: ['drug'],
  template: `<span v-html="nameEval" />`,
  computed: {
    nameEval () {
      name = this.drug.name_fr;
      parts = App.parts(this.drug);
      if (parts.length == 1){
        name += '<br /><i>' + parts[0] + '</i>';
      }
      return name;
    },
  },
})

Vue.component('drug--name-sc', {
  props: ['drug'],
  template: `
      <i>
            {{nameScEval}}
      </i>`,
  computed: {
    nameScEval () {
      if (this.drug.gbif){
        return this.drug.gbif.name_sc;
      } else {
        return this.drug.name_sc_ansm
      }
    },
  },
})

Vue.component('drug--indic-thq', {
  props: ['indic', 'indics', 'drug'],
  template: `
      <span>
            {{libelle}}<span v-html="indicParts" />
      <br /></span>`,
  computed: {
    thisIndic () {
      return this.indics[this.indic.id]
    },
    libelle () {
      if (this.thisIndic){
        return this.thisIndic.libelle;}
    },
    indicParts () {
      if (this.indic){
        if (App.parts(this.drug).length > 1){
          return '- <i>'+ this.indic.parts.join(", ") + '</i>';}}
    },
  },
})

Vue.component('drug--indic-autre', {
  props: ['drug'],
  template: `<span v-html="indicEval" />`,
  computed: {
    indicEval () {
      let res = [];
      ['saveur', 'aspect'].forEach(function(i) {
        if (this.drug[i]) { 
          let toPush = i;
          if (App.parts(this.drug).length > 1){
            toPush += ' - <i>' + this.drug[i] + '</i>'}
          res.push(toPush); }
      }, this)
      return res.join(', ');
    },
  },
})

$(document).ready(function(){
  App.vue = new Vue({
    el: '#app',
  /*  template: `
  `,*/
    data: {
      title: 'Tisanes',
      drugs: [],
      indics: {},
    },
    computed: {
      plantList () {
        return this.drugs.map(function (d) {
          if (d.ind_mel_tis_ansm.length > 0) {
            indics = d.ind_mel_tis_ansm
              .map( function (i) { 
                //if (this.indics[i.id]) {
                return this.indics[i.id].libelle + ' ( ' + i.parts.join(', ') + ' )'
                //} else {
                //  return ''}
                }, this)
              .join('<br />')
          } else { 
            indics = "pas d'indications" }
          return [
            d.name_fr,
            indics
          ]}
        , this);
      },
    },
    created (self = this) {
      loadJSON('data/drugs.json', function(response) {
          res = JSON.parse(response);
          res.sort(function (a, b) {
                      return a.name_fr > b.name_fr;});
          self.drugs = res;
          //App.loadTable();
      });
      loadJSON('data/indics.json', function(response) {
          res = JSON.parse(response);
          /*res.sort(function (a, b) {
                      return a.name_fr > b.name_fr;});*/
          self.indics = res;
          //App.loadTable();
      });
      //$('#plant-list').DataTable();
    },
  })
});

function loadJSON(filePath, callback) {   
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
}

