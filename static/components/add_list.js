const al={
    template:`
    <form @submit.prevent="submitbutton">
  <div class="mb-3">
    <h1><strong>Add List</strong></h1><br>

    <label for="exampleFormControlInput1" class="form-label" style="font-weight:500">List name</label>
    <input type="text" v-model="l_name" class="form-control" id="exampleFormControlInput1" name="l_name" required="True"
      pattern="^[a-zA-Z1-9].*" maxlength="20" title="Avoid spaces, tabs or any special characters at the start."
      placeholder="List name" style="width:auto;">
    <br>
  </div>

  <div class="mb-3">
    <label for="exampleFormControlTextarea1" class="form-label" style="font-weight:500;">Description</label>
    <textarea class="form-control" v-model="dsp" id="exampleFormControlTextarea1" maxlength="45" name="dsp" rows="3" style="width:auto;"></textarea>
  </div>

  <div class="mb-3">
    <button type="submit" class="btn btn-dark">ADD</button>


  </div>
</form>
    `,
    data(){
        return{
            l_name:"",
            dsp:"",

        }

    },
    methods:{
        async submitbutton(){
            const res=await fetch("/api/user/lists",{
                method:"POST",
                headers:{
                     'Authorization': 'Bearer '+localStorage.getItem("token"),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    l_name:this.l_name,
                    dsp:this.dsp,
                    } ),

            })
            if(res.ok){
                // this.router.push("/dashboard")
                this.$router.push({path:"/dashboard"})
            }else{
              const e=res.message
              alert(e)
            }
        }
    }

}
export default al