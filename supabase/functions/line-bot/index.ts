import List from "./list.ts"
import { supabaseClient } from "./supabase.ts"


Deno.serve(async (req) => {
  const { events } = await req.json();

  if(events && events[0]?.type === 'message'){
    
    const input = events[0].message.text;
    
    let output = ""
    
    // switch(input){
    //   case "Display":
    //     break;
    //   case "DeleteAll":
    //     break;
    //   case ""
    // }
    if(input === "Display"){
      const items = await List.fetchAll(supabaseClient());
      
      items.length == 0 ?? output = "nothing in the list" : output = items.map((item) => item.item).join('\n');
      }
    } else  if(input === "Deleteall") {
      await List.deleteAll(supabaseClient());
     
      output = "successfully delete all";
    } else if(input.startsWith("Delete ")){
      const strings = input.split(" ");
     
      const item = strings[1];
     
      await List.deleteOne(item,supabaseClient());
     
      output = `successfully delete ${item}`;
    } else{
      const newItem = new List(input);
      
      await newItem.save(supabaseClient());
      
      output = `Successfully add ${input}!`;
    }
    
    



    let messages = [
      {
        type: 'text',
        text: output,
      }
    ];
    

    const dataString = JSON.stringify({
      replyToken:events[0].replyToken,
      messages: messages,
    })

    const headers = {
      "Content-Type":"application/json",      
      Authorization:'Bearer ' + Deno.env.get("LINE_CHANNEL_ACCESS_TOKEN_PRODUCTION"),
    };

    fetch("https://api.line.me/v2/bot/message/reply",{
      method:"POST",
      body: dataString,
      headers: headers,
    }).then((result) => {console.log(result)}).catch((error) =>{console.log(error)})

  }

  return new Response(
    JSON.stringify({status: "ok"}),
    { headers: { "Content-Type": "application/json" }, }
  )
})
