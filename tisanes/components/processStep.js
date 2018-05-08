Vue.component('process-step', {

  props: ['activeStep', 'steps',],

  template:
    `<nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li 
            v-for="(step, index) in steps" 
            class="breadcrumb-item">
              <a href="#" @click="goStep(index)"> {{step.libelle}} </a>
          </li>
        </ol>
      </nav>`,

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
