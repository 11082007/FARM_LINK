const { checkSchema } = require('express-validator');

const createUserValidationSchema = checkSchema({
    firstName: {
    isLength: {
      options: { min: 1, max: 50 },
      errorMessage: "firstName must be between 1 and 50 characters"
    },
    notEmpty: {
      errorMessage: "firstName is required"
    },
    isString: {
      errorMessage: "firstName must be a string"
    },
    trim: true
  },
  lastName: {
    isLength: {
      options: { min: 1, max: 50 },
      errorMessage: "lastName must be between 1 and 50 characters"
    },
    notEmpty: {
      errorMessage: "lastName is required"
    },
    isString: {
      errorMessage: "lastName must be a string"
    },
    trim: true
  },
  emailAddress: {
    isEmail: {
      errorMessage: "Invalid email format"
    },
    notEmpty: {
      errorMessage: "Email is required"
    }
  },
  phoneNumber: {
  notEmpty: {
    errorMessage: "Phone number is required"
  },
  isLength: {
    options: { min: 10, max: 15 },
    errorMessage: "Phone number must be between 10-15 digits"
  },
  matches: {
    options: [/^\+?[1-9]\d{1,14}$/],
    errorMessage: "Invalid phone number format"
  }
},
password: {
  isLength: {
    options: { min: 6 },
    errorMessage: "password must be at meast 6 characters long"
  },
  notEmpty: {
    errorMessage: "password is required"
  }
},
userType: {
  isIn: {
    options: [['buyer', 'farmer']],
    errorMessage: "User type must be either 'buyer' or 'farmer'"
  },
  optional: { options: { nullable: true }} //defaults to buyer
},
location: {
  isLength: {
    options: { min: 2, max: 100 },
    errorMessage: "location must be between 2 and 100 characters"
  },
  notEmpty: {
    errorMessage: "location is required"
  },
  isString: {
    errorMessage: "location must be a string"
  },
  trim: true
}
});


//seperate schema for login (only email and password)
const loginValidationSchema = checkSchema({
  emailAddress: {
    isEmail: {
      errorMessage: "Invalid email format"
    },
    notEmpty: {
      errorMessage: "Email is required"
    },
    normalizeEmail: true
  },
  password: {
    notEmpty: {
      errorMessage: "Password is required"
    }
  }
});

//schema for creating inquiries
const createInquiryValidationSchema = checkSchema({
  productId: {
    isInt: {
      errorMessage: "Product ID must be an integer"
    },
    notEmpty: {
      errorMessage: "Product ID is required"
    }
  },
  message: {
    isLength: {
      options: { min: 5, max: 500 },
      errorMessage: "Message must be between 5 and 500 characters"
    },
    notEmpty: {
      errorMessage: "Message is required"
    },
    isString: {
      errorMessage: "Message must be a string"
    },
    trim: true
  }
});

module.exports = { createUserValidationSchema, loginValidationSchema, createInquiryValidationSchema };


