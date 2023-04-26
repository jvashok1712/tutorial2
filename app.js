const express = require("express");
const bodyParser = require("body-parser");
const mongoose =  require("mongoose");

const app = express();

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect("mongodb://0.0.0.0:27017/F1",{useNewUrlParser: true});

const obj={value:'xyz'};

function updateObj(x){
    obj.value=x;
}

const obj2={email:'xyz',area:'dkjs'};

function updateObj2(x,y){
    obj2.email=x;
    obj2.area=y;
}

const userSchema = new mongoose.Schema({
    name:String,
    dateOfBirth:Date,
    email:{
        type: String,
        required: true,
        unique: true
    },
    mobileNo:Number,
    aadhar:Number,
    password:String,
    location:String,
    houseNo:String,
    streetName:String,
    city:String,
    district:String,
    state:String,
    pincode:Number
});

const User = new mongoose.model("User",userSchema);

const orderSchema=new mongoose.Schema({
    personname:String,
    personmail:String,
    personphn:Number,
    personAddress:String,
    personArea:String,
    quantity:Number,
    deliveryDate:Date,
    status: {
        type: String,
        default: 'pending'
      },
    orderId:{
        type:String
    }
});

const Order=new mongoose.model("order",orderSchema)

const adminSchema=new mongoose.Schema({
    name:String,
    adminId:String,
    password:String
});

const Admin=new mongoose.model("admin",adminSchema);

// const newadmin=new Admin({
//     name:'sivasai',
//     adminId:'siva123',
//     password:'sivasaikakarla'
// });
// newadmin.save();



const deliveryboySchema=new mongoose.Schema({
    name:String,
    phn:Number,
    email:String,
    employeId:String,
    deliveryArea:String,
    password:String,
    approveStatus:{
        type: String,
        default: 'pending'  
    }
    
});

const Deliveryboy=new mongoose.model("deliveryboy",deliveryboySchema);

app.get("/",function(req,res){
    res.render("home");
});

app.get("/userlogin",function(req,res){
    res.render("userlogin");
});

app.get("/adminlogin",function(req,res){
    res.render("adminlogin");
});

app.get("/userregister",function(req,res){
    res.render("userregister");
});

app.get("/employeeregister",function(req,res){
    res.render("employeeregister");
});

app.get("/employeelogin",function(req,res){
    res.render("employeelogin");
});

app.get("/booking",function(req,res){
    res.render("booking");
});

app.get("/complaints",function(req,res){
    res.render("complaints");
});

app.get("/about",function(req,res){
    res.render("about");
})

app.get("/prevorders",function(req,res){
    Order.find({personmail:obj.value})
    .then(function(foundorders){
        if(foundorders){
            res.render("prevorders",{orders:foundorders});
        }else{
            res.render("noorders");
        }
    })
    .catch((err)=>{
        console.log(err);
    })
});

app.get("/manageemployee",function(req,res){
    
    Deliveryboy.find({approveStatus:'pending'})
    .then(function(foundemp){
        if(foundemp){
        res.render("manageemployee",{emp:foundemp});
        }else{
            res.write('<h1>No pending requests found</h1>');
        }
    })
    .catch((err) => {
        console.log(err);
    });
   
});

app.get("/employeedetails",function(req,res){
    
    Deliveryboy.find({approveStatus:'approved'})
    .then(function(foundemp){
        if(foundemp){
        res.render("employeedetails",{emp:foundemp});
        }else{
            res.write('<h1>No pending requests found</h1>');
        }
    })
    .catch((err) => {
        console.log(err);
    });
   
});


app.post("/adminlogin",function(req,res){
    const adminId=req.body.adminId;
    const password=req.body.password;
    Admin.findOne({adminId:adminId})
    .then(function(foundtuple){
        if(foundtuple){
            if(foundtuple.password===password){
                Order.find({status:'pending'})
                .then(function(foundorders){
                    if(foundorders){
                        res.render("adminhome",{orders:foundorders});
                    }else{
                        res.render("noorders");
                    }
                })
                .catch((err)=>{
                    console.log(err);
                });
            }
        }
    })
    .catch((err) => {
        console.log(err);
    });
});

app.post("/userregister",function(req,res){
    const username=req.body.name;
    const emailinput = req.body.email;
    const newUser = new User({
    name:req.body.name,
    dateOfBirth:req.body.dob,
    email:req.body.email,
    mobileNo:req.body.mobile,
    aadhar:req.body.aadhar,
    password:req.body.pass,
    location:req.body.locationtype,
    houseNo:req.body.houseno,
    streetName:req.body.streetname,
    city:req.body.city,
    district:req.body.district,
    state:req.body.state,
    pincode:req.body.pincode
    });

    newUser.save()
    .then(() => {
        res.render("userhome",{Username:username});
        updateObj(emailinput);
    })
    .catch((err) => {
        console.log(err);
    });

});

app.post("/userlogin",function(req,res){
    const emailinput = req.body.email;
    const password=req.body.password;

    User.findOne({email:emailinput})
    .then(function(foundUser){
        if(foundUser){
            if(foundUser.password===password){
                res.render("userhome",{Username:foundUser.name});
                updateObj(emailinput);
            }
        }
    })
    .catch((err)=>{
        console.log(err);
    })
});

app.post("/employeeregister",function(req,res){
    const empname=req.body.name;
    const empId=empname+"123";
    const area=req.body.dropdown;
    const email=req.body.email;

    const newemp=new Deliveryboy({
        name:req.body.name,
        phn:req.body.phone,
        email:req.body.email,
        employeId:empId,
        deliveryArea:req.body.dropdown,
        password:req.body.pass
    });
    newemp.save()
    .then(() => {
        res.render("home");
        // updateObj2(email,area);
    })
    .catch((err) => {
        console.log(err);
    });
}); 

app.get("/userdetails",function(req,res){
    
    User.find()
    .then(function(founduser){
        if(founduser){
        res.render("userdetails",{user:founduser});
        }else{
            res.write('<h1>No pending requests found</h1>');
        }
    })
    .catch((err) => {
        console.log(err);
    });
   
});

app.post("/employeelogin",function(req,res){
    const email=req.body.email;
    const password=req.body.password;

    Deliveryboy.findOne({email:email,approveStatus:'approved'})
    .then(function(foundemp){
        if(foundemp)
        {
            if(foundemp.password===password){
                Order.find({status:'pending',personArea:foundemp.deliveryArea})
                .then(function(foundorders){
                    if(foundorders){
                        res.render("employeehome",{orders:foundorders});
                        updateObj2(email,foundemp.deliveryArea);
                    }else{
                        res.render('<h1>No pending orders</h1>');
                    }
                })
                .catch((err)=>{
                    console.log(err);
                });
            }
        }
        else{
            res.redirect("/");
        }
    })
});

app.post("/manageemployee",function(req,res){
    const id=req.body.employeeId;

    Deliveryboy.updateOne({employeId: id}, {approveStatus: 'approved'})
    .then(function(){
        res.redirect("/manageemployee");
    })
    .catch((err) => {
        console.log(err);
    });
});

app.post("/employeehome",function(req,res){
    const id=req.body.orderId;

    Order.updateOne({orderId: id}, {status: 'completed'})
    .then(function(){
        Order.find({status:'pending',personArea:obj2.area})
            .then(function(foundorders){
                if(foundorders){
                    res.render("employeehome",{orders:foundorders});
                }else{
                    res.render('<h1>No pending orders</h1>');
                }
            })
            .catch((err)=>{
                console.log(err);
            });
    })
    .catch((err) => {
        console.log(err);
    });
})

app.post("/booking",function(req,res){
    const personname=req.body.name;
    const currentDate = new Date();
    const orderId = currentDate.getTime().toString() + Math.floor(Math.random() * 1000).toString();

    const newOrder=new Order({
        personname:req.body.name,
        personmail:req.body.email,
        personphn:req.body.phone,
        personAddress:req.body.address,
        personArea:req.body.dropdown,
        quantity:req.body.quantity,
        deliveryDate:req.body.date,
        orderId:orderId
    });

    newOrder.save()
    .then(() => {
        res.render("userhome",{Username:personname});
    })
    .catch((err) => { 
        console.log(err.message);
        res.send("Error while saving the order");
    });
});




app.listen(3001, function () {
    console.log("Server started on port 3001.");
}); 