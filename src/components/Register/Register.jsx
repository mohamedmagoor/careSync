import React from 'react'
import style from './Register.module.css'
import {useFormik} from 'formik'
import { Helmet } from "react-helmet";

export default function Register() {

let formik = useFormik({
  initialValues:{
    name:"",
    email:"",
    password:"",
    rePassword:"",
    phone:""
  },
  onSubmit:(values)=>{
    console.log("hello Mada",values)
  }
});

  return (
    <>
      <Helmet>
        <title>Register - EasyCare</title>
        <meta name="description" content="Create your EasyCare account" />
      </Helmet>
      
      <div className={style.registerWrapper}>
        <div className={style.registerContainer}>
          <h2 className={style.registerTitle}>Create Account</h2>
          
          <form className={style.registerForm} onSubmit={formik.handleSubmit}>
            <div className={style.formGroup}>
              <label htmlFor="name">Full Name</label>
              <input 
                type="text" 
                className={style.formControl} 
                id='name' 
                name='name' 
                value={formik.values.name} 
                onChange={formik.handleChange}
                placeholder="Enter your full name"
              />
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="uEmail">Email Address</label>
              <input 
                type="email" 
                className={style.formControl} 
                id='uEmail' 
                name='email' 
                value={formik.values.email} 
                onChange={formik.handleChange}
                placeholder="Enter your email address"
              />
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                className={style.formControl} 
                id='password' 
                name='password' 
                value={formik.values.password} 
                onChange={formik.handleChange}
                placeholder="Create a strong password"
              />
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="RePassword">Confirm Password</label>
              <input 
                type="password" 
                className={style.formControl} 
                id='RePassword' 
                name='rePassword' 
                value={formik.values.rePassword} 
                onChange={formik.handleChange}
                placeholder="Confirm your password"
              />
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="Phone">Phone Number</label>
              <input 
                type="tel" 
                className={style.formControl} 
                id='Phone' 
                name='phone' 
                value={formik.values.phone} 
                onChange={formik.handleChange}
                placeholder="Enter your phone number"
              />
            </div>
            
            <button className={style.registerBtn} type="submit">
              Create Account
            </button> 
          </form>
        </div>
      </div>
    </>
  )
}
