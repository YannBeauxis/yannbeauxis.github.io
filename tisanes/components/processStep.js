Vue.component('process-step', {

  props: ['activeStep', 'processes',],

  template:
    `<div>
      <a v-if="activeStep>0" href="#" @click="moveProcess(-1)" > Back </a>
      | 
      {{processInfo.libelle}} 
      |
      <a v-if="activeStep<processes.length-1" href="#" @click="moveProcess(1)" > Next </a>
    </div>`,

  computed: {
    processInfo:  function () {
      return this.processes[this.activeStep];
    },
  },

  methods: {
    moveProcess: function(step) {
      let newStep = App.vue.activeStep + step;
      App.vue.activeStep = newStep;
      App.vue.activeNav=this.processes[newStep].navs[0].id;
    }
  }

})
