import { Response } from "express";
import { CreateProductDto } from "src/product/dto/create-product.dto";
import { UpdateProductDto } from "src/product/dto/update-product.dto";
import { brand, category, product } from "src/product/entities/product.entity";

export interface IProductRepository {
    createBrand(brandName: CreateProductDto): Promise<brand>;
    createCategory(categoryName: CreateProductDto): Promise<category>;
    createProduct(productData: CreateProductDto, img: any, res: any): Promise<product>;
    productUpdate(id: string, UpdateProduct: UpdateProductDto, img: any, res: Response): Promise<Response>;
    brandUpdate(id: string, UpdateBrand: UpdateProductDto): Promise<brand>;
    categoryUpdate(id: string, Updatecategory: UpdateProductDto): Promise<category>;
    findAllBrand(): Promise<brand[]>;
    findAllcategory(): Promise<category[]>;
    findAllProduct(id:any): Promise<product[]>;
    ProductDetails(id: string): Promise<product>;
    findProductDetails(id: string): Promise<any>;
    findAllProductAdmin(): Promise<product[]>;
    brandDetails(id: string): Promise<brand>;
    productBlock_and_unblock(id: string, productData: UpdateProductDto): Promise<product>;
    categoryblock(id: string, productData: UpdateProductDto): Promise<category>;
    brandBlock(id: string, brandData: UpdateProductDto): Promise<brand>;
    categoryDetails(id: string): Promise<category>;
    findBestSeller(): Promise<product[]>;
    findBestSeller(): Promise<product[]>;
    imgDelete(index:number,id:string):Promise<product>;
}