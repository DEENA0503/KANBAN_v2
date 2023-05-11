const move={
    template:`
    <div class="mb-3">

    <br>
    
    <div class="dropdown">
        <button type="button" class="btn btn-secondary dropdown-toggle dropdown-toggle text-wrap"
            data-bs-toggle="dropdown" style="background-color: black;color: white;">Move cards to the list:
        </button>
        <ul class="dropdown-menu dropdown-menu-dark">
          
            <div v-for="l in lis">
            <span v-if="l[0]!=ln">
            
            <li>
                
                <button @click="move_cards(l[0])" class="dropdown-item" :value="l[0]">{{l[1]}}</button>
            </li>
            </span>
            
            </div>
            <br>
            
        </ul>
    </div>
    <button @click="home" style="background-color:rgb(6, 0, 0);color: white;">Cancel</button>

</div>`,
    data(){
        return{
            lis:null,
            ln:null,
        }

    },
    methods: {
        async move_cards(l_id){
            //////////api for moving all cards and deleting list
            const res=await fetch(`/api/user/list/${this.$route.params.l_id}`,
            {method:"DELETE",
            headers:{
              'Authorization': 'Bearer '+localStorage.getItem("token"),
              'Accept': 'application/json',
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
              move_to_list:l_id,
              } )})

            if(res.ok){
              this.$router.push("/dashboard")
              
            }else{

                const e=resp.message
                alert(e)
            }
          

        },
        home(){
            this.$router.push("/dashboard")
        },
        
    },
    async beforeMount() {
        /////fetch lists pass it to dropdown
        const res= await fetch("/api/user/lists",
        {method:"GET",
        headers:{
        'Authorization': 'Bearer '+localStorage.getItem("token"),
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8'
      },
      
      },)
      if(res.ok){
        const resp=await res.json()
        this.lis=resp
        this.ln=this.$route.params.l_id }////the list to be deleted
        else{
            const e=res.message
            alert(e)
        }
    },


}
export default move