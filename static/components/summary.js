const summary = {
  template: `
    
    
    <div class="gr" 
    style="display: flex;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    overflow: auto;
    white-space: nowrap;
    flex-shrink: none;
    
    ">
   
    <div v-for="i in lis">
    <div class="oi" style="display: inline-block;">


        <strong>STATISTICS</strong><br>
        <div class="op" style="border: solid; border-color: gray; border-style: solid; border-width: 20px;">
            <div class="kl" style="    border: solid;
            border-color: rgba(163, 144, 231, 0.646);
            border-style: solid;
            border-width: 3px;
            margin-left: 20px;
            margin-right: 50px;
            margin-top: 20px;
            border-radius: 10px;">
                <p style="text-decoration:underline; font-size:large; font-weight:500;padding-left:8px;">{{i.l_name}}</p>
                <p style="padding-left: 10px;">{{i.completed}} tasks completed</p>
                <p style="padding-left: 10px;">{{i.successfully_submitted}} succesfully submitted</p>
                <p style="padding-left: 10px;">{{i.pending}} pending tasks</p>
                <p style="padding-left: 10px;">{{i.failed_to_submit}} tasks were failed to submit</p>
                <p style="padding-left: 10px;">{{i.cards_that_crossed_deadline}} tasks crossed the deadline out of which {{i.successfully_submitted}} were completed on time</p>
                
            </div><br>
            
            <STRONG>GRAPH-</STRONG><br>
            
            <img class="im" v-bind:src="'static/'+i.list_id+'.png'">
            <br>
            <STRONG>TRENDLINE-</STRONG><br>
            <br>
            <img class="im" v-bind:src="'static/td'+i.list_id+'.png'">
            
        </div>
    </div>
    <br>
    
    </div>

</div>`,
  data() {
    return {
      lis: null,
    };
  },
  methods() {},
  async beforeMount() {
    const res = await fetch("/api/summary", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        Accept: "application/json",
        "Content-Type": "application/json;charset=utf-8",
      },
    });
    if (res.ok) {
      const resp = await res.json();
      // console.log(resp);
      this.lis = resp;
    } else {
    }
  },
};
export default summary;
