import { Inject, HttpException, HttpStatus } from "@nestjs/common";
import { CreateProductDto } from "../../product/dto/create-product.dto";
import { UpdateProductDto } from "src/product/dto/update-product.dto";
import { brand, category, product } from "../../product/entities/product.entity";
import { Model } from "mongoose";
import { Response } from "express";
import { promises } from "dns";
import { IProductRepository } from "../interfaces/product-repostiory.interface";
const ObjectId = require('mongodb').ObjectId;

export class productRepository implements IProductRepository {
    constructor(
        @Inject('PRODUCT_MODEL')
        private _productModel: Model<product>,
        @Inject('BRAND_MODEL')
        private _brandModel: Model<brand>,
        @Inject('CATRGORY_MODEL')
        private _categoryModel: Model<category>,
        @Inject('REVIEW_MODEL')
        private _reviewModel: Model<any>
    ) { }
    //for create brand 
    async createBrand(brandName: CreateProductDto): Promise<brand> {
        try {

            const { name } = brandName;
            if (name.trim() === '') {
                throw new HttpException(
                    'enter value!!!!',
                    HttpStatus.NOT_ACCEPTABLE
                )
            }
            // Check if the brand with the given name already exists
            const existingBrand = await this._brandModel.findOne({ Brand_name: name });

            if (existingBrand) {
                throw new HttpException(
                    `Brand with name '${name}' already exists.`,
                    HttpStatus.BAD_REQUEST,
                );

            }

            // If the brand doesn't exist, create a new one
            const brand = new this._brandModel({
                Brand_name: name
            });

            // Save the new brand to the database
            return await brand.save();
        } catch (error) {

        }
    }
    // create category 
    async createCategory(categoryName: CreateProductDto): Promise<category> {
        try {

            const { name } = categoryName
            if (name.trim() === '') {
                throw new HttpException(
                    'enter value!!!!',
                    HttpStatus.NOT_ACCEPTABLE
                )
            }
            const existingBrand = await this._categoryModel.findOne({ category_name: name });

            if (existingBrand) {
                throw new HttpException(
                    `category with name '${name}' already exists.`,
                    HttpStatus.BAD_REQUEST,
                );

            }

            const category = new this._categoryModel({
                category_name: name
            })
            return await category.save();
        } catch (error) {

        }
    }

    // create the product 
    async createProduct(productData: CreateProductDto, img: any, res: any): Promise<product> {
        try {


            const image = []
            for (let f of img) {
                image.push(f.secure_url)
            }

            const { name, brake_type, brand, category, cycle_Details, gears, price, stock, suspension } = productData

            const product = new this._productModel({
                name: name,
                brake_type: brake_type,
                brand: brand,
                category: category,
                cycle_Details: cycle_Details,
                gears: gears,
                price: price,
                stock: stock,
                suspension: suspension,
                image: image
            })
            await product.save();
            return res.status(HttpStatus.CREATED).json({

            });
        } catch (error) {

        }

    }
    //update the product 
    async productUpdate(id: string, UpdateProduct: UpdateProductDto, img: any, res: Response): Promise<Response> {
        try {

            console.log('enter to repo');

            const { name, brake_type, brand, category, cycle_Details, gears, price, stock, suspension } = UpdateProduct
            if (img.length === 0) {
                await this._productModel.findByIdAndUpdate(
                    { _id: id },
                    {
                        $set: {
                            name,
                            brake_type,
                            brand,
                            category,
                            cycle_Details,
                            gears,
                            price,
                            stock,
                            suspension,

                        }
                    })
                return res.status(HttpStatus.CREATED).json({

                });
            }



            console.log('enter');

            await this._productModel.findByIdAndUpdate(
                { _id: id },
                {
                    $set: {
                        name,
                        brake_type,
                        brand,
                        category,
                        cycle_Details,
                        gears,
                        price,
                        stock,
                        suspension,
                    },
                    $push: {
                        image: { $each: img.map(f => f.secure_url) },
                    },
                },
            );
            return res.status(HttpStatus.CREATED).json({

            });
        } catch (error) {

        }
    }
    //update the brand
    async brandUpdate(id: string, UpdateBrand: UpdateProductDto): Promise<brand> {
        try {

            const { name } = UpdateBrand
            if (name.trim() === '') {
                throw new HttpException(
                    'enter value!!!!',
                    HttpStatus.NOT_ACCEPTABLE
                )
            }
            return await this._brandModel.findByIdAndUpdate({ _id: id }, {
                $set: {
                    Brand_name: name
                }
            })
        } catch (error) {

        }
    }

    async categoryUpdate(id: string, Updatecategory: UpdateProductDto): Promise<category> {
        try {

            const { name } = Updatecategory
            if (name.trim() === '') {
                throw new HttpException(
                    'enter value!!!!',
                    HttpStatus.NOT_ACCEPTABLE
                )
            }
            return await this._categoryModel.findByIdAndUpdate({ _id: id }, {
                $set: {
                    category_name: name
                }
            })
        } catch (error) {

        }

    }

    async findAllBrand(): Promise<brand[]> {
        return await this._brandModel.find()
    }
    async findAllcategory(): Promise<category[]> {
        return await this._categoryModel.find()
    }
    async findAllProduct(id: any): Promise<product[]> {
        if (id === null) {
            await this._productModel.updateMany({ $set: { wished: false } })
            const data = await this._productModel.find({ isBlocked: false }).populate('brand')
            let brandData: any
            const result = data.filter((res) => {
                brandData = res['brand']
                if (brandData['isBlocked'] === false) {
                    return res
                }
            })
            return result
        } else {

           
            const userId = new ObjectId(id);
            const data = await this._productModel.aggregate([
                {
                    $lookup: {
                        from: "brands",
                        localField: 'brand',
                        foreignField: '_id',
                        as: "brand"
                    }
                },
                {
                    $addFields: {
                        brand: { $first: '$brand' }
                    }
                },
                {
                    $lookup: {
                        from: 'wishlists',
                        localField: '_id',
                        foreignField: 'product.id',
                        as: "productData"
                    }
                },
                
                {
                    $addFields  : {
                        wished: {
                            $cond: {
                                if: { $gt: [{ $size: "$productData" }, 0] },
                                then: {
                                    $anyElementTrue: {
                                        $map: {
                                            input: "$productData",
                                            as: "product",
                                            in: {
                                                $cond: {
                                                    if: { $eq: ["$$product.user", userId] }, // Direct comparison of ObjectIds
                                                    then: true,
                                                    else: false
                                                }
                                            }
                                        }
                                    }
                                },
                                else: false
                            }
                        }
                    }
                }
                
            ]);



            console.log(data, 'mass');

            let brandData: any
            const result = data.filter((res) => {
                brandData = res['brand']
                if (brandData['isBlocked'] === false) {
                    return res
                }
            })

            return result
        }
    }
    async ProductDetails(id: string): Promise<product> {
        try {

            return await this._productModel.findById({ _id: id }).populate('brand').populate('category')
        } catch (error) {
            throw new HttpException(
                'there is some issue please try again later',
                HttpStatus.BAD_REQUEST
            )
        }
    }
    async findProductDetails(id: string): Promise<any> {
        try {

            const obj = {}
            let total = 0
            let Total = 0
            let data = await this._reviewModel.findOne({ product: id })
            if (!data) {
                const product = await this._productModel.findById({ _id: id }).populate('brand').populate('category')
                return { total, obj, product, Total }
            }
            data = data['ratings_review']
            data.forEach((res: any) => {

                res = res['ratings']
                total += res
                if (!obj[res]) {
                    obj[res] = 1
                } else {
                    obj[res] += 1
                }
            })
            Total = total
            total = total / data.length




            const product = await this._productModel.findById({ _id: id }).populate('brand').populate('category')
            return { total, obj, product, Total }
        } catch (error) {
            throw new HttpException(
                'there is some issue please try again later',
                HttpStatus.BAD_REQUEST
            )
        }
    }
    async findAllProductAdmin(): Promise<product[]> {
        try {

            return await this._productModel.find().populate('brand')
        } catch (error) {
            throw new HttpException(
                'there is some issue please try again later',
                HttpStatus.BAD_REQUEST
            )
        }
    }

    async brandDetails(id: string): Promise<brand> {
        try {

            return await this._brandModel.findById({ _id: id })
        } catch (error) {
            throw new HttpException(
                'there is some issue please try again later',
                HttpStatus.BAD_REQUEST
            )
        }
    }
    // to block or unblock the product
    async productBlock_and_unblock(id: string, productData: UpdateProductDto): Promise<product> {
        try {

            const { isBlocked } = productData
            return await this._productModel.findByIdAndUpdate({ _id: id }, { $set: { isBlocked: isBlocked } })
        } catch (error) {
            throw new HttpException(
                'there is some issue please try again later',
                HttpStatus.BAD_REQUEST
            )
        }
    }

    // to block or unblock the category
    async categoryblock(id: string, productData: UpdateProductDto): Promise<category> {
        try {

            const { isBlocked } = productData
            return await this._categoryModel.findByIdAndUpdate({ _id: id }, { $set: { isBlocked: isBlocked } })
        } catch (error) {
            throw new HttpException(
                'there is some issue please try again later',
                HttpStatus.BAD_REQUEST
            )
        }
    }

    // to block or unblock the brand
    async brandBlock(id: string, brandData: UpdateProductDto): Promise<brand> {
        try {

            console.log(brandData);
            const { isBlocked } = brandData

            return await this._brandModel.findByIdAndUpdate({ _id: id }, { $set: { isBlocked: isBlocked } })
        } catch (error) {
            throw new HttpException(
                'there is some issue please try again later',
                HttpStatus.BAD_REQUEST
            )
        }
    }
    async categoryDetails(id: string): Promise<category> {
        try {

            return await this._categoryModel.findById({ _id: id })
        } catch (error) {
            throw new HttpException(
                'there is some issue please try again later',
                HttpStatus.BAD_REQUEST
            )
        }
    }

    async findBestSeller(): Promise<product[]> {
        try {

            return await this._productModel.find().populate('brand').limit(12)
        } catch (error) {
            throw new HttpException(
                'there is some issue please try again later',
                HttpStatus.BAD_REQUEST
            )
        }
    }
    async filter(filter: CreateProductDto): Promise<product[]> {
        try {

            let obj = {}
            console.log(filter);

            const { brake_type, brand, category, suspension, gears } = filter
            console.log(brake_type, 'break');

            if (brake_type == 'true' || brake_type == 'false') {
                obj['brake_type'] = brake_type
            }
            if (suspension == 'true' || suspension == 'false') {
                obj['suspension'] = suspension
            }
            if (gears == 'true' || gears == 'false') {
                obj['gears'] = gears
            }
            if (brand !== '') {
                obj['brand'] = brand
            }
            if (category !== '') {
                obj['category'] = category
            }

            console.log(obj, 'this is obj');

            const data = await this._productModel.find(obj).populate('brand')
            console.log(data);

            return data
        } catch (error) {

        }
    }
    async imgDelete(index: number, id: string): Promise<product> {

        try {


            await this._productModel.findByIdAndUpdate(
                id,
                { $unset: { [`image.${index}`]: 1 } }
            );

            const result = await this._productModel.findByIdAndUpdate(
                id,
                { $pull: { "image": null } },
                { new: true }
            );
            return result
        } catch (error) {
            throw new HttpException(
                'there is some issue please try again later',
                HttpStatus.BAD_REQUEST
            )
        }

    }

}