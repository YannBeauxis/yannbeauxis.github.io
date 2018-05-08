App.vue = new Vue({
  el: '#app',

  //components: {drugsView: App.vueComponents.DrugsView},

  template: `
    <div id="app">
      <div id="menu">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
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
        <process-step
          :activeStep='activeStep'
          :steps='steps'
        />
      </div>
      <div id="content">
        <div class="row">
          <div class="col-lg-6">
            <div class="test-flex">
              <step-nav
                :activeNav='activeNav'
                :activeStep='activeStep'
                :steps='steps'
                class="step-nav"
              />
              <div class="select-drug">
                <drugs-view
                  v-show="activeNav === 'drugs' || activeStep === 1" 
                  :selectedDrugs="selectedDrugs"
                  :numIndicMax="numIndicMax"
                  :drugs-list-by-name="drugsListByName"
                  :indics="indics"
                  :indicType="indicType">
                </drugs-view>
                <indics-view
                  v-show="activeNav === 'indics'" 
                  :drugs="drugs"
                  :indics="indics">
                </indics-view>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="">
              <h4 class="selection-view text-center w-100">Sélection</h4>
            </div>
            <div class="list-group pre-scrollable select-drug">
              <selected-drug v-for="indicType in indicType"
                :selectedDrugs="selectedDrugs"
                :numIndicMax="numIndicMax"
                :indicType="indicType"
                :key="indicType" />
            </div>
          </div>
        </div>
      </div>
              <div id="footer">
                <p><b>footer</b> (fixed height)</p>
              </div>
    </div>
  `,

  data: function () {
    d = {
    steps: [
       {
        libelle: 'Principes actifs',
        navs: [
          {id:'drugs', libelle: 'Drogue végétale'},
          {id:'indics', libelle:'Indications'},
        ],
      },
      {
        libelle: 'Saveur et aspect',
        navs: [
          {id:'taste', libelle: 'Saveur'},
          {id:'look', libelle:'Aspect'},
        ],
      },
    ],
    activeStep: 0,
    activeNav: 'drugs',
    drugsListByName: [],
    drugs: {},
    indics: {},
    drugAssoSelectNum: 0,
    numIndicMax: {
      'thérapeutique': 5,
      'saveur': 3,
      'aspect': 2,},
    }
    d.indicType = Object.keys(d.numIndicMax);
    d.selectedDrugs = d.indicType.reduce(
      function (dic, indicType) {
        dic[indicType] = [];
        return dic
      }, {});
    return d;
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
        drugs[key].hasTherapeutic = true;
        drugs[key].hasOther = {
            aspect: false,
            saveur: false}
        drugs[key].indicType = '';
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
        self.updateDrugs();
      });
    });

  },

  computed: {
    selectedTotalCount() {
      let self = this;
      return Object.keys(self.selectedDrugs).reduce(
        function(count, type) {
          return count += self.selectedDrugs[type].length;}
        , 0); 
    },
  },

  methods: {
    toggleSelect: function(addDrug, drug, indicType) {
      let self = this
      indicsAssoIds = [];
      drug.indications.therapeutic.map (
        function( indicId ) { 
          App.vue.indics[indicId].association.map(
            function(indicAssoId) {
              indicsAssoIds.push(indicAssoId);})
        });

      let drugId = drug.id
      drug.selected = addDrug;
      let direction = addDrug * 2 - 1;

      // modify list of selected drugs
      let selectedDrugs = App.vue.selectedDrugs[indicType];
      if (addDrug) {
        selectedDrugs.push(drugId);
      } else {
        let index = selectedDrugs.indexOf(drugId);
        if (index > -1) {
            selectedDrugs.splice(index, 1);
        }
      }
      
      // update indication thérapeutique
      if (indicType == 'thérapeutique') {
        let allIndics = App.vue.indics;
        let indThIds = drug.indications.therapeutic;
        Object.keys(allIndics).map ( function (indicIds, index) {
          let indic = allIndics[indicIds];
          let indicId = Number(indicIds);
          if (indThIds.indexOf(indicIds) > -1 ){
              indic.drugSelectNum += direction;
          } else if ( indicsAssoIds.indexOf(indicId) === -1 ) {
              indic.drugNotSelectNum += direction;
          }
          indic.selected = indic.drugSelectNum > 0 && indic.drugNotSelectNum == 0;
          indic.disabled = indic.drugNotSelectNum > 0;
        });
      }

      this.updateDrugs();
    },

    updateDrugs: function() {
      let self = this;
      Object.keys(this.drugs).map( function (drugId) {
        let drug = App.vue.drugs[drugId];
        if(self.selectedTotalCount === 0 || drug.selected) {
          drug.hasTherapeutic =  true;
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
          drug.hasTherapeutic = hasIndic && (self.selectedDrugs['thérapeutique'].length < self.numIndicMax['thérapeutique']);
        }
        let not_dis = ['aspect', 'saveur'].reduce( 
            function (bool, t) {
              drug.hasOther[t] =  ( (drug.indications.other.indexOf(t) > -1)
                && (self.selectedDrugs[t].length < self.numIndicMax[t]) 
                )
              return bool || drug.hasOther[t]
               
            },
            false );
        //not_dis = not_dis || self.selectedDrugs['thérapeutique'].length < self.numIndicMax['thérapeutique'];
        drug.disabled = !drug.hasTherapeutic && !not_dis
      });
    },
  },

});

