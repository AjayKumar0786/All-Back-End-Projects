import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
const app = express();
const port  = 3000;
const saltRounds=10;
app.set('view engine', 'ejs');
mongoose.connect("mongodb+srv://sanjubora84:sanjubaba84@userdata.ka4wxlc.mongodb.net/userdata?retryWrites=true&w=majority");

const dataschema  = new mongoose.Schema(
    {
       fullname:{
        type: String,
        required: true,
       
       },


        email:{
        type:String,
        required:true,
    
        lowercase:true
    },
    mobile:{
        type:String,
        required:true,
    
    }
,

    
   password:{
    type:String,
    required:true,

   }
}
)

const userlogin = mongoose.model("userlogin",dataschema);


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.get('/',(req,res)=>{
    res.render("login");
})
app.post('/login',async (req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
try{
  
    const check = await userlogin.findOne({ email: email});
    bcrypt.compare(password,check.password,function(err,result){
   if(result==true){
    
    res.render('dashboard',{username:check.fullname})
   
   }
   else{
    res.send("error");
   }
    })
}catch(err){
    console.log(err);
}

});

app.post('/signup', async(req,res)=>{
 
    bcrypt.hash(req.body.password,saltRounds,function(err,hash){
        const newuser =new userlogin({
            fullname:req.body.fullname,
            email:req.body.email,
            mobile:req.body.mobile,
            password:hash
      
          })
    const x = newuser.save();
   
    })
      
 
  
    
  
    res.redirect('/');
})
app.listen(port,(req,res)=>{
    console.log(`listening on ${port}`);
})