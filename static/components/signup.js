const sign = {
  template: `  
    <div style="background: rgba(211, 207, 207, 0.925);background-size: cover;box-sizing: border-box;">
    <body style="background: rgba(211, 207, 207, 0.925);background-size: cover;box-sizing: border-box;width: 100vw;
    min-height: 100vh;">
    <div>
    <br><br><br>
    
    <div class="mb-2" style="text-align: center; border-radius: 10px; box-shadow: 0 0 25px -5px rgba(0, 0, 0, 0.6); background: linear-gradient(whitesmoke, silver); margin-left: 35%; margin-right: 35%; box-sizing: border-box">
    <form @submit.prevent="register">
      <h1 class="app"   style="font-family: cursive; font-size: xx-large; font-weight: 700;font-stretch: ultra-condensed; color: rgb(9, 1, 14);">
      Kanban</h1><br>
      <div class="mb-3" style="padding: 50x 50px 50px 50px; font-size: 13px; font-weight: 60; letter-spacing: 0.5px; border-spacing: 15px">
        <label for="exampleInputName1" class="form-label"><input type="text" v-model="name" name="name"  class="form-control" style="color: #01010e;background: whitesmoke;font-size: 15px;font-weight: 500;letter-spacing: 1px;height: 40px; padding: 6px 6px; border-radius: 5px;border: 2px solid #F2F5F6;box-shadow: none;width: 95%;"
            id="exampleInputName1" required="True" maxlength="25" pattern="^[a-zA-Z1-9].*" title="Avoid spaces, tabs or any special characters at the start." placeholder="Name"></label>;
      </div><br><br>
      <br>
      <div class="mb-3" style="padding: 50x 50px 50px 50px; font-size: 13px; font-weight: 60; letter-spacing: 0.5px; border-spacing: 15px">
        <label for="exampleInputEmail1" class="form-label"><input type="email" v-model="email" name="email" class="form-control" style="color: #01010e;background: whitesmoke;font-size: 15px;font-weight: 500;letter-spacing: 1px;height: 40px; padding: 6px 6px; border-radius: 5px;border: 2px solid #F2F5F6;box-shadow: none;width: 95%;"
            id="exampleInputEmail1" aria-describedby="emailHelp" required="True" pattern="^[a-zA-Z1-9].*" title="Avoid spaces, tabs or any special characters at the start." maxlength="25" placeholder="email address"></label>
      </div><br><br>
      <br>
      <div class="mb-3" style="padding: 50x 50px 50px 50px; font-size: 13px; font-weight: 60; letter-spacing: 0.5px; border-spacing: 15px">
        <label for="exampleInputPassword1" class="form-label"><input type="password" v-model="passw" name="passw" class="form-control" style="color: #01010e;background: whitesmoke;font-size: 15px;font-weight: 500;letter-spacing: 1px;height: 40px; padding: 6px 6px; border-radius: 5px;border: 2px solid #F2F5F6;box-shadow: none;width: 95%;"
            id="exampleInputPassword1" required="True" maxlength="25" minlength="6"   title="Avoid usage of space in the password of min length 6."  placeholder="Password"></label>
            </div>
            <div class="mb-3" style="padding: 50x 50px 50px 50px; font-size: 13px; font-weight: 60; letter-spacing: 0.5px; border-spacing: 15px">
        
        <button  type="submit"  class="btn2" style="color: #fff; background-color: #050009; font-size: 13px; font-weight: 500; letter-spacing: 0.5px; width: 30%; padding: 11px; margin: 0 10px 10px 0; border: 2px solid; border-color: #01010e; border-radius: 15px; display: inline-block;">
        Sign up</button><br>
        
<router-link :to="{name:'login'}" class="nav-link active" style="font-weight: 600;font-size: 15px;" aria-current="page">Login</router-link><br>
      </div>
     

      

</form>
</div>

      </div>
      </body>
      </div>
      
    
    `,
  data() {
    return {
      name: "",
      email: "",
      passw: "",

      id: "",
      success: true,
      error: "",
      // lis: [] ,
    };
  },
  methods: {
    async register() {
      // t.preventDefault();
      // console.log("pressed")
      const res = await fetch("/api/user", {
        method: "POST",
        headers: {
          //  'Authorization': 'Bearer '+this.token,
          Accept: "application/json",
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          user_name: this.name,
          email: this.email,
          password: this.passw,
        }),
      });
      const resp = await res.json();
      if (res.ok) {
        this.id = resp.id;
        localStorage.setItem("token", this.id);
        localStorage.setItem("user_name", this.name);
        localStorage.setItem("email", this.email);
        // window.location.href=("/addlist")
        alert("Add your first list to continue.");
        this.$router.push({ path: "/addlist" });
      } else {
        const e = resp.message;
        alert(e);
      }
    },
    async beforeMount() {
      const res = await fetch("/api/logout", {
        method: "POST",
        headers: {
          // 'Authorization': 'Bearer '+localStorage.getItem("token"),
          Accept: "application/json",
          "Content-Type": "application/json;charset=utf-8",
        },
      });
      if (res.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("user_name");
        localStorage.removeItem("email");
        //  alert("You were logged out!")
        //  router.replace("/")
        //  this.$router.push("/")
        //  alert("You were logged out!")
      } else {
        alert("Please try again!");
      }
    },
  },
};

export default sign;
