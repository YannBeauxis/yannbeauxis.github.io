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
      <div class="container-fluid" > <!-- @click="toggleSelect" -->
        <div class="row">
            <input v-show="!disabled" type="checkbox" @click="toggleSelect" class="big-checkbox" > 
            <drug--name-common :drug="drug"/> 
            &nbsp <drug--name-sc :drug="drug" />
        </div>
        <div class="row">
          <div class="col-lg-7">
              <drug--indic-thq
              v-for="indic in drug.ind_mel_tis_ansm"
              v-bind:indic="indic"
              v-bind:indics="indics"
                    :drug="drug"
              v-bind:key="indic.id"/>
          </div>
          <template v-if="drug.ind_mel_tis_ansm.length > 0">
            <div class="col-lg-5">
              <drug--indic-autre :drug="drug"/>
            </div>
          </template>
        </div>
      </div>
    </li>
  `,

  data: function () {
    return {
      selected: false,
    }
  },

  computed: {
    classObject:  function () {
      return {
        selected: this.selected,
        disabled: this.disabled,
      };
    },
    indicsIds: function() {
      return this.drug.ind_mel_tis_ansm.map(
            function(indic) { return indic.id; });
    },
    indicsAssoIds: function() {
      res = [];
      this.drug.ind_mel_tis_ansm.map (
        function( indic) { 
          App.vue.indics[indic.id].association.map(
            function(indicAssoId) {
              res.push(indicAssoId);})
        });
      return res;
    },
    disabled: function() {
      let res = false ;
      let self = this;
      if(App.vue.selectedDrugs.length > 0) {
        let indics = App.vue.indics;
        let hasIndic = self.indicsIds.reduce (
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
      let self = this;

      let drugId = this.drug.id
      let addDrug = event.target.checked;
      this.selected = addDrug;
      let allIndics = App.vue.indics;
      let direction = 1;

      let selectedDrugs = App.vue.selectedDrugs;
      if (addDrug) {
        selectedDrugs.push(drugId);
        direction = 1;
      } else {
        index = selectedDrugs.indexOf(drugId)
        if (index > -1) {
            selectedDrugs.splice(index, 1);
        }
        direction = -1;
      }

      Object.keys(allIndics).map ( function (indicIds, index) {
        let indic = allIndics[indicIds];
        let indicId = Number(indicIds);
        if (self.indicsIds.indexOf(indicIds) > -1 ){
            indic.drugSelectNum += direction;
        } else if ( self.indicsAssoIds.indexOf(indicId) === -1 ) {
            indic.drugNotSelectNum += direction;
        }
        indic.selected = indic.drugSelectNum > 0 && indic.drugNotSelectNum == 0;
        indic.disabled = indic.drugNotSelectNum > 0;
      });

    },

  },

})

Vue.component('drug--name-common', {
  props: ['drug'],
  template: `<span v-html="nameEval" />`,
  computed: {
    nameEval () {
      name = '<b>' + App.capitalizeFirst(this.drug.name_fr) + '</b>';
      parts = App.parts(this.drug);
      if (parts.length == 1){
        name += ' (' + parts[0] + ')';
      }
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
          return ' ('+ this.indic.parts.join(", ") + ')';}}
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
      res = res.join(', ');
      if (res != '') {
        res = '<i>Autres usages possibles :</i><br />' + res;
      }
      return res;
    },
  },
})
