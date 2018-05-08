Vue.component('step-nav', {

  props: ['activeStep', 'steps', 'activeNav', ],

  template:
    `<div class="m-1">
      <ul class="nav nav-pills nav-fill" >
        <li
            v-for='navItem in navInfos' 
            class="nav-item p-1" >
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
      return this.steps[this.activeStep].navs;
    },
  },

  methods: {
    toggleNav: function(navId) {
          App.vue.activeNav = navId;
    },
  }
})
