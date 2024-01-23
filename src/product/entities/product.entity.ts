export interface product {
    name:string,
    brand:string,
    category:string,
    price:number,
    stock:number,
    gears:boolean,
    brake_type:boolean,
    suspension:boolean,
    cycle_Details:boolean,
    image:any,
    isBlocked:boolean,
    wished:boolean,
}

export interface brand {
    Brand_name: string,
    _id: string,
  }
  
  export interface category {
    category_name: string,
    _id: string
  }
  