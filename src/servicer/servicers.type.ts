export interface servicer {
    _id: string,
    name: string,
    email: string,
    phone: number,
    walletHistory: wallet[],
    isBlocked: Boolean,
    isVerified: Boolean,
    password: string
}
export interface wallet {
    date: Date,
    amount: number,
    description: string
}
export interface service {
    _id: string,
    name: string,
    price: number,
    date: Date,
    time: string,
    isBlocked: boolean,
    isBooked: boolean,
    location: string,
    owner: any,
    service_Details: string,
}

export interface serviceOrder {
    user: string,
    service: any,
    date: Date,
    time: string,
    totalAmount: number,
    owner: any,
    paymentMethod: string,
    status: string,
}