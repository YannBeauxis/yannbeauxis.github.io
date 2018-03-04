Vue.component('indics-view', {
  props: ['drugs', 'indics'],
  template:
    `<div>
      <h2>Vue par indications</h2>
      <ul class="list-group">
        <li class="list-group-item" v-for="(indic, indicId) in indics">
          <div class="container-fluid">
            <div class="row">
              <b>{{indic.libelle}}</b>  
            </div>
            <div class="row">
              <div class="col-lg-7">
                <!--<i>Plantes :</i><br />-->
                <indic-drugs-list
                  :assoIndicDrug="assoIndicDrug"
                  :indicId="indicId" />
                <!--<template v-for="drugId in assoIndicDrug[indicId]">
                  {{drugs[drugId].name_fr}}, 
                </template>-->
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
        </li> 
      </ul>
    </div>`,
  computed: {
    assoIndicDrug() {
      let assoIndicDrug = {}
      Object.keys(this.indics).map(function(indicId) {
        assoIndicDrug[indicId] = [] })
      Object.values(this.drugs).map(function(drug) {
        drug.ind_mel_tis_ansm.map(function(drugIndic) {
          assoIndicDrug[drugIndic.id].push(drug.id); })
      })
      return assoIndicDrug },
  }
})

Vue.component('indic-drugs-list', {

  props: ['assoIndicDrug', 'indicId'],

  template:
    `<div>
      {{drugList}}
    </div>`,

  computed: {
    drugList() {
      listRaw = this.assoIndicDrug[this.indicId].map(function (drugId) {
        return App.capitalizeFirst(App.vue.drugs[drugId].name_fr);
      })
      return listRaw.join(', ')
    },
  },

})
