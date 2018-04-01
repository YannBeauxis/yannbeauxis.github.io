App.vue = new Vue({
  el: '#app',

  //components: {drugsView: App.vueComponents.DrugsView},

  template: `
    <div id="app">
      <nav class="navbar fixed-top navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="#">Tisanes</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="nav navbar-nav">
              <li class="nav-item" :class="{ active: activeNav === 'drugs-view'}">
                <a class="nav-link" href="#" @click="activeNav = 'drugs-view'">Vue par plante</a>
              </li>
              <li class="nav-item" :class="{ active: activeNav === 'indics-view'}">
                <a class="nav-link" href="#" @click="activeNav = 'indics-view'">Vue par indication</a>
              </li>
            </ul>
          </div>
      </nav>
      <div id="body">
        <drugs-view
          v-show="activeNav === 'drugs-view'" 
          :drugs-list-by-name="drugsListByName"
          :indics="indics">
        </drugs-view>
        <indics-view
          v-show="activeNav === 'indics-view'" 
          :drugs="drugs"
          :indics="indics">
        </indics-view>
      </div>
    </div>
  `,

  data: {
    activeNav: 'drugs-view',
    drugsListByName: [],
    drugs: {},
    indics: {},
    selectedDrugs: [],
    drugAssoSelectNum: 0,
    indicsAllowed: ['all'],
    numIndicMax: {
      'therapeutic': 5,
      'saveur': 3,
      'aspect': 2,},
  },

  created: function() {
      let self = this
    App.loadJSON('data/drugs.json', function(response) {
      let drugs = JSON.parse(response);
      let drugsListByName = Object.values(drugs).sort(function (a, b) {
                  return a.name_fr > b.name_fr;}); 
      Object.keys(drugs).map( function (key, index) {
        drugs[key].selected = false;
        drugs[key].disabled = false;
      })
      App.loadJSON('data/indics.json', function(response) {
        indics = JSON.parse(response);
        Object.keys(indics).map( function (key, index) {
          indics[key].drugSelectNum = 0;
          indics[key].drugNotSelectNum = 0;
          indics[key].selected = false;
          indics[key].disabled = false;
        })
        self.drugs = drugs;
        self.drugsListByName = drugsListByName;
        self.indics = indics;
      });
    });

  },

  methods: {
    toggleSelect: function(addDrug, drug) {

      indicsAssoIds = [];
      drug.indications.therapeutic.map (
        function( indicId ) { 
          App.vue.indics[indicId].association.map(
            function(indicAssoId) {
              indicsAssoIds.push(indicAssoId);})
        });

      let drugId = drug.id
      drug.selected = addDrug;
      let direction = 1;

      let selectedDrugs = App.vue.selectedDrugs;
      if (addDrug) {
        selectedDrugs.push(drugId);
        direction = 1;
      } else {
        let index = selectedDrugs.indexOf(drugId);
        if (index > -1) {
            selectedDrugs.splice(index, 1);
        }
        direction = -1;
      }

      let allIndics = App.vue.indics;
      let indicsIds = drug.indications.therapeutic;
      Object.keys(allIndics).map ( function (indicIds, index) {
        let indic = allIndics[indicIds];
        let indicId = Number(indicIds);
        if (indicsIds.indexOf(indicIds) > -1 ){
            indic.drugSelectNum += direction;
        } else if ( indicsAssoIds.indexOf(indicId) === -1 ) {
            indic.drugNotSelectNum += direction;
        }
        indic.selected = indic.drugSelectNum > 0 && indic.drugNotSelectNum == 0;
        indic.disabled = indic.drugNotSelectNum > 0;
      });



      this.updateDrugsDisabled();
      //this.updateIndics(drug);
    },
    updateIndics: function(drug) {

    },
    updateDrugsDisabled: function() {
      Object.keys(this.drugs).map( function (drugId) {
        let drug = App.vue.drugs[drugId];
        if(App.vue.selectedDrugs.length === 0 || drug.selected) {
          res =  false;
        } else {
          let indics = App.vue.indics;
          let hasIndic = drug.indications.therapeutic.reduce (
            function (res, indId) {
              return res 
                      || indics[indId].active 
                      || !indics[indId].disabled;
            },
            false
          )
          res = 
              !hasIndic 
            || 
              App.vue.selectedDrugs.length >= App.vue.numIndicMax.therapeutic;
        }
        drug.disabled = res;
      });
    },
  },

});

