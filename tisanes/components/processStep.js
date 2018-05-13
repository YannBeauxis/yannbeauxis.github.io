Vue.component('process-step', {

  props: ['activeStep', 'steps',],

  template:
    `

            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="nav navbar-nav">
                <li 
                  v-for="(step, index) in steps" 
                  class="nav-item" 
                  :class="{ active: activeStep === index}">
                  <a class="nav-link" href="#" @click="goStep(index)">{{step.libelle}}</a>
                </li>
              </ul>
            </div>`,

  computed: {
    processInfo:  function () {
      return this.steps[this.activeStep];
    },
  },

  methods: {
    goStep: function(index) {
      App.vue.activeStep = index;
      App.vue.activeNav=this.steps[index].navs[0].id;
    }
  }

})
