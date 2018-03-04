Vue.component('navbar', {
  template: `
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <!-- Brand and toggle get grouped for better mobile display -->
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
            <li class="nav-item">
              <a class="nav-link" href="#" @click="activeNav = 'drugs-view'">Vue par plante</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" @click="activeNav = 'indics-view'">Vue par indication</a>
            </li>
          </ul>
        </div>
      </div><!-- /.container-fluid -->
    </nav>
  `
})
