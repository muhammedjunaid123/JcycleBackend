export interface IReviewRepository{
    addReview(user: string, review: string, ratings: number, productID: string):Promise<any>;
    Review(id:string):Promise<any>,
    addrentReview(user: string, review: string, ratings: number, productID: string):Promise<any>,
    rentReview(id:string):Promise<any>
}