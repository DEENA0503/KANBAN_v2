const base = {
  template: `
    <body>
  <nav class="navbar navbar-expand-lg bg-light">
    <div class="container-fluid">
      <a class="navbar-brand position-absolute end-50" href="/user">KANBAN</a>
      <router-link :to="{name:'dashboard'}" class="navbar-brand position-absolute end-50">KANBAN</router-link>
      
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse d-flex justify-content-end" id="navbarNavAltMarkup">
        <div class="navbar-nav">

          <button @click="exp_dash" class="btn btn-outline-secondary" id="liveToastBtn" style="background-color:#39393b ;color:#a8a9aa  ;border:none">Export</button>
                         
          <router-link :to="{name:'addlist'}" class="nav-link active" aria-current="page">Add list</router-link>

          
          <router-link :to="{name:'summary'}" class="nav-link active">Summary</router-link>
          <li class="nav-item dropdown">
            <a class="nav-link active" href="#" role="button" data-bs-toggle="dropdown"><svg
                xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                class="bi bi-person-circle active" viewBox="0 0 16 16">
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                <path fill-rule="evenodd"
                  d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
              </svg>
              {{u_name}}</a>
            <ul class="dropdown-menu">
             
              
              <li><button class="dropdown-item" @click="logout">logout</button></li>
            </ul>
          </li>

        </div>
      </div>
    </div>
  </nav>
  <router-view></router-view>

</body>
    `,
  data() {
    return {
      u_name: "",
      u_id: "",
      // mssg: "",
      // fi: null,
    };
  },
  methods: {
    async logout() {
      const res = await fetch("/api/logout", {
        method: "POST",
        headers: {
          //  'Authorization': 'Bearer '+localStorage.getItem("token"),
          Accept: "application/json",
          "Content-Type": "application/json;charset=utf-8",
        },
      });
      if (res.ok) {
        this.$router.replace({ path: "/" });
      } else {
        const e = res.message;
        alert(e);
      }
    },
    async exp_dash() {
      const res = await fetch("/export_records", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          // Accept: "application/json",
          // "Content-Type": "application/json;charset=utf-8",
        },
      });
      if (res.ok) {
        // this.$router.replace({ path: "/" });
        const files = await res.blob();
        
        var a = document.createElement("a");
        a.href = window.URL.createObjectURL(files);
        a.download = `kanban_file.csv`;
        a.click();

        alert("File sent through mail!");
      } else {
        // const e = res.message;
        alert("Cant export please try again!");
      }
    },
  },

  async beforeMount() {
    this.u_name = localStorage.getItem("user_name");
  },
};

export default base;
