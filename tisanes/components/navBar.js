Vue.component('navbar', {
  template: `
    <nav class="navbar navbar-expand-lg navbar-light">
      <a class="navbar-brand" href="#">Tisanes</a>

      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <a class="nav-link" href="#" @click="activeNav = 'drugs-view'">Vue par plante</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" @click="activeNav = 'indics-view'">Vue par indication</a>
          </li>
        </ul>
      </div>

    </nav>
  `
})
