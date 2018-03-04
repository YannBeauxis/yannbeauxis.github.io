Vue.component('drugs-view', {
  props: ['drugs-list-by-name', 'indics'],
  template:
    `<div>
      <h2>Vue par plante</h2>
        <table id="plant-list" class="table table-sm table-striped">
        <thead>
          <tr>
            <th> Nom commun </th>
            <th> Nom scientifique </th>
            <th style="width: 50%"> Indications thérapeutiques </th>
            <th> Autres indications </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="drug in drugsListByName"
            v-bind:drug="drug"
            v-bind:key="drug.id">
            <td><drug--name-common
                :drug="drug"/></td>
            <td><drug--name-sc
              :drug="drug" /></td>
            <td>  
              <drug--indic-thq
              v-for="indic in drug.ind_mel_tis_ansm"
              v-bind:indic="indic"
              v-bind:indics="indics"
                    :drug="drug"
              v-bind:key="indic.id"/></td>
            <td>  
              <drug--indic-autre
                :drug="drug"/></td>
          </tr>
        </tbody>
      </table>
    </div>`
})

Vue.component('drug--name-common', {
  props: ['drug'],
  template: `<span v-html="nameEval" />`,
  computed: {
    nameEval () {
      name = '<b>' + App.capitalizeFirst(this.drug.name_fr) + '</b>';
      parts = App.parts(this.drug);
      if (parts.length == 1){
        name += '<br /><i>' + parts[0] + '</i>';
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
          return '- <i>'+ this.indic.parts.join(", ") + '</i>';}}
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
      return res.join(', ');
    },
  },
})
