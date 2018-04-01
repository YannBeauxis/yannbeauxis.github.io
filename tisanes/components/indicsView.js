Vue.component('indics-view', {
  props: ['drugs', 'indics'],
  template:
    `<div>
      <h2>Vue par indication</h2>
      <ul class="list-group">
        <indic-row v-for="indic in indics"
          :indic="indic" 
          :indics="indics"
          :assoIndicDrug="assoIndicDrug"
          :drugs="drugs"
          :key="indic.id">
        </indic-row> 
      </ul>
    </div>`,
  computed: {
    assoIndicDrug() {
      let assoIndicDrug = {}
      Object.keys(this.indics).map(function(indicId) {
        assoIndicDrug[indicId] = [] })
      Object.values(this.drugs).map(function(drug) {
        drug.indications.therapeutic.map(function(indicId) {
          assoIndicDrug[indicId].push(drug.id); })
      })
      return assoIndicDrug;
    },
  },
})

Vue.component('indic-row', {
  props: ['indic', 'indics', 'drugs', 'assoIndicDrug'],
  template:
        `<li class="list-group-item item-row" :class="classObject" >
          <div class="container-fluid">
            <div class="row">
              <b>{{indic.libelle}}</b>
            </div>
                <!--<i>Plantes :</i><br />-->
                <div>
                  <indic-drug-item v-for="drugId in assoDrugs"
                    :drugId="drugId"
                    :drugs="drugs"
                    :indic="indic" 
                    :key="drugId"/>
              <div>
                <template v-if="indic.association.length > 0 ">
                    <div><i>associations possibles :</i><div>
                    <div 
                      class="badge badge-info indic-autre p-1 m-1" 
                      v-for="assoId in indic.association"
                      :key="assoId">
                      {{indics[assoId].libelle}}
                    </div>
                </template>
              <div>
            </div>
          </div>
        </li>`,
  computed: {
    classObject:  function () {
      return {
        selected: this.indic.selected, // App.vue.selectedDrugs.length > 0 && 
        disabled: this.indic.disabled,
      }
    },
    assoDrugs:  function () {
      return this.assoIndicDrug[this.indic.id];
    },
  }

})

Vue.component('indic-drug-item', {

  props: ['drugId', 'drugs', 'indic'],

  template:
    `<div :class="classObject" @click="toggleSelect">
      {{drugDisplay}}
    </div>`,

  computed: {
    classObject() {
      let badgeType = 'success';
      if (this.drug.selected) {
        badgeType = 'warning';
      } 
      return "badge badge-" + badgeType + " p-1 m-1 indic-drug-badge";
    },
    drugDisplay() {
      return App.capitalizeFirst(this.drug.name_fr);
    },
    drug() {
      return this.drugs[this.drugId];
    },
  },
  methods: {
    toggleSelect() {
      App.vue.toggleSelect(!this.drug.selected, this.drug);
    },
  },

})
