const ec = {
  template: `
<form @submit.prevent="save_pressed">
  <div class="mb-3">
    <legend><strong>EDIT CARD</strong></legend><br><br>
    <div class="dropdown">choose card :
      <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"
        style="background-color:silver; color:black;">
        choose card
      </button>
      <ul class="dropdown-menu">
       
        <div v-for="c in cards[7]">
       
        <li><router-link :to="{name:'edit_card', params:{l_id:c.list_id, c_id:c.card_id}}" @click.native="$router.go()" class="dropdown-item">{{c.card_name}}</router-link></li>
      
        </div>
      </ul>
    </div>
    <br>

    
    <label for="exampleInputEmail1" class="form-label">Title</label>
    <input type="text" class="form-control" required="True" id="exampleInputEmail1" aria-describedby="emailHelp"
      name="card_name" v-model="c_name"  maxlength="20" pattern="^[a-zA-Z1-9].*"
      title="Avoid spaces, tabs or any special characters at the start." style="width:auto;">

 
  <div class="mb-3">
    <label for="exampleFormControlTextarea1" class="form-label">Content</label>
    <textarea v-model="cont"  class="form-control" maxlength="50" id="exampleFormControlTextarea1" name="cont" rows="3"
      style="width:auto;"></textarea>
 
  <div class="mb-3">
    <label for="birthday">Deadline:</label>
    <input type="datetime-local" id="birthday" v-model="deadline" name="deadline"   required="True" style="width:auto;">
 
  <div class="mb-3 form-check">
    
    <span v-if="cards[3]">
    <input type="checkbox" class="form-check-input" id="exampleCheck1" name="done" checked="True">
    </span>
    <span v-else>
    <input type="checkbox" class="form-check-input" id="exampleCheck1" name="done">
    </span>
    <label class="form-check-label" for="exampleCheck1">Mark as complete</label>
  </div>
  </div>
  </div>
  </div>
 
  
  <div class="mb-3">
    <button type="submit" class="btn btn-dark">SAVE</button>
  </div>
    </form>`,
  data() {
    return {
      c_name: "",
      cont: "",
      comp: false,
      deadline: "",
      cards: null,
      car: null,
    };
  },
  methods: {
    async save_pressed() {
      const v = document.getElementById("exampleCheck1");
      console.log(v.checked);
      if (v.checked == false) {
        this.comp = false;

        console.log(this.comp);
      } else {
        this.comp = true;
        console.log(this.comp);
      }
      const res = await fetch(
        `/api/user/${this.$route.params.l_id}/card/${this.$route.params.c_id}`,
        {
          method: "PUT",
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
            list_id: this.$route.params.l_id,
          }),
        }
      );
      if (res.ok) {
        // this.router.push("/dashboard")
        this.$router.push({ path: "/dashboard" });
      } else {
        console.log(res.message);
        console.log(this.c_name);
        console.log(this.cont);
        console.log(this.deadline);
        console.log(this.comp);
        alert("please enter details");
      }
    },
  },
  async beforeMount() {
    const res = await fetch(
      `/api/user/${this.$route.params.l_id}/card/${this.$route.params.c_id}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          Accept: "application/json",
          "Content-Type": "application/json;charset=utf-8",
        },
      }
    );
    const resp = await res.json();
    if (res.ok) {
      // alert("succes")
      this.cards = resp;
      this.c_name = resp[1];
      this.cont = resp[2];
      this.deadline = resp[5];
      this.comp = resp[3];

      console.log(this.cards);
      console.log(this.deadline);
      this.car = this.$route.params.c_id;
    } else {
      this.$router.push({ path: "/dashboard" });
    }
  },
};
export default ec;
