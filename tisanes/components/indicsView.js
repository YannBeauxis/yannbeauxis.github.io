Vue.component('indics-view', {
  props: ['drugs', 'indics'],
  template:
    `<div>
      <h2>Vue par indication</h2>
      <ul class="list-group">
        <indic-row v-for="indic in indics"
          :indic="indic" 
          :indics="indics"
          :drugs="drugs"
          :key="indic.id">
        </indic-row> 
      </ul>
    </div>`,
})

Vue.component('indic-row', {
  props: ['indic', 'indics', 'drugs'],
  template:
        `<li class="list-group-item item-row" :class="classObject" >
          <div class="container-fluid">
            <div class="row">
              <b>{{indic.libelle}}</b>
            </div>
            <div class="row">
              <div class="col-lg-7">
                <!--<i>Plantes :</i><br />-->
                <indic-drugs-list
                  :assoIndicDrug="assoIndicDrug"
                  :indic="indic" />
              </div>
              <template v-if="indic.association.length > 0 ">
                <div class="col-lg-5">
                  <i>associations possibles :</i>
                  <ul>

                    <li v-for="assoId in indic.association">
                      {{indics[assoId].libelle}}
                    </li>
                  </ul>
                </div>
              </template>
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
    assoIndicDrug() {
      let assoIndicDrug = {}
      Object.keys(this.indics).map(function(indicId) {
        assoIndicDrug[indicId] = [] })
      Object.values(this.drugs).map(function(drug) {
        drug.ind_mel_tis_ansm.map(function(drugIndic) {
          assoIndicDrug[drugIndic.id].push(drug.id); })
      })
      return assoIndicDrug;
    },
  }

})

Vue.component('indic-drugs-list', {

  props: ['assoIndicDrug', 'indic'],

  template:
    `<div>
      {{drugList}}
    </div>`,

  computed: {
    drugList() {
      if ( !this.indic.id ) {
        console.log(this.indic.libelle); }
      listRaw = this.assoIndicDrug[this.indic.id].map(function (drugId) {
        return App.capitalizeFirst(App.vue.drugs[drugId].name_fr);
      })
      return listRaw.join(', ')
    },
  },

})
