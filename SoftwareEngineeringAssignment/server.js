import makeIndex from "./index.js"

const app  = makeIndex
const PORT =5000;

app.listen(PORT,()=>console.log('Listening to port :'+PORT))

