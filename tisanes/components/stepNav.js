Vue.component('step-nav', {

  props: ['activeStep', 'processes', 'activeNav', ],

  template:
    `<div>
      <ul class="nav nav-pills">
        <li 
            v-for='navItem in navInfos' 

            class="nav-item" >
          <a class="nav-link" 
            v-bind:class="{ active: (activeNav === navItem.id) }" 
            href="#"
            @click="toggleNav(navItem.id)">
            {{navItem.libelle}}
          </a>
        </li>
      </ul>
    </div>`,

  computed: {
    navInfos:  function () {
      return this.processes[this.activeStep].navs;
    },
  },

  methods: {
    toggleNav: function(navId) {
          App.vue.activeNav = navId;
    },
  }
})
