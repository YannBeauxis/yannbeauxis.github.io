Vue.component('drugs-view', {
  props: ['selectedDrugs', 'drugs-list-by-name', 'indics', 'indicType', 'numIndicMax'],
  template:
    `<div>
      <div class="container">
        <div class="row">
          <div class="col-sm-6">
            <h4>Sélection possible</h4>
            <ul class="list-group pre-scrollable select-drug">
              <drug-row v-for="drug in drugsListByName"
                v-show="!drug.selected && !drug.disabled"
                :drugId="drug.id" 
                :indics="indics"
                :key="drug.id" />
            </ul>
          </div>
          <div class="col-sm-6">
            <h4>Sélectionnée par usage</h4>
            <selected-drug v-for="indicType in indicType"
              :selectedDrugs="selectedDrugs"
              :numIndicMax="numIndicMax"
              :indicType="indicType"
              :key="indicType" />
          </div>
        </div>
      </div>
    </div>`
})


Vue.component('selected-drug', {
  props: ['indicType', 'selectedDrugs', 'numIndicMax'],
  template: `
    <div>
      <h5>{{indicType}} ({{numIndicMax[indicType]}} max)</h5>
        <ul class="list-group">
          <drug-row v-for="drugId in selectedDrugs[indicType]"
            :drugId="drugId" 
            :indicType="indicType"
            :key="drugId" />
        </ul>
    </div>
    `,

})

Vue.component('drug-row', {
  props: ['drugId', 'indicType'],
  template: `
    <li class="list-group-item" :class="classObject">
        <div>
          <drug--name-common :drug="drug"/> 
          &nbsp <drug--name-sc :drug="drug" />
        </div>
        <div>
          <indic-thq
          v-for="indicId in drug.indications.therapeutic"
                :indicId="indicId"
                :indics="indics"
                :key="indicId" />
        </div>
        <div>
          <template v-if="!drug.selected">
            <button v-show="drug.hasTherapeutic" @click="toggleSelect('thérapeutique')" class="btn btn-info btn-sm float-right">
              + thérapeutique
            </button> 
            <button v-show="drug.hasOther.saveur" @click="toggleSelect('saveur')" class="btn btn-light btn-sm float-right">
              + saveur
            </button> 
            <button v-show="drug.hasOther.aspect" @click="toggleSelect('aspect')" class="btn btn-light btn-sm float-right">
              + aspect
            </button> 
          </template>
          <template v-if="drug.selected">
            <button @click="toggleSelect(indicType)" class="btn btn-danger btn-sm float-right">
              retirer
            </button> 
          </template>
        </div>
    </li>
  `,

  data: function () {
    return {
      drug: App.vue.drugs[this.drugId],
      indics: App.vue.indics,
    }
  },

  computed: {
    classObject:  function () {
      return {
        selected: this.drug.selected,
        disabled: this.drug.disabled,
      };
    },
  },

  methods: {
    toggleSelect: function(indicType) {
      addDrug = !this.drug.selected;
      App.vue.toggleSelect(addDrug, this.drug, indicType);
    },

  },

})

Vue.component('drug--name-common', {
  props: ['drug'],
  template: `<span v-html="nameEval" />`,
  computed: {
    nameEval () {
      name = '<b>' + App.capitalizeFirst(this.drug.name_fr) + '</b>';
      //parts = App.parts(this.drug);
      //if (parts.length == 1){
        name += 
          '<span class="badge badge-light m-1 align-top">' 
          + this.drug.part 
          + '</span>';
      //}
      return name;
    },
  },
})

Vue.component('drug--name-sc', {
  props: ['drug'],
  template: `
      <small><i class="float-right">
          <a target="_blank" :href="gbifUrl">  {{nameScEval}} </a>
      </i></small>`,
  computed: {
    nameScEval () {
      if (this.drug.gbif){
        return this.drug.gbif.name_sc;
      } else {
        return this.drug.name_sc_ansm
      }
    },
    gbifUrl () {
      if (this.drug.gbif){
        return 'https://www.gbif.org/species/' + this.drug.gbif.id;
      } else {
        return ''
      }
    },
  },
})

