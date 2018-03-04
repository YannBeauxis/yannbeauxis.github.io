App.vue = new Vue({
  el: '#app',

  template: `
    <div id="app">
      <nav class="navbar navbar-default">
        <div class="container-fluid">
          <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbarSupportedContent" aria-expanded="false">
              <span class="sr-only">Toggle navigation</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#">Tisanes</a>
          </div>

          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="nav navbar-nav">
              <li class="nav-item" :class="{ active: activeNav === 'drugs-view'}">
                <a class="nav-link" href="#" @click="activeNav = 'drugs-view'">Vue par plante</a>
              </li>
              <li class="nav-item" :class="{ active: activeNav === 'indics-view'}">
                <a class="nav-link" href="#" @click="activeNav = 'indics-view'">Vue par indication</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div id="body">
        <drugs-view
          v-show="activeNav === 'drugs-view'" 
          :drugs-list-by-name="drugsListByName"
          :indics="indics">
        </drugs-view>
        <indics-view
          v-show="activeNav === 'indics-view'" 
          :drugs="drugs"
          :indics="indics">
        </indics-view>
      </div>
    </div>
  `,

  data: {
    activeNav: 'drugs-view',
    drugsListByName: [],
    drugs: {},
    indics: {},
    selectedDrugs: [],
    indicsAllowed: ['all'],
  },

  created: function() {
      let self = this
    App.loadJSON('data/drugs.json', function(response) {
      let drugs = JSON.parse(response);
      let drugsListByName = Object.values(drugs).sort(function (a, b) {
                  return a.name_fr > b.name_fr;}); 
      self.drugs = drugs;
      self.drugsListByName = drugsListByName;
    });
    App.loadJSON('data/indics.json', function(response) {
      self.indics = JSON.parse(response);
    });
  },

});

