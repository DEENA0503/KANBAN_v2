const dash = {
  template: `
    
    <body>
  <div class="lis" >
  <div  v-for="l in ls">
   
    
  
    <div class="list-group">
      <div class="dropup-center dropup text-wrap">
        <button class="btn btn-secondary dropdown-toggle text-wrap" type="button" data-bs-toggle="dropdown" aria-expanded="false"
          style="font-weight:750 ;">
          {{ l[1]}}

        </button>
        <div class="dsp text-wrap">{{l[2]}}</div>

        <ul class="dropdown-menu dropdown-menu-dark">
          <li ><router-link :to="{name:'add_card', params:{l_id:l[0]}}" class="dropdown-item">add card</router-link></li>
          <li><button  @click="delete_list(l[0], l[1])" style="background-color:rgba(0, 0, 0, 0.134); color:lightgrey;">delete list</button></li>
          <li ><router-link :to="{name:'edit_list', params:{l_id:l[0]}}" class="dropdown-item">edit list</router-link></li> 
          

        </ul>
      </div>

     
      <div v-for="cr in l[3]">


     

      <div class="card text-center">
        <div class="btn-group dropend">
          <button type="button" class="btn btn-secondary text-wrap"
            style="background-color: darkgrey;width: 270px;color:black;font-weight:700;font-size: large;" v-bind:class="[cr.disabled ? 'disabled' : '']">
            {{ cr.c_name }}
          </button>
          <button type="button" class="btn btn-secondary dropdown-toggle dropdown-toggle-split "  
            data-bs-toggle="dropdown" aria-expanded="false"
            style="background-color: darkgrey;width: 50px;color: black;">
            <span class="visually-hidden">Toggle Dropend</span>
          </button>
          <ul class="dropdown-menu dropdown-menu-dark">
            
            <li ><router-link :to="{name:'edit_card', params:{l_id:l[0], c_id:cr.c_id}}" class="dropdown-item" v-bind:class="[cr.disabled ? 'disabled' : '']" >edit card</router-link></li>
        
            <li><button  @click="delete_card(l[0], cr.c_id)" style="background-color:#39393b ;color:#FFFFFF ;border:none">delete card</button></li>
           
            
            
            

            <li>
              <hr class="dropdown-divider">
            </li>
            <li><a class="dropdown-item" style="color:#FFFFFF" >move card</a>
              <ul>
                
                <div v-for="lis in ls">

                <li>
                 
                  <div v-if="lis[0]!=l[0]">
                  
                    <button  type="submit"   name="l_id" @click="move_to(cr.c_id,cr.c_name,cr.cont,cr.deadline,l[0], lis[0])"
                      value="lis.l_id" style="background-color:#39393b ; color:#FFFFFF ;border:none;">
                      {{lis[1]}}
                    </button>
                  
                  </div>
                </li>
               
                </div>
              </ul>
            </li>
           

          </ul>
        </div>
        

        <div class="card-body"  v-bind:class="[cr.disabled ? 'aria-disabled' : '']">
       
          <p class="card-text text-wrap" v-bind:class="[cr.disabled ? 'aria-disabled' : '']" style="color:grey">{{cr.cont}}</p>

         
          
          <div  v-if="cr.status=='completed'">
          <strong style="color:rgba(29, 160, 59, 0.735)" class="text-wrap" v-bind:class="[cr.disabled ? 'aria-disabled' : '']">COMPLETED</strong>
          </div>
          <div  v-if="cr.status=='pending'">
          <strong style="color:rgba(193, 34, 87, 0.986)" class="text-wrap" v-bind:class="[cr.disabled ? 'aria-disabled' : '']">PENDING</strong>
          </div>
           <div  v-if="cr.status=='failed to submit'">
          <strong style="color:rgba(193, 34, 87, 0.986); opacity:0.5" class="text-wrap" v-bind:class="[cr.disabled ? 'aria-disabled' : '']">FAILED TO SUBMIT</strong>
          </div>
           <div  v-if="cr.status=='the deadline is today'">
          <strong style="color:rgba(73, 57, 223, 0.986)" class="text-wrap" v-bind:class="[cr.disabled ? 'aria-disabled' : '']">THE DEADLINE IS TODAY</strong>
          </div>
           <div  v-if="cr.status=='successfully submitted'">
          <strong style="color:rgba(29, 160, 59, 0.735); opacity:0.5" class="text-wrap" v-bind:class="[cr.disabled ? 'aria-disabled' : '']">SUCCESSFULLY SUBMITTED</strong>
          </div>
          <br>
          <div v-if="cr.comp">
            <div style="color:rgba(103, 139, 97, 0.8);text-decoration-line: underline;">completed on : {{cr.d}}</div>
          </div>
          
          <div  v-if="cr.status=='completed'">
            <button type="button" @click="status('incomplete', cr.c_id,cr.c_name,cr.cont,cr.deadline,l[0], )" class="btn btn-outline-light">incomplete</button>
          </div>
          <div v-if="cr.status=='pending'">
            <button type="button" @click="status('complete',cr.c_id,cr.c_name,cr.cont,cr.deadline,l[0])" class="btn btn-outline-secondary">completed</button>
        </div>
        <div v-if="cr.status=='the deadline is today'">
            <button type="button" @click="status('complete',cr.c_id,cr.c_name,cr.cont,cr.deadline,l[0])" class="btn btn-outline-secondary">completed</button>
        </div>
        </div>
        <div class="card-footer text-muted" v-bind:class="[cr.disabled ? 'aria-disabled' : '']">
          DEADLINE : {{ cr.deadline}}
        </div>

      </div>




     
      </div>


      
      <router-link :to="{name:'add_card', params:{l_id:l[0]}}" class="btn btn-outline-danger a">ADD CARD +</router-link>




    </div>

   
    </div>


  </div>
  </div>
  </div>
  
</div>
</body>
    `,
  data() {
    return {
      // lis:[]
      ls: null,
      // cards:null,
      // comp:null,
      // status:"",
      // disabled:"",
    };
  },

  async beforeMount() {
    console.log(localStorage.getItem("token"));
    const res = await fetch(
      "/api/user/lists",

      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          // "Authorization": `Bearer ${localStorage.getItem('token')}`,
          Accept: "application/json",
          "Content-Type": "application/json;charset=utf-8",
        },
      }
    );
    if (res.ok) {
      const resp = await res.json();
      this.ls = resp;
      console.log(resp)
      const o = Object.keys(this.ls).length;
      // console.log(o);
      if (o == 0) {
        alert("Please add a list to continue.");
        this.$router.push({ path: "/addlist" });
      }
    } else {
      this.$router.replace({ path: "/" });
      alert(res.message);
    }
  },
  methods: {
    async delete_card(l_id, c_id) {
      if (confirm("do you want to delete card?")) {
        const res = await fetch(`/api/user/${l_id}/card/${c_id}`, {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            Accept: "application/json",
            "Content-Type": "application/json;charset=utf-8",
          },
        });
        if (res.ok) {
          // this.router.push("/dashboard")
          location.reload();
        } else {
          const e = res.message;
          alert(e);
        }
      } else {
      }
    },
    async delete_list(l_id, l_name) {
      if (confirm(`Do you want to delete the list ${l_name}?`)) {
        const r = this.ls[l_id];
        // console.log(r);
        const o = r[3].length;

        if (o > 0) {
          if (
            confirm(`Move cards of the list ${l_name}?
          or
press CANCEL to delete list with all cards.`)
          ) {
            ////relocate the page to choose list for this
            this.$router.push({ path: `/move_cards/${l_id}` }); ///////////////// list as parameter
          } else {
            const res = await fetch(`/api/user/list/${l_id}`, {
              method: "DELETE",
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                Accept: "application/json",
                "Content-Type": "application/json;charset=utf-8",
              },
              body: JSON.stringify({
                move_to_list: -1,
              }),
            });

            if (res.ok) {
              // this.router.push("/dashboard")
              location.reload();
            } else {
              const e = res.message;
              alert(e);
            }
          }
        } else {
          const res = await fetch(`/api/user/list/${l_id}`, {
            method: "DELETE",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              Accept: "application/json",
              "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
              move_to_list: -1,
            }),
          });

          if (res.ok) {
            // this.router.push("/dashboard")
            location.reload();
          } else {
            const e = res.message;
            alert(e);
          }
        }
      } else {
      }
    },
    async move_to(c_id, c_name, cont, deadline, l_id, tolist) {
      const res = await fetch(`/api/user/${l_id}/card/${c_id}`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          Accept: "application/json",
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          c_name: c_name,
          cont: cont,
          deadline: deadline,
          list_id: tolist,
        }),
      });
      if (res.ok) {
        location.reload();
      } else {
        const e = res.message;
        alert(e);
      }
    },
    async status(arg, c_id, c_name, cont, deadline, l_id) {
      if (arg == "complete") {
        const res = await fetch(`/api/user/${l_id}/card/${c_id}`, {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            Accept: "application/json",
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify({
            c_name: c_name,
            cont: cont,
            comp: true,
            deadline: deadline,
            list_id: l_id,
          }),
        });
        if (res.ok) {
          location.reload();
          // this.$router.replace({ path: "/dashboard" });
        } else {
          // console.log(res.message);
          // console.log(this.c_name);
          // console.log(this.cont);
          // console.log(this.deadline);
          // console.log(this.comp);
          alert("please enter details");
        }
      }
      if (arg == "incomplete") {
        // call incomplete
        const res = await fetch(`/api/user/${l_id}/card/${c_id}`, {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            Accept: "application/json",
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify({
            c_name: c_name,
            cont: cont,
            comp: false,
            deadline: deadline,
            list_id: l_id,
          }),
        });
        if (res.ok) {
          
          location.reload();
        } else {
          // console.log(res.message);
          // console.log(this.c_name);
          // console.log(this.cont);
          // console.log(this.deadline);
          // console.log(this.comp);
          alert("please enter details");
        }
      }
    },
  },
};

export default dash;
