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
    <li class="list-group-item drug-row" :class="classObject">
      <div class="container" @click="toggleSelect">
        <div class="row">
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
      }
    },
    indicsIds: function() {
      return this.drug.ind_mel_tis_ansm.map(function(indic) { return indic.id; }) ;
    }
  },

  methods: {
    toggleSelect: function(event) {
      let selectedDrugs = App.vue.selectedDrugs
      let drugId = this.drug.id
      this.selected = !this.selected;
      if (this.selected) {
        selectedDrugs.push(drugId);
      } else {
        index = selectedDrugs.indexOf(drugId)
        if (index > -1) {
            selectedDrugs.splice(index, 1);
        }
      }
      let indicsA = App.vue.indicsAllowed;
      let self = this;
      if (indicsA[0] === 'all') {
        indicsA = this.indicsIds;
      } else if (selectedDrugs.length === 0) {
        indicsA = ['all'];
      } else {
        indicsA = indicsA.filter( function(indA) {
          return self.indicsIds.reduce( function (evalRes, indL) {
                    return evalRes || (indA == indL);
                  }, false)
        });
      }
      App.vue.indicsAllowed = indicsA;
      console.log(App.vue.indicsAllowed);
    }
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
