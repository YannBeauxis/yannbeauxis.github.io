Vue.component('drugs-view', {
  props: ['selectedDrugs', 'drugs-list-by-name', 'indics', 'indicType', 'numIndicMax'],
  template:
    `<div>
      <h2>Vue par plante</h2>
      <div class="container">
        <div class="row">
          <div class="col-sm-6">
            <h3>Sélection possible</h3>
            <ul class="list-group pre-scrollable select-drug">
              <drug-row v-for="drug in drugsListByName"
                v-show="!drug.selected && !drug.disabled"
                :drugId="drug.id" 
                :indics="indics"
                :key="drug.id" />
            </ul>
          </div>
          <div class="col-sm-6">
            <h3>Sélectionnée par usage</h3>
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
      <h4>{{indicType}} ({{numIndicMax[indicType]}} max)</h4>
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
      <div class="container-fluid" >
        <div class="drug-main d-inline-block">
            <drug--name-common :drug="drug"/> 
            &nbsp <drug--name-sc :drug="drug" />
            <br />
              <indic-thq
              v-for="indicId in drug.indications.therapeutic"
                    :indicId="indicId"
                    :indics="indics"
                    :key="indicId" />
          <template v-if="drug.indications.other.length > 0">
              <drug--indic-autre :drug="drug"/>
          </template>
        </div>
        <div class="drug-checkbox d-inline-block float-right" >
          <template v-if="!drug.selected">
            <b>Sélectionner</b><br />
            <button v-show="drug.hasTherapeutic" @click="toggleSelect('thérapeutique')" class="btn btn-info btn-sm">
              thérapeutique
            </button> 
          </template>
          <template v-if="drug.selected">
            <button @click="toggleSelect(indicType)" class="btn btn-danger btn-sm">
              retirer
            </button> 
          </template>
        </div>
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
      <i>
          <a target="_blank" :href="gbifUrl">  {{nameScEval}} </a>
      </i>`,
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

Vue.component('drug--indic-autre', {
  props: ['drug'],
  template: `<div class="indic-autre" v-html="indicEval" />`,
  computed: {
    indicEval () {
      let res = [];
      ['saveur', 'aspect'].forEach(function(i) {
        if ( this.drug.indications.other.indexOf(i) > -1 ) { 
          let toPush = '<div class="badge badge-light" m-1 p-1>' + i + '</div>';
          res.push(toPush); }
      }, this)
      res = res.join('');
      if (res != '') {
        res = '<i>Autres usages possibles :</i> ' + res;
      }
      return res;
    },
  },
})


