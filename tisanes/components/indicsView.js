Vue.component('indics-view', {
  props: ['drugs', 'indics'],
  template:
    `<div>
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
        `<li class="list-group-item indic-row" :class="classObject" >
          <div>
            <b>{{indic.libelle}}</b>
          </div>
          <div>
            <indic-drug-item v-for="drugId in assoDrugs"
              :drugId="drugId"
              :drugs="drugs"
              :indic="indic" 
              :key="drugId"/>
          </div>
          <template v-if="indic.association.length > 0 ">
              <div><i>associations possibles :</i></div>
              <indic-thq
                    v-for="indicId in indic.association"
                    :indicId="indicId"
                    :indics="indics"
                    :key="indicId" />
          </template>
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
    `<div class="badge p-1 m-1 indic-drug-badge" :class="classObject" @click="toggleSelect">
      {{drugDisplay}}
    </div>`,

  computed: {
    classObject() {
      let badgeType = 'success';
      if (this.drug.selected) {
        badgeType = 'warning';
      } else if (this.drug.disabled) {
        badgeType = 'secondary';
      }
      badgeType = "badge-" + badgeType
      //return "badge badge-" + badgeType + " p-1 m-1 indic-drug-badge";
      res = {disabled: this.drug.disabled};
      res[badgeType] = true;
      return res;
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
      if (!this.drug.disabled) {
        App.vue.toggleSelect(!this.drug.selected, this.drug, 'thérapeutique');
      }
    },
  },

})

Vue.component('indic-thq', {
  props: ['indicId', 'indics'],
  template: `
      <div class="badge indic-ther m-1 p-1" :class="classObject">
            {{libelle}}
      </div>`,
  computed: {
    indic() {
      return this.indics[this.indicId];
    },
    classObject() {
      let badge = "info";
      if (this.indic.disabled) {
        badge = "secondary";
      } else if (this.indic.selected) {
        badge = "warning";
      }
      return "badge-" + badge;
    },
    libelle () {
      if (this.indic){
        return this.indic.libelle;}
    },
  },
})
