Vue.component('drugs-view', {
  props: ['selectedDrugs', 'drugs-list-by-name', 'indics', 'numIndicMax'],
  template:
    `<div>
        <ul class="list-group">
          <drug-row v-for="drug in drugsListByName"
            :drugId="drug.id" 
            :context="'toSelect'"
            :indicType="indicType"
            :key="drug.id" />
        </ul>
    </div>`,
    computed: {
      indicType: function(){
        if (App.vue.activeStep === 0) {
          return 'thérapeutique'
        } else if (App.vue.activeStep === 1) {
          let activeNavDic = {
            taste: 'saveur',
            look: 'aspect'};
          return activeNavDic[App.vue.activeNav]; 
        }
      }
    }
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
            :context="'selected'"
            :key="drugId" />
        </ul>
    </div>
    `,

})

Vue.component('drug-row', {
  props: ['drugId', 'indicType', 'context'],
  template: `
    <li class="list-group-item" :class="classObject" v-show="toShow">
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
            <button @click="toggleSelect(indicType)" class="btn btn-info btn-sm float-right">
              Ajouter
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
    toShow: function() {
      if (this.context === 'toSelect') {
        let selectable = !this.drug.selected && !this.drug.disabled;
        let goodContext = 
          (App.vue.activeStep === 0 && this.drug.hasTherapeutic)
          ||
          (App.vue.activeStep === 1 && 
            (App.vue.activeNav === 'taste' && this.drug.hasOther.saveur)   
            ||
            (App.vue.activeNav === 'look' && this.drug.hasOther.aspect)   
          )
        return selectable && goodContext;
      } else if (this.context === 'selected') {
        return this.drug.selected;
      }
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

