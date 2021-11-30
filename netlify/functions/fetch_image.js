const axios=require('axios');
const imageAPIKey=process.env.PEXELS_API_KEY;
const imageAPIUrl='https://api.pexels.com/v1/search';
exports.handler=async (event,context)=>{
  try{
  const reqBody=JSON.parse(event.body);
  const searchValue=reqBody.searchValue;
  const perPage=reqBody.perPage;
  let response=null;
  
  if (imageAPIUrl && imageAPIKey) {
   response=await axios(`${imageAPIUrl}?query=${searchValue}&size=medium&per_page=${perPage}`, {
          method: 'get',
          headers: {
            "Authorization": `${imageAPIKey}`
          }
   })
  }
  return {
    statusCode:200,
    body:JSON.stringify(response)
  }
  }
   catch(err){
     console.log(err)
   }
   
}