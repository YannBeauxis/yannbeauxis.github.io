Vue.component('drugs-view', {
  props: ['drugs-list-by-name', 'indics'],
  template:
    `<div>
      <h2>Vue par plante</h2>
      <ul class="list-group">
        <drug-row v-for="drug in drugsListByName"
          :drug="drug" 
          :indics="indics"
          :key="drug.id">
        </drug-row> 
      </ul>
    </div>`
})

Vue.component('drug-row', {
  props: ['drug', 'indics'],
  template: `
    <li class="list-group-item item-row" :class="classObject">
      <div class="container-fluid" >
        <div class="drug-checkbox d-inline-block align-top" >
          <input v-show="!disabled" type="checkbox" @click="toggleSelect" class="big-checkbox" :checked="drug.selected"> 
        </div>
        <div class="drug-main d-inline-block">
            <drug--name-common :drug="drug"/> 
            &nbsp <drug--name-sc :drug="drug" />
            <br />
              <drug--indic-thq
              v-for="indicId in drug.indications.therapeutic"
                    :indicId="indicId"
                    :indics="indics"
                    :drug="drug"
                    :key="indicId">
              </drug--indic-thq>
          <template v-if="drug.indications.other.length > 0">
              <drug--indic-autre :drug="drug"/>
          </template>
        </div>
      </div>
    </li>
  `,

  data: function () {
    return {
      //selected: false,
    }
  },

  computed: {
    classObject:  function () {
      return {
        selected: this.drug.selected,
        disabled: this.disabled,
      };
    },
    disabled: function() {
      let res = false ;
      let self = this;
      if(App.vue.selectedDrugs.length > 0) {
        let indics = App.vue.indics;
        let hasIndic = self.drug.indications.therapeutic.reduce (
          function (res, indId) {
            return res 
                    || indics[indId].active 
                    || !indics[indId].disabled;
          },
          false
        )
        res = !hasIndic;
      }
      return res;
    },
  },

  methods: {
    toggleSelect: function(event) {
      App.vue.toggleSelect(event.target.checked, this.drug);
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

Vue.component('drug--indic-thq', {
  props: ['indicId', 'indics', 'drug'],
  template: `
      <span class="badge badge-info indic-ther m-1 p-1">
            {{libelle}}
      </span>`,
  computed: {
    thisIndic () {
      return this.indics[this.indicId]
    },
    libelle () {
      if (this.thisIndic){
        return this.thisIndic.libelle;}
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
          let toPush = '<div class="badge badge-secondary" m-1 p-1>' + i + '</div>';
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
