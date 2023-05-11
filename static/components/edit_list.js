const el={
    template:`
    <form @submit.prevent="save_pressed">
    <div class="mb-3">
        <h1>Edit List</h1><br>
        <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" name="l_id" type="button" data-bs-toggle="dropdown" aria-expanded="false">choose list</button>
            <ul class="dropdown-menu">
       
            <div v-for="lis in ls">       
                <li><router-link :to="'/'+lis[0]+'/edit_list'" @click.native="$router.go()"  class="dropdown-item">{{lis[1]}}</router-link></li>        
             </div>
        
            </ul>
        </div>
        <br>
       
            <label for="exampleFormControlInput1" class="form-label" style="font-weight:500;">List name</label>
            <input type="text" class="form-control" maxlength="20" id="exampleFormControlInput1" name="l_name" 
                required="True" v-model="l_name"  pattern="^[a-zA-Z1-9].*"
                title="Avoid spaces, tabs or any special characters at the start." style="width:auto;">
    
 
            <br>

            <div class="mb-3">
            <label for="exampleFormControlTextarea1"  class="form-label" style="font-weight:500;">Description</label>
            <textarea v-model="dsp" class="form-control" maxlength="45" id="exampleFormControlTextarea1" name="dsp" rows="3" 
                 style="width:auto"></textarea>
            

        </div>
  
        <div class="mb-3">
            <button  type="submit" class="btn btn-dark">SAVE</button>
        </div>
    </div>
    </form>
    
    `,
    data(){
        return{
            ls:null,
            list:null,
            l_name:"",
            dsp:"",

        }
    },
    methods: {
        async save_pressed(){
            const res=await fetch(`/api/user/list/${this.$route.params.l_id}`,{
                method:"PUT",
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
                alert("please enter details")
            }
        
        },
        w(){
            router.reload()
        }
       
        
    },
    async beforeMount() {
        console.log(this.$route.params.l_id)
        this.list=await this.$route.params.l_id
        
        const res=await fetch("api/user/lists",
        {method:"GET",
        headers:{
        'Authorization': 'Bearer '+localStorage.getItem("token"),
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8'
    },
      
      },)
        
        if (res.ok){
            // alert("success")
            const resp= await res.json()
            this.ls=resp    
            for( const i in resp){
                if(resp[i][0]== this.$route.params.l_id){
                    this.l_name=resp[i][1]
                    this.dsp=resp[i][2]
                }
            }
            console.log(this.l_name)
           
        }
    },
   
}

export default el