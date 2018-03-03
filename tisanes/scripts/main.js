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
  capitalizeFirst: function(string) {
    return string.substr(0,1).toUpperCase()+string.substr(1);}
}

Vue.component('indic-view', {
  props: ['drugs', 'indics'],
  template:
    `<div>
      <h2>Vue par indications</h2>
      <ul>
        <li v-for="(indic, indicId) in indics">
          <b>{{indic.libelle}}</b> <br />
          <i>Plantes :</i>
            <template v-for="drugId in assoIndicDrug[indicId]">
              {{drugs[drugId].name_fr}}, 
            </template>
          <template v-if="indic.association.length > 0 ">
            <br />
            <i>associations possibles :</i>
            <ul>
              <li v-for="assoId in indic.association">
                {{indics[assoId].libelle}}
              </li>
            </ul>
          </template>
        </li> 
      </ul>
    </div>`,
  data: function () {
    let assoIndicDrug = {}
    Object.keys(this.indics).map(function(indicId) {
      assoIndicDrug[indicId] = [] })
    Object.values(this.drugs).map(function(drug) {
      drug.ind_mel_tis_ansm.map(function(drugIndic) {
        assoIndicDrug[drugIndic.id].push(drug.id); })
    })
    return { assoIndicDrug: assoIndicDrug }
  }
})


Vue.component('drug-view', {
  props: ['drugs-list-by-name', 'indics'],
  template:
    `<div>
      <h2>Vue par plante</h2>
        <table id="plant-list" class="table table-sm table-striped">
        <thead>
          <tr>
            <th> Nom commun </th>
            <th> Nom scientifique </th>
            <th style="width: 50%"> Indications thérapeutiques </th>
            <th> Autres indications </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="drug in drugsListByName"
            v-bind:drug="drug"
            v-bind:key="drug.id">
            <td><drug--name-common
                :drug="drug"/></td>
            <td><drug--name-sc
              :drug="drug" /></td>
            <td>  
              <drug--indic-thq
              v-for="indic in drug.ind_mel_tis_ansm"
              v-bind:indic="indic"
              v-bind:indics="indics"
                    :drug="drug"
              v-bind:key="indic.id"/></td>
            <td>  
              <drug--indic-autre
                :drug="drug"/></td>
          </tr>
        </tbody>
      </table>
    </div>`
})

Vue.component('drug--name-common', {
  props: ['drug'],
  template: `<span v-html="nameEval" />`,
  computed: {
    nameEval () {
      name = '<b>' + App.capitalizeFirst(this.drug.name_fr) + '</b>';
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
      activeNav: 'drug-view',
      drugsListByName: [],
      drugs: {},
      indics: {},
    },
    computed: {
      plantList () {
        return this.drugs.values().map(function (d) {
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
          let drugsListByName = Object.values(res).sort(function (a, b) {
                      return a.name_fr > b.name_fr;});
          self.drugs = res;
          self.drugsListByName = drugsListByName
          //App.loadTable();
      });
      loadJSON('data/indics.json', function(response) {
          res = JSON.parse(response);
          
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

