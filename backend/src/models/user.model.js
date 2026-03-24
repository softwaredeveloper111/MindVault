import mongoose from "mongoose";
import bcrypt from "bcryptjs";



const userSchema = new mongoose.Schema({
  username: {
    type:String,
    trim:true,
    required:[true,"username should be required"],
    unique:[true,"username must be unique"],
    match: [
      /^[a-zA-Z][a-zA-Z0-9_]*$/i, 
      "Username must start with a letter and contain only letters and numbers and underscore"  
    ],
     minlength:[3,"minimum 3 characters required"],
     maxlength:[20,"maximum 20 character required"],
  },

  
  email:{
    type:String,
    trim:true,
    required:[true,"email should be required"],
    unique:[true,"email must be unique"],
    lowercase:true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email address"
    ]
  },


  password:{
    type:String,
    required:[true,"password should be required"],  
    select:false,
  },


   passwordChangedAt: {
      type: Date,
      select: false,
     },

 
 
  avatar:{
    type:String,
    default:"https://ik.imagekit.io/a490stdk4/stylish-spectacles-guy-3d-avatar-character-illustrations-png.webp?updatedAt=1770782847473"
  }
  , 


  
  settings: {
    resurfacingEnabled: {
      type: Boolean,
      default: true
    },
    resurfacingFrequency: {
      type: String,
      enum: {
        values: ['daily', 'weekly', 'monthly'],
        message: 'value should be b/w daily,weekly,monthly. Invalid resurfacing frequency'
      },
      default: 'weekly'
    },
    
    defaultView: {
      type: String,
      enum: {
        values: ['list', 'grid'],
        message: 'value should be b/w list,grid. Invalid default view'
      },
      default: 'grid'
    }
  },



  stats: {
    totalItemsSaved: {
      type: Number,
      default: 0
    },
    totalSearches: {
      type: Number,
      default: 0
    },
    lastActiveAt: {
      type: Date,
      default: Date.now
    }
  },



   passwordResetToken: {
    type: String,
    select:false,
  },

  passwordResetExpires: {
    type: Date,
    select:false
  },

  
},{timestamps:true})



/**method - to convert password into hash before store in db */
userSchema.pre('save', async function() {
 
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, Number(process.env.SALT_ROUNDS));
     this.passwordChangedAt = Date.now() - 1000;
  }
});


/** method - compare plain password  with hash password */
userSchema.methods.comparePassword = async function(plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
}



/** Ab res.json(user) se kabhi bhi sensitive fields leak nahi hongi */
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.passwordChangedAt;
  delete user.passwordResetToken;
  delete user.passwordResetExpires;
  return user;
}



const userModel = mongoose.model('User', userSchema);




export default userModel