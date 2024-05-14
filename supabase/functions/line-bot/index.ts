/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

Deno.serve(async (req) => {
  const { events } = await req.json();

  if(events && events[0]?.type === 'message'){
    
    let messages = [
      {
        type: 'text',
        text: `reply to ${events[0].message.text}`,
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
