
export interface User {
  _id: string,
  name: string,
  email: string,
  phone: number,
  walletHistory: wallet[],
  isBlocked: Boolean,
  isVerified: Boolean,
  password: string
}

export interface rent {
  name: string,
  price: number,
  cycle_Details: string,
  bookedDate: any,
  location: string,
  owner: any
}
export interface wallet {
  date: Date,
  amount: number,
  description: string
}

export interface address {
  city: string,
  country: string,
  district: string,
  fname: string,
  email: string,
  housename: string,
  lname: string,
  mobile: number,
  pin: number
  state: string
}
export interface rentorderDetails {
  user: any,
  Date: any,
  owner: any,
  razorId: any,
  paymentMethod: string,
  productID: any,
  totalAmount: number
}
export interface cart {
  _id: string,
  user: any,
  product: any,
  TotalAmount: number
}
export interface location {
  _id: string,
  city: string[]
}

export interface order {
  _id: string,
  user: any,
  product: any
}
export interface rent {
  _id: string,
  name: string,
  price: number,
  cycle_Details: string,
  location: string,
  owner: any,
  image: any,
  bookedDate: any
}
export interface rentorderDetails {
  user: any,
  date: any,
  owner: any,
  razorId: any,
  paymentMethod: string,
  totalAmount: number
}

export interface wishlist {
  user: any,
  product: [
    { id: string }
  ]
}