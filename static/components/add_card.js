const ac = {
  template: `
    <div>
    <form @submit.prevent="add_button_pressed">
  <div class="mb-3">
    <h3><strong>ADD CARD</strong></h3><br>
    <div class="dropdown">
      <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        choose list
      </button>
      <ul  class="dropdown-menu">
        
        <div v-for="l in ls">
       
        <li ><router-link :to="{name:'add_card', params:{l_id:l[0]}}"  @click.native="$router.go()" class="dropdown-item">{{l[1]}}</router-link></li>
        
        </div>
      </ul>
    </div><br>
    

    <label for="exampleInputEmail1" class="form-label">Title</label>
    <input v-model="c_name" type="text"  required="True" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
      name="card_name" pattern="^[a-zA-Z1-9].*" title="Avoid spaces, tabs or any special characters at the start."
      maxlength="20" style="width:auto;">

  </div>
  <div class="mb-3">
    <label for="exampleFormControlTextarea1" class="form-label">Content</label>
    <textarea v-model="cont" class="form-control" maxlength="50" id="exampleFormControlTextarea1" name="cont" rows="3" style="width:auto;"></textarea>
  </div>
  <div class="mb-3">
    <label for="birthday">Deadline:</label>
    <input v-model="deadline" :min="td" type="datetime-local" id="birthday" name="deadline" required="True" style="width:auto;">
  </div>
  <div class="mb-3 form-check">

    <input type="checkbox" class="form-check-input" id="exampleCheck1" name="done">
    <label class="form-check-label" for="exampleCheck1">Mark as complete</label><br><br>

    <button type="submit" class="btn btn-dark" >ADD</button>
  </div>
</form>
</div>`,
  data() {
    const now = new Date();

    return {
      ls: null,
      comp: false,
      td: null,
      c_name: "",
      cont: "",
      deadline: null,
    };
  },

  methods: {
    async add_button_pressed() {
      const v = document.getElementById("exampleCheck1");
      if (v.checked == true) {
        this.comp = true;
        console.log(this.comp);
      }

      console.log(this.cont);
      const res = await fetch(`/api/user/${this.$route.params.l_id}/cards`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          Accept: "application/json",
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          c_name: this.c_name,
          cont: this.cont,
          comp: this.comp,
          deadline: this.deadline,
        }),
      });
      if (res.ok) {
        // this.router.push("/dashboard")
        this.$router.push({ path: "/dashboard" });
      } else {
        const e = res.message;
        alert(e);
      }
    },
  },
  async beforeMount() {
    const res = await fetch("/api/user/lists", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        Accept: "application/json",
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (res.ok) {
      // alert("success");
      const resp =await res.json();
      this.ls = resp;
      
      const p = this.$route.params.l_id;
      console.log(p);
      // const e = (resp[this.$route.params.l_id][3][0]).td;
      const e = resp[p];
      // console.log(e);
      const r = e[3][0];
      // console.log(r);
      const f = r.td;
      this.td = f;

      console.log(f);
    } else {
      const e = res.message;
      alert(e);
    }
  },
};
export default ac;
